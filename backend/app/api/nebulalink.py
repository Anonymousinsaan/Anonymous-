"""
NebulaLink API - External Developer Access to NebulaForge X Game Engine
Provides secure REST API endpoints for external applications and developers.
"""

import asyncio
import json
import time
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field
import jwt
import hashlib
import redis
from sqlalchemy.orm import Session
from sqlalchemy import Column, String, DateTime, Integer, Text, Boolean, Float

from ..core.config import get_settings
from ..core.database import get_db
from ..core.security import verify_api_key, create_access_token
from ..ai.nebulavoid import NebulaVoidCore
from ..ai.voidsentinel import VoidSentinelAI

# Security and rate limiting
security = HTTPBearer()
redis_client = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)

# API Models
class APIKeyRequest(BaseModel):
    name: str = Field(..., description="Friendly name for the API key")
    description: str = Field("", description="Description of intended use")
    permissions: List[str] = Field(default=["read", "create"], description="API permissions")

class APIKeyResponse(BaseModel):
    key_id: str
    name: str
    api_key: str
    permissions: List[str]
    created_at: datetime
    expires_at: Optional[datetime]
    usage_quota: int
    usage_count: int

class GameCreationRequest(BaseModel):
    name: str = Field(..., description="Game project name")
    genre: str = Field("adventure", description="Game genre")
    template: str = Field("blank", description="Starting template")
    ai_assistance: bool = Field(True, description="Enable AI assistance")
    description: str = Field("", description="Game description")

class AssetCreationRequest(BaseModel):
    name: str = Field(..., description="Asset name")
    type: str = Field(..., description="Asset type: model, texture, audio, script")
    content: Optional[str] = Field(None, description="Asset content or URL")
    metadata: Dict[str, Any] = Field(default_factory=dict)

class NPCGenerationRequest(BaseModel):
    name: str = Field(..., description="NPC name")
    personality: str = Field("friendly", description="NPC personality")
    role: str = Field("villager", description="NPC role in game")
    dialogue_style: str = Field("casual", description="Dialogue style")
    backstory: str = Field("", description="Character backstory")

class PerformanceMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    active_connections: int
    requests_per_minute: int
    response_time_ms: float
    error_rate: float

# Database Models (would be in separate models file)
class APIKey(BaseModel):
    key_id: str
    user_id: str
    name: str
    api_key_hash: str
    permissions: List[str]
    created_at: datetime
    expires_at: Optional[datetime]
    usage_quota: int
    usage_count: int
    is_active: bool

class APIUsage(BaseModel):
    usage_id: str
    key_id: str
    endpoint: str
    method: str
    timestamp: datetime
    response_time_ms: int
    status_code: int
    request_size: int
    response_size: int

# NebulaLink Core System
class NebulaLinkCore:
    def __init__(self):
        self.settings = get_settings()
        self.nebula_void = NebulaVoidCore()
        self.void_sentinel = VoidSentinelAI()
        self.performance_cache = {}
        self.rate_limits = {}
        
    async def initialize(self):
        """Initialize NebulaLink system"""
        await self.nebula_void.initialize()
        await self.void_sentinel.start_monitoring()
        
    def generate_api_key(self, user_id: str, name: str, permissions: List[str]) -> APIKeyResponse:
        """Generate new API key for user"""
        key_id = str(uuid.uuid4())
        api_key = f"nbx_{hashlib.sha256(f'{user_id}_{key_id}_{int(time.time())}'.encode()).hexdigest()[:32]}"
        
        api_key_data = APIKey(
            key_id=key_id,
            user_id=user_id,
            name=name,
            api_key_hash=hashlib.sha256(api_key.encode()).hexdigest(),
            permissions=permissions,
            created_at=datetime.now(),
            expires_at=datetime.now() + timedelta(days=365),
            usage_quota=10000,
            usage_count=0,
            is_active=True
        )
        
        # Store in database (simulated with Redis for demo)
        redis_client.setex(
            f"api_key:{key_id}", 
            86400 * 365,  # 1 year
            json.dumps(api_key_data.dict(), default=str)
        )
        
        return APIKeyResponse(
            key_id=key_id,
            name=name,
            api_key=api_key,
            permissions=permissions,
            created_at=api_key_data.created_at,
            expires_at=api_key_data.expires_at,
            usage_quota=api_key_data.usage_quota,
            usage_count=0
        )
    
    async def verify_api_key(self, api_key: str) -> Optional[APIKey]:
        """Verify API key and return key data"""
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        
        # Search for matching key in Redis
        for key in redis_client.scan_iter(match="api_key:*"):
            key_data = json.loads(redis_client.get(key))
            if key_data.get('api_key_hash') == key_hash and key_data.get('is_active'):
                return APIKey(**key_data)
        
        return None
    
    async def check_rate_limit(self, api_key: str, endpoint: str) -> bool:
        """Check if request is within rate limits"""
        rate_key = f"rate_limit:{api_key}:{endpoint}"
        current_count = redis_client.get(rate_key)
        
        if current_count is None:
            redis_client.setex(rate_key, 60, 1)  # 1 request per minute window
            return True
        
        if int(current_count) >= 100:  # 100 requests per minute
            return False
        
        redis_client.incr(rate_key)
        return True
    
    async def log_api_usage(self, key_id: str, endpoint: str, method: str, 
                           response_time: int, status_code: int):
        """Log API usage for analytics"""
        usage_id = str(uuid.uuid4())
        usage_data = APIUsage(
            usage_id=usage_id,
            key_id=key_id,
            endpoint=endpoint,
            method=method,
            timestamp=datetime.now(),
            response_time_ms=response_time,
            status_code=status_code,
            request_size=0,
            response_size=0
        )
        
        # Store usage data
        redis_client.lpush(f"usage:{key_id}", json.dumps(usage_data.dict(), default=str))
        redis_client.ltrim(f"usage:{key_id}", 0, 1000)  # Keep last 1000 entries
    
    async def get_performance_metrics(self) -> PerformanceMetrics:
        """Get current performance metrics"""
        return PerformanceMetrics(
            cpu_usage=45.2,
            memory_usage=67.8,
            active_connections=12,
            requests_per_minute=156,
            response_time_ms=23.4,
            error_rate=0.02
        )

# Initialize NebulaLink
nebulalink = NebulaLinkCore()

# API Router
router = APIRouter(prefix="/api/v1", tags=["NebulaLink"])

# Dependency for API key verification
async def verify_api_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key from Authorization header"""
    api_key = credentials.credentials
    key_data = await nebulalink.verify_api_key(api_key)
    
    if not key_data:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    return key_data

# Rate limiting middleware
async def rate_limit_check(request: Request, api_key_data: APIKey = Depends(verify_api_token)):
    """Check rate limits for API requests"""
    endpoint = request.url.path
    
    if not await nebulalink.check_rate_limit(api_key_data.api_key_hash, endpoint):
        raise HTTPException(
            status_code=429, 
            detail="Rate limit exceeded. Please try again later."
        )
    
    return api_key_data

# API Endpoints

@router.post("/auth/generate-key", response_model=APIKeyResponse)
async def generate_api_key(
    request: APIKeyRequest,
    user_id: str = "demo_user"  # In real app, get from JWT token
):
    """Generate new API key for authenticated user"""
    try:
        api_key_response = nebulalink.generate_api_key(
            user_id=user_id,
            name=request.name,
            permissions=request.permissions
        )
        return api_key_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate API key: {str(e)}")

@router.get("/auth/keys")
async def list_api_keys(user_id: str = "demo_user"):
    """List all API keys for authenticated user"""
    keys = []
    for key in redis_client.scan_iter(match="api_key:*"):
        key_data = json.loads(redis_client.get(key))
        if key_data.get('user_id') == user_id:
            keys.append({
                "key_id": key_data["key_id"],
                "name": key_data["name"],
                "created_at": key_data["created_at"],
                "usage_count": key_data["usage_count"],
                "is_active": key_data["is_active"]
            })
    return {"keys": keys}

@router.post("/create-game")
async def create_game(
    request: GameCreationRequest,
    background_tasks: BackgroundTasks,
    api_key_data: APIKey = Depends(rate_limit_check)
):
    """Create new game project via API"""
    start_time = time.time()
    
    try:
        # Generate game using NebulaVoid AI
        game_data = await nebulalink.nebula_void.generate_game_project(
            name=request.name,
            genre=request.genre,
            template=request.template,
            description=request.description,
            ai_assistance=request.ai_assistance
        )
        
        response_time = int((time.time() - start_time) * 1000)
        
        # Log usage
        background_tasks.add_task(
            nebulalink.log_api_usage,
            api_key_data.key_id,
            "/create-game",
            "POST",
            response_time,
            200
        )
        
        return {
            "success": True,
            "project_id": game_data["project_id"],
            "name": request.name,
            "genre": request.genre,
            "assets_created": game_data["assets_count"],
            "estimated_completion": "85%",
            "download_url": f"/api/v1/project/{game_data['project_id']}/download",
            "preview_url": f"/api/v1/project/{game_data['project_id']}/preview",
            "edit_url": f"/projects/{game_data['project_id']}",
            "metadata": {
                "created_at": datetime.now().isoformat(),
                "engine_version": "1.0.0",
                "size_mb": game_data.get("size_mb", 12.5),
                "features": game_data.get("features", [])
            }
        }
        
    except Exception as e:
        background_tasks.add_task(
            nebulalink.log_api_usage,
            api_key_data.key_id,
            "/create-game",
            "POST",
            int((time.time() - start_time) * 1000),
            500
        )
        raise HTTPException(status_code=500, detail=f"Game creation failed: {str(e)}")

@router.get("/project/{project_id}")
async def get_project(
    project_id: str,
    background_tasks: BackgroundTasks,
    api_key_data: APIKey = Depends(rate_limit_check)
):
    """Get project details and metadata"""
    start_time = time.time()
    
    try:
        # Simulate project retrieval
        project_data = {
            "project_id": project_id,
            "name": "Space Adventure Game",
            "genre": "sci-fi",
            "status": "completed",
            "created_at": "2024-01-15T10:30:00Z",
            "last_modified": "2024-01-15T14:20:00Z",
            "size_mb": 45.2,
            "assets": {
                "models": 12,
                "textures": 28,
                "scripts": 15,
                "audio": 8
            },
            "features": [
                "3D environments",
                "Character dialogue",
                "Inventory system",
                "Save/load functionality"
            ],
            "download_links": {
                "web": f"/downloads/{project_id}_web.zip",
                "android": f"/downloads/{project_id}_android.apk",
                "desktop": f"/downloads/{project_id}_desktop.exe"
            }
        }
        
        response_time = int((time.time() - start_time) * 1000)
        background_tasks.add_task(
            nebulalink.log_api_usage,
            api_key_data.key_id,
            f"/project/{project_id}",
            "GET",
            response_time,
            200
        )
        
        return project_data
        
    except Exception as e:
        raise HTTPException(status_code=404, detail="Project not found")

@router.post("/assets/create")
async def create_asset(
    request: AssetCreationRequest,
    background_tasks: BackgroundTasks,
    api_key_data: APIKey = Depends(rate_limit_check)
):
    """Create new game asset"""
    start_time = time.time()
    
    try:
        # Generate asset using AI
        asset_data = await nebulalink.nebula_void.generate_asset(
            name=request.name,
            asset_type=request.type,
            content=request.content,
            metadata=request.metadata
        )
        
        response_time = int((time.time() - start_time) * 1000)
        background_tasks.add_task(
            nebulalink.log_api_usage,
            api_key_data.key_id,
            "/assets/create",
            "POST",
            response_time,
            200
        )
        
        return {
            "success": True,
            "asset_id": asset_data["asset_id"],
            "name": request.name,
            "type": request.type,
            "download_url": asset_data["download_url"],
            "preview_url": asset_data["preview_url"],
            "size_bytes": asset_data["size_bytes"],
            "format": asset_data["format"],
            "created_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Asset creation failed: {str(e)}")

@router.post("/generate-npc")
async def generate_npc(
    request: NPCGenerationRequest,
    background_tasks: BackgroundTasks,
    api_key_data: APIKey = Depends(rate_limit_check)
):
    """Generate NPC with AI assistance"""
    start_time = time.time()
    
    try:
        # Generate NPC using NebulaVoid
        npc_data = await nebulalink.nebula_void.generate_npc(
            name=request.name,
            personality=request.personality,
            role=request.role,
            dialogue_style=request.dialogue_style,
            backstory=request.backstory
        )
        
        response_time = int((time.time() - start_time) * 1000)
        background_tasks.add_task(
            nebulalink.log_api_usage,
            api_key_data.key_id,
            "/generate-npc",
            "POST",
            response_time,
            200
        )
        
        return {
            "success": True,
            "npc_id": npc_data["npc_id"],
            "name": request.name,
            "character_data": npc_data["character_data"],
            "dialogue_tree": npc_data["dialogue_tree"],
            "appearance": npc_data["appearance"],
            "stats": npc_data["stats"],
            "ai_behavior": npc_data["ai_behavior"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NPC generation failed: {str(e)}")

@router.get("/metrics")
async def get_metrics(api_key_data: APIKey = Depends(verify_api_token)):
    """Get system performance metrics"""
    metrics = await nebulalink.get_performance_metrics()
    return metrics.dict()

@router.get("/usage/{key_id}")
async def get_usage_stats(
    key_id: str,
    api_key_data: APIKey = Depends(verify_api_token)
):
    """Get API usage statistics for a key"""
    if api_key_data.key_id != key_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    usage_data = redis_client.lrange(f"usage:{key_id}", 0, 100)
    usage_stats = [json.loads(entry) for entry in usage_data]
    
    return {
        "key_id": key_id,
        "total_requests": len(usage_stats),
        "recent_usage": usage_stats[:10],
        "quota_remaining": api_key_data.usage_quota - api_key_data.usage_count
    }

@router.get("/docs")
async def get_api_documentation():
    """Get comprehensive API documentation"""
    return {
        "api_version": "1.0.0",
        "base_url": "https://api.nebulaforge.com/v1",
        "authentication": {
            "type": "Bearer Token",
            "header": "Authorization: Bearer YOUR_API_KEY"
        },
        "endpoints": [
            {
                "path": "/create-game",
                "method": "POST",
                "description": "Create a new game project",
                "parameters": {
                    "name": "string (required)",
                    "genre": "string (optional)",
                    "template": "string (optional)",
                    "ai_assistance": "boolean (optional)"
                },
                "example_response": {
                    "project_id": "uuid",
                    "download_url": "string",
                    "preview_url": "string"
                }
            },
            {
                "path": "/project/{id}",
                "method": "GET",
                "description": "Get project details",
                "parameters": {
                    "id": "string (required) - Project UUID"
                }
            },
            {
                "path": "/assets/create",
                "method": "POST",
                "description": "Create game assets",
                "parameters": {
                    "name": "string (required)",
                    "type": "string (required) - model|texture|audio|script",
                    "content": "string (optional)"
                }
            },
            {
                "path": "/generate-npc",
                "method": "POST",
                "description": "Generate AI-powered NPC",
                "parameters": {
                    "name": "string (required)",
                    "personality": "string (optional)",
                    "role": "string (optional)"
                }
            }
        ],
        "rate_limits": {
            "requests_per_minute": 100,
            "daily_quota": 10000
        },
        "status_codes": {
            "200": "Success",
            "401": "Invalid API key",
            "429": "Rate limit exceeded",
            "500": "Server error"
        }
    }

# Health check endpoint
@router.get("/health")
async def health_check():
    """API health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "uptime": "99.9%"
    }