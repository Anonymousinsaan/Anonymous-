"""
NebulaForge X - Main Backend Application
AI-Powered 3D Game Engine Backend
"""

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn
import asyncio
import logging
from typing import Dict, List, Any
import json
import os
from datetime import datetime

from app.api import auth, projects, ai_modules, assets, multiplayer
from app.core.voidkernel import VoidKernel
from app.core.websocket_manager import ConnectionManager
from app.core.config import get_settings
from app.ai.nebulavoid import NebulaVoidX
from app.ai.stellarforge import StellarForge2
from app.ai.oblivionmesh import OblivionMesh
from app.ai.aethercore import AetherCore
from app.ai.echosim import EchoSim
from app.ai.chronoframe import ChronoFrame
from app.ai.sentinelflux import SentinelFlux
from app.ai.nebula_agent import NebulaAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Initialize FastAPI app
app = FastAPI(
    title="NebulaForge X API",
    description="AI-Powered 3D Game Engine Backend",
    version="1.0.0",
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize core systems
void_kernel = VoidKernel()
connection_manager = ConnectionManager()

# Initialize AI modules
ai_modules_registry = {
    "nebulavoid": NebulaVoidX(),
    "stellarforge": StellarForge2(),
    "oblivionmesh": OblivionMesh(),
    "aethercore": AetherCore(),
    "echosim": EchoSim(),
    "chronoframe": ChronoFrame(),
    "sentinelflux": SentinelFlux(),
    "nebula_agent": NebulaAgent()
}

# Include API routes
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(ai_modules.router, prefix="/api/ai", tags=["ai-modules"])
app.include_router(assets.router, prefix="/api/assets", tags=["assets"])
app.include_router(multiplayer.router, prefix="/api/multiplayer", tags=["multiplayer"])

@app.on_event("startup")
async def startup_event():
    """Initialize the application"""
    logger.info("🚀 Starting NebulaForge X Backend...")
    
    # Initialize VoidKernel
    await void_kernel.initialize()
    
    # Initialize all AI modules
    for name, module in ai_modules_registry.items():
        try:
            await module.initialize()
            logger.info(f"✅ Initialized {name}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize {name}: {e}")
    
    # Start background tasks
    asyncio.create_task(void_kernel.start_monitoring())
    asyncio.create_task(sentinel_flux_monitor())
    
    logger.info("🌟 NebulaForge X Backend ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down NebulaForge X Backend...")
    await void_kernel.shutdown()

async def sentinel_flux_monitor():
    """Background task for SentinelFlux autonomous monitoring"""
    while True:
        try:
            sentinel = ai_modules_registry["sentinelflux"]
            await sentinel.autonomous_scan()
            await asyncio.sleep(30)  # Scan every 30 seconds
        except Exception as e:
            logger.error(f"SentinelFlux error: {e}")
            await asyncio.sleep(60)

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """Main WebSocket endpoint for real-time communication"""
    await connection_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Route message to appropriate handler
            response = await handle_websocket_message(message, client_id)
            await connection_manager.send_personal_message(response, client_id)
            
    except WebSocketDisconnect:
        connection_manager.disconnect(client_id)
        logger.info(f"Client {client_id} disconnected")

async def handle_websocket_message(message: Dict[str, Any], client_id: str) -> Dict[str, Any]:
    """Handle incoming WebSocket messages"""
    try:
        message_type = message.get("type")
        data = message.get("data", {})
        
        if message_type == "ai_request":
            # Route to appropriate AI module
            module_name = data.get("module", "nebulavoid")
            if module_name in ai_modules_registry:
                result = await ai_modules_registry[module_name].process_request(data)
                return {"type": "ai_response", "data": result}
        
        elif message_type == "engine_command":
            # Handle engine commands
            result = await void_kernel.execute_command(data)
            return {"type": "engine_response", "data": result}
        
        elif message_type == "realtime_preview":
            # Handle real-time preview updates
            result = await handle_preview_update(data)
            return {"type": "preview_update", "data": result}
        
        return {"type": "error", "data": {"message": "Unknown message type"}}
        
    except Exception as e:
        logger.error(f"WebSocket message error: {e}")
        return {"type": "error", "data": {"message": str(e)}}

async def handle_preview_update(data: Dict[str, Any]) -> Dict[str, Any]:
    """Handle real-time preview updates"""
    # This would integrate with EchoSim for live simulation
    echo_sim = ai_modules_registry["echosim"]
    return await echo_sim.update_preview(data)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NebulaForge X Backend API",
        "version": "1.0.0",
        "status": "active",
        "modules": list(ai_modules_registry.keys())
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "modules": {
            name: await module.get_status()
            for name, module in ai_modules_registry.items()
        }
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )