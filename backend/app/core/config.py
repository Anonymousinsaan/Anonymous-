"""
Configuration settings for NebulaForge X
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # App settings
    app_name: str = "NebulaForge X"
    debug: bool = True
    version: str = "1.0.0"
    
    # Security
    secret_key: str = "nebulaforge-x-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # OAuth Settings
    google_client_id: str = "your-google-client-id.apps.googleusercontent.com"
    google_client_secret: str = "your-google-client-secret"
    github_client_id: str = "your-github-client-id"
    github_client_secret: str = "your-github-client-secret"
    oauth_redirect_uri: str = "http://localhost:5173/auth/callback"
    
    # Frontend URL
    frontend_url: str = "http://localhost:5173"
    
    # Database
    database_url: str = "sqlite:///./nebulaforge.db"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # AI Settings
    ai_model_cache_dir: str = "./models"
    max_ai_workers: int = 4
    ai_timeout_seconds: int = 300
    
    # File storage
    upload_dir: str = "./uploads"
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    
    # Real-time settings
    websocket_heartbeat_interval: int = 30
    max_connections_per_user: int = 5
    
    # SentinelFlux settings
    sentinel_scan_interval: int = 30
    sentinel_auto_fix: bool = True
    sentinel_backup_before_fix: bool = True
    
    # Performance
    max_concurrent_ai_requests: int = 10
    cache_ttl_seconds: int = 3600
    
    class Config:
        env_file = ".env"
        case_sensitive = False

_settings: Optional[Settings] = None

def get_settings() -> Settings:
    """Get application settings (singleton)"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings