"""
VoidKernel - Central AI Coordination System
The brain that orchestrates all AI modules in NebulaForge X
"""

import asyncio
import logging
import json
import time
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum
import uuid

logger = logging.getLogger(__name__)

class Priority(Enum):
    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4

class TaskStatus(Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

@dataclass
class AITask:
    """Represents a task for AI processing"""
    id: str
    module: str
    action: str
    data: Dict[str, Any]
    priority: Priority
    created_at: datetime
    user_id: Optional[str] = None
    project_id: Optional[str] = None
    status: TaskStatus = TaskStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    dependencies: List[str] = None
    callbacks: List[str] = None
    
    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []
        if self.callbacks is None:
            self.callbacks = []

class VoidKernel:
    """Central AI coordination system"""
    
    def __init__(self):
        self.task_queue: asyncio.PriorityQueue = asyncio.PriorityQueue()
        self.active_tasks: Dict[str, AITask] = {}
        self.completed_tasks: Dict[str, AITask] = {}
        self.ai_modules: Dict[str, Any] = {}
        self.event_handlers: Dict[str, List[Callable]] = {}
        self.performance_metrics: Dict[str, Any] = {}
        self.is_running = False
        self.worker_tasks: List[asyncio.Task] = []
        self.max_workers = 4
        
        # Inter-module communication channels
        self.message_channels: Dict[str, asyncio.Queue] = {}
        self.broadcast_channel: asyncio.Queue = asyncio.Queue()
        
        # Memory vault for context persistence
        self.memory_vault: Dict[str, Dict[str, Any]] = {}
        
    async def initialize(self):
        """Initialize the VoidKernel"""
        logger.info("🔮 Initializing VoidKernel...")
        
        # Initialize performance tracking
        self.performance_metrics = {
            "tasks_processed": 0,
            "average_processing_time": 0,
            "error_rate": 0,
            "module_performance": {},
            "last_reset": datetime.utcnow()
        }
        
        # Create message channels for each module
        module_names = [
            "nebulavoid", "stellarforge", "oblivionmesh", 
            "aethercore", "echosim", "chronoframe", 
            "sentinelflux", "nebula_agent"
        ]
        
        for module in module_names:
            self.message_channels[module] = asyncio.Queue()
        
        self.is_running = True
        logger.info("✅ VoidKernel initialized")
    
    async def register_ai_module(self, name: str, module: Any):
        """Register an AI module with the kernel"""
        self.ai_modules[name] = module
        logger.info(f"📝 Registered AI module: {name}")
    
    async def submit_task(self, 
                         module: str, 
                         action: str, 
                         data: Dict[str, Any],
                         priority: Priority = Priority.NORMAL,
                         user_id: Optional[str] = None,
                         project_id: Optional[str] = None,
                         dependencies: List[str] = None) -> str:
        """Submit a task to the AI processing queue"""
        
        task_id = str(uuid.uuid4())
        task = AITask(
            id=task_id,
            module=module,
            action=action,
            data=data,
            priority=priority,
            created_at=datetime.utcnow(),
            user_id=user_id,
            project_id=project_id,
            dependencies=dependencies or []
        )
        
        # Add to queue with priority
        priority_value = priority.value
        await self.task_queue.put((priority_value, time.time(), task))
        
        logger.info(f"📋 Task submitted: {task_id} ({module}.{action})")
        return task_id
    
    async def start_monitoring(self):
        """Start the main processing loop"""
        logger.info("🎯 Starting VoidKernel monitoring...")
        
        # Start worker tasks
        for i in range(self.max_workers):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self.worker_tasks.append(worker)
        
        # Start message broker
        asyncio.create_task(self._message_broker())
        
        # Start performance monitoring
        asyncio.create_task(self._performance_monitor())
    
    async def _worker(self, worker_name: str):
        """Worker task for processing AI requests"""
        logger.info(f"👷 Worker {worker_name} started")
        
        while self.is_running:
            try:
                # Get task from queue
                priority, timestamp, task = await asyncio.wait_for(
                    self.task_queue.get(), timeout=1.0
                )
                
                # Check dependencies
                if not await self._check_dependencies(task):
                    # Re-queue if dependencies not met
                    await self.task_queue.put((priority, timestamp, task))
                    await asyncio.sleep(0.1)
                    continue
                
                # Process task
                await self._process_task(task, worker_name)
                
            except asyncio.TimeoutError:
                continue
            except Exception as e:
                logger.error(f"Worker {worker_name} error: {e}")
                await asyncio.sleep(1)
    
    async def _process_task(self, task: AITask, worker_name: str):
        """Process an individual AI task"""
        task.status = TaskStatus.RUNNING
        self.active_tasks[task.id] = task
        
        start_time = time.time()
        
        try:
            logger.info(f"🔄 Processing task {task.id} on {worker_name}")
            
            # Get the AI module
            if task.module not in self.ai_modules:
                raise ValueError(f"Unknown AI module: {task.module}")
            
            module = self.ai_modules[task.module]
            
            # Prepare context from memory vault
            context = self._get_task_context(task)
            enhanced_data = {**task.data, "context": context}
            
            # Execute the task
            if hasattr(module, task.action):
                method = getattr(module, task.action)
                result = await method(enhanced_data)
            else:
                result = await module.process_request({
                    "action": task.action,
                    "data": enhanced_data
                })
            
            # Store result
            task.result = result
            task.status = TaskStatus.COMPLETED
            
            # Update memory vault
            self._update_memory_vault(task, result)
            
            # Broadcast completion
            await self._broadcast_event("task_completed", {
                "task_id": task.id,
                "module": task.module,
                "result": result
            })
            
            # Update performance metrics
            processing_time = time.time() - start_time
            self._update_performance_metrics(task.module, processing_time, True)
            
            logger.info(f"✅ Task {task.id} completed in {processing_time:.2f}s")
            
        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            
            self._update_performance_metrics(task.module, time.time() - start_time, False)
            
            logger.error(f"❌ Task {task.id} failed: {e}")
            
            # Broadcast error
            await self._broadcast_event("task_failed", {
                "task_id": task.id,
                "module": task.module,
                "error": str(e)
            })
        
        finally:
            # Move from active to completed
            if task.id in self.active_tasks:
                del self.active_tasks[task.id]
            self.completed_tasks[task.id] = task
            
            # Cleanup old completed tasks (keep last 1000)
            if len(self.completed_tasks) > 1000:
                oldest_tasks = sorted(
                    self.completed_tasks.items(),
                    key=lambda x: x[1].created_at
                )[:500]
                for task_id, _ in oldest_tasks:
                    del self.completed_tasks[task_id]
    
    async def _check_dependencies(self, task: AITask) -> bool:
        """Check if task dependencies are satisfied"""
        for dep_id in task.dependencies:
            if dep_id not in self.completed_tasks:
                return False
            if self.completed_tasks[dep_id].status != TaskStatus.COMPLETED:
                return False
        return True
    
    def _get_task_context(self, task: AITask) -> Dict[str, Any]:
        """Get context for task from memory vault"""
        context = {}
        
        if task.user_id and task.user_id in self.memory_vault:
            context["user"] = self.memory_vault[task.user_id]
        
        if task.project_id and task.project_id in self.memory_vault:
            context["project"] = self.memory_vault[task.project_id]
        
        # Add dependency results
        for dep_id in task.dependencies:
            if dep_id in self.completed_tasks:
                dep_task = self.completed_tasks[dep_id]
                if dep_task.result:
                    context[f"dependency_{dep_id}"] = dep_task.result
        
        return context
    
    def _update_memory_vault(self, task: AITask, result: Dict[str, Any]):
        """Update memory vault with task results"""
        if task.user_id:
            if task.user_id not in self.memory_vault:
                self.memory_vault[task.user_id] = {}
            
            # Store recent task results for user
            if "recent_tasks" not in self.memory_vault[task.user_id]:
                self.memory_vault[task.user_id]["recent_tasks"] = []
            
            self.memory_vault[task.user_id]["recent_tasks"].append({
                "task_id": task.id,
                "module": task.module,
                "action": task.action,
                "result_summary": self._summarize_result(result),
                "timestamp": task.created_at.isoformat()
            })
            
            # Keep only last 50 tasks per user
            if len(self.memory_vault[task.user_id]["recent_tasks"]) > 50:
                self.memory_vault[task.user_id]["recent_tasks"] = \
                    self.memory_vault[task.user_id]["recent_tasks"][-50:]
    
    def _summarize_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Create a summary of the task result for memory vault"""
        # This is a simplified summarization - could be enhanced with AI
        return {
            "type": result.get("type"),
            "status": result.get("status"),
            "key_outputs": list(result.keys())[:5]  # Keep top 5 keys
        }
    
    async def _message_broker(self):
        """Handle inter-module communication"""
        while self.is_running:
            try:
                # Check for broadcast messages
                if not self.broadcast_channel.empty():
                    message = await self.broadcast_channel.get()
                    await self._handle_broadcast_message(message)
                
                # Check module-specific channels
                for module_name, channel in self.message_channels.items():
                    if not channel.empty():
                        message = await channel.get()
                        await self._handle_module_message(module_name, message)
                
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Message broker error: {e}")
                await asyncio.sleep(1)
    
    async def _broadcast_event(self, event_type: str, data: Dict[str, Any]):
        """Broadcast an event to all interested modules"""
        message = {
            "type": event_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        await self.broadcast_channel.put(message)
    
    async def _handle_broadcast_message(self, message: Dict[str, Any]):
        """Handle broadcast messages"""
        event_type = message.get("type")
        if event_type in self.event_handlers:
            for handler in self.event_handlers[event_type]:
                try:
                    await handler(message)
                except Exception as e:
                    logger.error(f"Event handler error: {e}")
    
    async def _handle_module_message(self, module_name: str, message: Dict[str, Any]):
        """Handle module-specific messages"""
        if module_name in self.ai_modules:
            try:
                module = self.ai_modules[module_name]
                if hasattr(module, "handle_message"):
                    await module.handle_message(message)
            except Exception as e:
                logger.error(f"Module message handler error: {e}")
    
    def _update_performance_metrics(self, module: str, processing_time: float, success: bool):
        """Update performance metrics"""
        self.performance_metrics["tasks_processed"] += 1
        
        if module not in self.performance_metrics["module_performance"]:
            self.performance_metrics["module_performance"][module] = {
                "total_tasks": 0,
                "total_time": 0,
                "success_count": 0,
                "error_count": 0
            }
        
        metrics = self.performance_metrics["module_performance"][module]
        metrics["total_tasks"] += 1
        metrics["total_time"] += processing_time
        
        if success:
            metrics["success_count"] += 1
        else:
            metrics["error_count"] += 1
    
    async def _performance_monitor(self):
        """Monitor and log performance metrics"""
        while self.is_running:
            try:
                await asyncio.sleep(60)  # Log every minute
                
                total_tasks = self.performance_metrics["tasks_processed"]
                if total_tasks > 0:
                    logger.info(f"📊 VoidKernel Performance: {total_tasks} tasks processed")
                    
                    for module, metrics in self.performance_metrics["module_performance"].items():
                        avg_time = metrics["total_time"] / metrics["total_tasks"]
                        success_rate = metrics["success_count"] / metrics["total_tasks"] * 100
                        logger.info(f"  {module}: {avg_time:.2f}s avg, {success_rate:.1f}% success")
                
            except Exception as e:
                logger.error(f"Performance monitor error: {e}")
    
    async def execute_command(self, command: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a direct engine command"""
        try:
            cmd_type = command.get("type")
            
            if cmd_type == "get_status":
                return {
                    "status": "active",
                    "active_tasks": len(self.active_tasks),
                    "queue_size": self.task_queue.qsize(),
                    "performance": self.performance_metrics
                }
            
            elif cmd_type == "get_task_status":
                task_id = command.get("task_id")
                if task_id in self.active_tasks:
                    return {"task": asdict(self.active_tasks[task_id])}
                elif task_id in self.completed_tasks:
                    return {"task": asdict(self.completed_tasks[task_id])}
                else:
                    return {"error": "Task not found"}
            
            elif cmd_type == "cancel_task":
                task_id = command.get("task_id")
                if task_id in self.active_tasks:
                    self.active_tasks[task_id].status = TaskStatus.CANCELLED
                    return {"status": "cancelled"}
                else:
                    return {"error": "Task not found or not active"}
            
            else:
                return {"error": f"Unknown command type: {cmd_type}"}
                
        except Exception as e:
            return {"error": str(e)}
    
    async def shutdown(self):
        """Shutdown the VoidKernel"""
        logger.info("🛑 Shutting down VoidKernel...")
        self.is_running = False
        
        # Cancel all worker tasks
        for task in self.worker_tasks:
            task.cancel()
        
        # Wait for workers to finish
        await asyncio.gather(*self.worker_tasks, return_exceptions=True)
        
        logger.info("✅ VoidKernel shutdown complete")