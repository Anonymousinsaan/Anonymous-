"""
SentinelFlux - Self-Healing Autonomous AI
Continuously scans backend code, UI bindings, asset calls and fixes issues automatically
"""

import asyncio
import logging
import json
import ast
import re
import os
import shutil
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)

class CodeIssue:
    """Represents a code issue found by SentinelFlux"""
    def __init__(self, file_path: str, line: int, issue_type: str, severity: str, 
                 description: str, suggested_fix: str = None):
        self.id = str(uuid.uuid4())
        self.file_path = file_path
        self.line = line
        self.issue_type = issue_type
        self.severity = severity
        self.description = description
        self.suggested_fix = suggested_fix
        self.detected_at = datetime.utcnow()
        self.fixed = False
        self.fix_applied_at = None

class SentinelLog:
    """Maintains a log of all SentinelFlux actions"""
    def __init__(self):
        self.entries = []
        self.max_entries = 1000
    
    def add_entry(self, action: str, details: Dict[str, Any], severity: str = "info"):
        entry = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "details": details,
            "severity": severity
        }
        self.entries.append(entry)
        
        # Keep only the most recent entries
        if len(self.entries) > self.max_entries:
            self.entries = self.entries[-self.max_entries:]
    
    def get_recent_entries(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.entries[-limit:]

class SentinelFlux:
    """Self-healing autonomous AI system"""
    
    def __init__(self):
        self.is_scanning = False
        self.scan_interval = 30  # seconds
        self.auto_fix_enabled = True
        self.backup_before_fix = True
        self.issues_detected = {}
        self.fixes_applied = {}
        self.scan_patterns = {}
        self.user_preferences = {}
        self.learning_data = {}
        self.sentinel_log = SentinelLog()
        
        # Define scan patterns for different issue types
        self._initialize_scan_patterns()
    
    def _initialize_scan_patterns(self):
        """Initialize patterns for detecting code issues"""
        self.scan_patterns = {
            "syntax_errors": {
                "javascript": [
                    r"console\.log\(",  # Debug statements left in code
                    r"debugger;",  # Debugger statements
                    r"alert\(",  # Alert statements
                    r"var\s+\w+",  # Use of var instead of let/const
                    r"==\s*[^=]",  # Loose equality
                ],
                "python": [
                    r"print\(",  # Debug print statements
                    r"import\s+pdb",  # Debugger imports
                    r"pdb\.set_trace\(\)",  # Debugger calls
                    r"^\s*#\s*TODO",  # TODO comments
                ],
                "typescript": [
                    r"any\s*[;}]",  # Use of 'any' type
                    r"console\.log\(",  # Debug statements
                    r"@ts-ignore",  # TypeScript ignore comments
                ]
            },
            "performance_issues": {
                "javascript": [
                    r"for\s*\(\s*let\s+\w+\s*=\s*0.*length",  # Inefficient loops
                    r"document\.querySelector.*\)",  # Repeated DOM queries
                    r"setInterval.*\d+\)",  # Potential memory leaks
                ],
                "python": [
                    r"list\(\w+\)",  # Unnecessary list conversions
                    r".*\.append\(.*\)",  # List appends in loops
                ]
            },
            "security_issues": {
                "javascript": [
                    r"eval\(",  # Eval usage
                    r"innerHTML\s*=",  # Direct innerHTML assignment
                    r"document\.write\(",  # Document.write usage
                ],
                "python": [
                    r"exec\(",  # Exec usage
                    r"os\.system\(",  # Direct system calls
                    r"subprocess\.call\(",  # Subprocess calls
                ]
            },
            "missing_dependencies": {
                "javascript": [
                    r"import.*from\s*['\"]([^'\"]*)['\"]",  # Import statements
                    r"require\(['\"]([^'\"]*)['\"]\)",  # Require statements
                ],
                "python": [
                    r"import\s+(\w+)",  # Import statements
                    r"from\s+(\w+)",  # From imports
                ]
            }
        }
    
    async def initialize(self):
        """Initialize SentinelFlux"""
        logger.info("🛡️ Initializing SentinelFlux...")
        
        # Load user preferences
        await self._load_user_preferences()
        
        # Initialize learning patterns
        await self._initialize_learning_patterns()
        
        # Create backup directory
        await self._ensure_backup_directory()
        
        self.sentinel_log.add_entry(
            "initialization", 
            {"status": "success", "auto_fix": self.auto_fix_enabled},
            "info"
        )
        
        logger.info("✅ SentinelFlux initialized")
    
    async def autonomous_scan(self):
        """Perform autonomous scanning of the codebase"""
        if self.is_scanning:
            return  # Already scanning
        
        self.is_scanning = True
        
        try:
            logger.info("🔍 SentinelFlux starting autonomous scan...")
            
            # Scan different parts of the codebase
            frontend_issues = await self._scan_frontend_code()
            backend_issues = await self._scan_backend_code()
            config_issues = await self._scan_configuration_files()
            dependency_issues = await self._scan_dependencies()
            
            all_issues = frontend_issues + backend_issues + config_issues + dependency_issues
            
            # Log scan results
            self.sentinel_log.add_entry(
                "autonomous_scan",
                {
                    "issues_found": len(all_issues),
                    "frontend_issues": len(frontend_issues),
                    "backend_issues": len(backend_issues),
                    "config_issues": len(config_issues),
                    "dependency_issues": len(dependency_issues)
                },
                "info"
            )
            
            # Auto-fix issues if enabled
            if self.auto_fix_enabled and all_issues:
                await self._auto_fix_issues(all_issues)
            
            # Store issues for review
            for issue in all_issues:
                self.issues_detected[issue.id] = issue
            
            # Learn from patterns
            await self._update_learning_patterns(all_issues)
            
            logger.info(f"🎯 SentinelFlux scan complete: {len(all_issues)} issues found")
            
        except Exception as e:
            logger.error(f"SentinelFlux scan error: {e}")
            self.sentinel_log.add_entry(
                "scan_error",
                {"error": str(e)},
                "error"
            )
        finally:
            self.is_scanning = False
    
    async def _scan_frontend_code(self) -> List[CodeIssue]:
        """Scan frontend code for issues"""
        issues = []
        frontend_paths = ["src", "public"]
        
        for path in frontend_paths:
            if os.path.exists(path):
                issues.extend(await self._scan_directory(path, ["js", "ts", "tsx", "jsx"]))
        
        return issues
    
    async def _scan_backend_code(self) -> List[CodeIssue]:
        """Scan backend code for issues"""
        issues = []
        backend_paths = ["backend"]
        
        for path in backend_paths:
            if os.path.exists(path):
                issues.extend(await self._scan_directory(path, ["py"]))
        
        return issues
    
    async def _scan_configuration_files(self) -> List[CodeIssue]:
        """Scan configuration files for issues"""
        issues = []
        config_files = [
            "package.json", "tsconfig.json", "vite.config.ts",
            "backend/requirements.txt", ".env"
        ]
        
        for file_path in config_files:
            if os.path.exists(file_path):
                issues.extend(await self._scan_config_file(file_path))
        
        return issues
    
    async def _scan_dependencies(self) -> List[CodeIssue]:
        """Scan for missing or outdated dependencies"""
        issues = []
        
        # Check package.json dependencies
        if os.path.exists("package.json"):
            with open("package.json", "r") as f:
                package_data = json.load(f)
                
            # Check for missing dependencies
            dependencies = package_data.get("dependencies", {})
            dev_dependencies = package_data.get("devDependencies", {})
            
            # This would normally check against actual imports
            # For now, we'll do a basic check
            issues.extend(await self._check_npm_dependencies(dependencies, dev_dependencies))
        
        # Check Python requirements
        if os.path.exists("backend/requirements.txt"):
            issues.extend(await self._check_python_dependencies())
        
        return issues
    
    async def _scan_directory(self, directory: str, extensions: List[str]) -> List[CodeIssue]:
        """Scan a directory for code issues"""
        issues = []
        
        for root, dirs, files in os.walk(directory):
            for file in files:
                file_extension = file.split(".")[-1]
                if file_extension in extensions:
                    file_path = os.path.join(root, file)
                    issues.extend(await self._scan_file(file_path, file_extension))
        
        return issues
    
    async def _scan_file(self, file_path: str, file_extension: str) -> List[CodeIssue]:
        """Scan an individual file for issues"""
        issues = []
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                lines = content.split("\n")
            
            # Map file extensions to language types
            language_map = {
                "js": "javascript",
                "jsx": "javascript", 
                "ts": "typescript",
                "tsx": "typescript",
                "py": "python"
            }
            
            language = language_map.get(file_extension, "unknown")
            
            # Scan for syntax and style issues
            for i, line in enumerate(lines):
                line_issues = await self._scan_line(file_path, i + 1, line, language)
                issues.extend(line_issues)
            
            # Scan for structural issues
            structural_issues = await self._scan_file_structure(file_path, content, language)
            issues.extend(structural_issues)
            
        except Exception as e:
            logger.error(f"Error scanning file {file_path}: {e}")
            issues.append(CodeIssue(
                file_path=file_path,
                line=1,
                issue_type="scan_error",
                severity="error",
                description=f"Failed to scan file: {str(e)}"
            ))
        
        return issues
    
    async def _scan_line(self, file_path: str, line_num: int, line: str, language: str) -> List[CodeIssue]:
        """Scan a single line for issues"""
        issues = []
        
        # Get patterns for this language
        patterns = self.scan_patterns.get("syntax_errors", {}).get(language, [])
        performance_patterns = self.scan_patterns.get("performance_issues", {}).get(language, [])
        security_patterns = self.scan_patterns.get("security_issues", {}).get(language, [])
        
        # Check syntax/style patterns
        for pattern in patterns:
            if re.search(pattern, line):
                issues.append(CodeIssue(
                    file_path=file_path,
                    line=line_num,
                    issue_type="style",
                    severity="warning",
                    description=f"Style issue detected: {pattern}",
                    suggested_fix=await self._generate_style_fix(pattern, line)
                ))
        
        # Check performance patterns
        for pattern in performance_patterns:
            if re.search(pattern, line):
                issues.append(CodeIssue(
                    file_path=file_path,
                    line=line_num,
                    issue_type="performance",
                    severity="warning",
                    description=f"Performance issue detected: {pattern}",
                    suggested_fix=await self._generate_performance_fix(pattern, line)
                ))
        
        # Check security patterns
        for pattern in security_patterns:
            if re.search(pattern, line):
                issues.append(CodeIssue(
                    file_path=file_path,
                    line=line_num,
                    issue_type="security",
                    severity="critical",
                    description=f"Security issue detected: {pattern}",
                    suggested_fix=await self._generate_security_fix(pattern, line)
                ))
        
        return issues
    
    async def _scan_file_structure(self, file_path: str, content: str, language: str) -> List[CodeIssue]:
        """Scan file for structural issues"""
        issues = []
        
        # Check for missing exports/imports
        if language in ["javascript", "typescript"]:
            if "export" not in content and "module.exports" not in content:
                if not file_path.endswith(("index.js", "index.ts", "main.js", "main.ts")):
                    issues.append(CodeIssue(
                        file_path=file_path,
                        line=1,
                        issue_type="structure",
                        severity="warning",
                        description="File may be missing exports",
                        suggested_fix="Add appropriate export statements"
                    ))
        
        # Check for Python structure
        elif language == "python":
            if len(content.strip()) > 0 and not content.strip().startswith("#"):
                # Check for missing docstrings in modules
                if '"""' not in content and "'''" not in content:
                    issues.append(CodeIssue(
                        file_path=file_path,
                        line=1,
                        issue_type="documentation",
                        severity="info",
                        description="Module missing docstring",
                        suggested_fix="Add module docstring"
                    ))
        
        return issues
    
    async def _scan_config_file(self, file_path: str) -> List[CodeIssue]:
        """Scan configuration files for issues"""
        issues = []
        
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if file_path.endswith(".json"):
                # Validate JSON
                try:
                    json.loads(content)
                except json.JSONDecodeError as e:
                    issues.append(CodeIssue(
                        file_path=file_path,
                        line=getattr(e, 'lineno', 1),
                        issue_type="syntax",
                        severity="error",
                        description=f"JSON syntax error: {str(e)}",
                        suggested_fix="Fix JSON syntax"
                    ))
            
        except Exception as e:
            issues.append(CodeIssue(
                file_path=file_path,
                line=1,
                issue_type="scan_error",
                severity="error",
                description=f"Failed to scan config file: {str(e)}"
            ))
        
        return issues
    
    async def _check_npm_dependencies(self, dependencies: Dict, dev_dependencies: Dict) -> List[CodeIssue]:
        """Check npm dependencies for issues"""
        issues = []
        
        # This would normally check for:
        # - Outdated packages
        # - Security vulnerabilities
        # - Missing dependencies
        # For now, we'll do basic checks
        
        return issues
    
    async def _check_python_dependencies(self) -> List[CodeIssue]:
        """Check Python dependencies for issues"""
        issues = []
        
        # This would check pip packages for issues
        # For now, return empty list
        
        return issues
    
    async def _auto_fix_issues(self, issues: List[CodeIssue]):
        """Automatically fix issues where possible"""
        fixed_count = 0
        
        for issue in issues:
            if await self._can_auto_fix(issue):
                try:
                    # Backup file before fixing
                    if self.backup_before_fix:
                        await self._backup_file(issue.file_path)
                    
                    # Apply the fix
                    success = await self._apply_fix(issue)
                    
                    if success:
                        issue.fixed = True
                        issue.fix_applied_at = datetime.utcnow()
                        fixed_count += 1
                        
                        self.sentinel_log.add_entry(
                            "auto_fix_applied",
                            {
                                "file": issue.file_path,
                                "line": issue.line,
                                "issue_type": issue.issue_type,
                                "description": issue.description
                            },
                            "success"
                        )
                    
                except Exception as e:
                    logger.error(f"Failed to auto-fix issue {issue.id}: {e}")
                    self.sentinel_log.add_entry(
                        "auto_fix_failed",
                        {
                            "issue_id": issue.id,
                            "error": str(e)
                        },
                        "error"
                    )
        
        logger.info(f"🔧 SentinelFlux auto-fixed {fixed_count} issues")
    
    async def _can_auto_fix(self, issue: CodeIssue) -> bool:
        """Determine if an issue can be auto-fixed"""
        # Only auto-fix certain types of issues
        auto_fixable_types = ["style", "documentation"]
        auto_fixable_severities = ["info", "warning"]
        
        return (issue.issue_type in auto_fixable_types and 
                issue.severity in auto_fixable_severities and
                issue.suggested_fix is not None)
    
    async def _apply_fix(self, issue: CodeIssue) -> bool:
        """Apply a fix to resolve an issue"""
        try:
            with open(issue.file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()
            
            # Apply line-specific fixes
            if issue.suggested_fix and issue.line <= len(lines):
                lines[issue.line - 1] = issue.suggested_fix + "\n"
                
                with open(issue.file_path, "w", encoding="utf-8") as f:
                    f.writelines(lines)
                
                return True
            
        except Exception as e:
            logger.error(f"Error applying fix: {e}")
            return False
        
        return False
    
    async def _backup_file(self, file_path: str):
        """Create a backup of a file before modification"""
        backup_dir = ".sentinel_backups"
        os.makedirs(backup_dir, exist_ok=True)
        
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{os.path.basename(file_path)}.{timestamp}.backup"
        backup_path = os.path.join(backup_dir, backup_name)
        
        shutil.copy2(file_path, backup_path)
    
    async def _generate_style_fix(self, pattern: str, line: str) -> Optional[str]:
        """Generate a fix for style issues"""
        if "var " in pattern:
            return line.replace("var ", "let ")
        elif "==" in pattern and "===" not in line:
            return line.replace("==", "===")
        elif "console.log" in pattern:
            return "// " + line.strip()  # Comment out debug statements
        
        return None
    
    async def _generate_performance_fix(self, pattern: str, line: str) -> Optional[str]:
        """Generate a fix for performance issues"""
        # This would contain more sophisticated performance optimizations
        return None
    
    async def _generate_security_fix(self, pattern: str, line: str) -> Optional[str]:
        """Generate a fix for security issues"""
        # This would contain security-related fixes
        return None
    
    async def _update_learning_patterns(self, issues: List[CodeIssue]):
        """Update learning patterns based on detected issues"""
        for issue in issues:
            issue_key = f"{issue.issue_type}_{issue.severity}"
            if issue_key not in self.learning_data:
                self.learning_data[issue_key] = {"count": 0, "patterns": []}
            
            self.learning_data[issue_key]["count"] += 1
            
            # Store pattern data for machine learning
            pattern_data = {
                "file_extension": issue.file_path.split(".")[-1],
                "line_context": issue.description,
                "fix_applied": issue.fixed
            }
            self.learning_data[issue_key]["patterns"].append(pattern_data)
    
    async def _load_user_preferences(self):
        """Load user preferences for SentinelFlux"""
        # This would load from a config file or database
        self.user_preferences = {
            "auto_fix_enabled": True,
            "backup_before_fix": True,
            "notification_level": "warning"
        }
    
    async def _initialize_learning_patterns(self):
        """Initialize machine learning patterns"""
        # This would load ML models for pattern recognition
        pass
    
    async def _ensure_backup_directory(self):
        """Ensure backup directory exists"""
        backup_dir = ".sentinel_backups"
        os.makedirs(backup_dir, exist_ok=True)
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current status of SentinelFlux"""
        return {
            "status": "active",
            "is_scanning": self.is_scanning,
            "auto_fix_enabled": self.auto_fix_enabled,
            "issues_detected": len(self.issues_detected),
            "fixes_applied": len([i for i in self.issues_detected.values() if i.fixed]),
            "last_scan": "recent" if self.issues_detected else "never"
        }
    
    async def get_sentinel_log(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent SentinelFlux log entries"""
        return self.sentinel_log.get_recent_entries(limit)
    
    async def get_detected_issues(self, severity: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get detected issues, optionally filtered by severity"""
        issues = list(self.issues_detected.values())
        
        if severity:
            issues = [i for i in issues if i.severity == severity]
        
        return [{
            "id": issue.id,
            "file_path": issue.file_path,
            "line": issue.line,
            "issue_type": issue.issue_type,
            "severity": issue.severity,
            "description": issue.description,
            "fixed": issue.fixed,
            "detected_at": issue.detected_at.isoformat()
        } for issue in issues]
    
    async def process_request(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming requests"""
        action = data.get("action", "status")
        
        if action == "status":
            return await self.get_status()
        elif action == "get_log":
            limit = data.get("limit", 50)
            return {"log": await self.get_sentinel_log(limit)}
        elif action == "get_issues":
            severity = data.get("severity")
            return {"issues": await self.get_detected_issues(severity)}
        elif action == "manual_scan":
            await self.autonomous_scan()
            return {"status": "scan_initiated"}
        elif action == "toggle_auto_fix":
            self.auto_fix_enabled = not self.auto_fix_enabled
            return {"auto_fix_enabled": self.auto_fix_enabled}
        else:
            return {"error": f"Unknown action: {action}"}