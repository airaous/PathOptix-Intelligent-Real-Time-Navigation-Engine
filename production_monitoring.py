
import structlog
import time
from prometheus_client import Counter, Histogram, generate_latest
from fastapi import Request, Response
import asyncio

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Prometheus metrics
REQUEST_COUNT = Counter('requests_total', 'Total requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('request_duration_seconds', 'Request duration')
ML_PREDICTION_COUNT = Counter('ml_predictions_total', 'Total ML predictions')
ML_PREDICTION_CONFIDENCE = Histogram('ml_prediction_confidence', 'ML prediction confidence')

class ProductionMonitoring:
    """Production monitoring and performance tracking"""
    
    def __init__(self):
        self.logger = structlog.get_logger()
    
    async def log_request(self, request: Request, call_next):
        """Log all API requests with timing"""
        start_time = time.time()
        
        # Log request start
        self.logger.info(
            "request_started",
            method=request.method,
            url=str(request.url),
            client_ip=request.client.host
        )
        
        # Process request
        response = await call_next(request)
        
        # Calculate duration
        duration = time.time() - start_time
        
        # Update metrics
        REQUEST_COUNT.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code
        ).inc()
        REQUEST_DURATION.observe(duration)
        
        # Log request completion
        self.logger.info(
            "request_completed",
            method=request.method,
            url=str(request.url),
            status_code=response.status_code,
            duration=duration
        )
        
        return response
    
    def log_ml_prediction(self, prediction_type: str, confidence: float, 
                         duration: float, success: bool):
        """Log ML model predictions"""
        ML_PREDICTION_COUNT.labels(type=prediction_type).inc()
        
        if success:
            ML_PREDICTION_CONFIDENCE.observe(confidence)
        
        self.logger.info(
            "ml_prediction",
            type=prediction_type,
            confidence=confidence,
            duration=duration,
            success=success
        )
    
    def get_metrics(self):
        """Get Prometheus metrics"""
        return generate_latest()

# Model versioning and A/B testing
class ModelVersionManager:
    """Manage multiple model versions and A/B testing"""
    
    def __init__(self):
        self.models = {}
        self.active_version = "v1.0"
        self.traffic_split = {"v1.0": 1.0}  # 100% traffic to v1.0
        self.logger = structlog.get_logger()
    
    def register_model(self, version: str, model_path: str):
        """Register a new model version"""
        self.logger.info("model_registered", version=version, path=model_path)
        # Model loading logic here
    
    def get_model_for_request(self, request_id: str):
        """Route request to appropriate model version based on A/B testing"""
        # Simple hash-based routing for A/B testing
        import hashlib
        hash_val = int(hashlib.md5(request_id.encode()).hexdigest(), 16)
        
        cumulative = 0.0
        for version, weight in self.traffic_split.items():
            cumulative += weight
            if (hash_val % 100) / 100.0 < cumulative:
                return version
        
        return self.active_version
    
    def update_traffic_split(self, new_split: dict):
        """Update traffic distribution between model versions"""
        total = sum(new_split.values())
        if abs(total - 1.0) > 0.01:
            raise ValueError("Traffic split must sum to 1.0")
        
        self.traffic_split = new_split
        self.logger.info("traffic_split_updated", split=new_split)

# Performance optimization
class ModelOptimizer:
    """Optimize model performance for production"""
    
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
        self.logger = structlog.get_logger()
    
    def optimize_gnn_model(self, model):
        """Optimize GNN model for inference"""
        # Convert to TorchScript for faster inference
        model.eval()
        
        # Create dummy input for tracing
        dummy_x = torch.randn(10, 6)
        dummy_edge_index = torch.randint(0, 10, (2, 20))
        
        try:
            traced_model = torch.jit.trace(model, (dummy_x, dummy_edge_index))
            self.logger.info("gnn_model_optimized", optimization="torchscript")
            return traced_model
        except Exception as e:
            self.logger.error("gnn_optimization_failed", error=str(e))
            return model
    
    def cache_prediction(self, key: str, prediction: dict):
        """Cache prediction results"""
        self.cache[key] = {
            'prediction': prediction,
            'timestamp': time.time()
        }
    
    def get_cached_prediction(self, key: str):
        """Get cached prediction if still valid"""
        if key in self.cache:
            cached = self.cache[key]
            if time.time() - cached['timestamp'] < self.cache_ttl:
                return cached['prediction']
            else:
                del self.cache[key]
        return None
