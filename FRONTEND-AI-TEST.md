# 🔍 Frontend AI Integration Test

This test verifies if the frontend can successfully connect to the AI backend features.

## Test in Browser Console

Copy and paste this code in your browser console when the PathOptix app is loaded:

```javascript
// Test AI Backend Connection
async function testAIBackend() {
  console.log('🧪 Testing AI Backend Connection...');
  
  const testRoute = {
    origin: { lat: 37.7749, lng: -122.4194 },
    destination: { lat: 37.7849, lng: -122.4094 },
    travel_mode: "driving",
    optimize_for: "time"
  };

  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Endpoint...');
    const healthResponse = await fetch('/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
  }

  // Test 2: ML Prediction
  try {
    console.log('2️⃣ Testing ML Prediction...');
    const predictionResponse = await fetch('/api/v2/predict-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRoute)
    });
    
    if (predictionResponse.ok) {
      const predictionData = await predictionResponse.json();
      console.log('✅ ML Prediction:', predictionData);
      console.log(`🎯 Confidence: ${(predictionData.confidence * 100).toFixed(1)}%`);
      console.log(`⏱️ Duration: ${predictionData.estimated_duration.toFixed(1)}s`);
      console.log(`📏 Distance: ${predictionData.estimated_distance.toFixed(1)}m`);
    } else {
      console.error('❌ ML Prediction Failed:', predictionResponse.status, predictionResponse.statusText);
    }
  } catch (error) {
    console.error('❌ ML Prediction Error:', error);
  }

  // Test 3: Route Optimization
  try {
    console.log('3️⃣ Testing Route Optimization...');
    const optimizationResponse = await fetch('/api/v2/optimize-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRoute)
    });
    
    if (optimizationResponse.ok) {
      const optimizationData = await optimizationResponse.json();
      console.log('✅ Route Optimization:', optimizationData);
      console.log(`🚦 Traffic: ${optimizationData.optimization.traffic_analysis.current_congestion.toFixed(2)}`);
      console.log(`💰 Fuel Cost: ${optimizationData.optimization.cost_analysis.fuel_cost}`);
    } else {
      console.error('❌ Route Optimization Failed:', optimizationResponse.status, optimizationResponse.statusText);
    }
  } catch (error) {
    console.error('❌ Route Optimization Error:', error);
  }

  // Test 4: Real-time Adaptation
  try {
    console.log('4️⃣ Testing Real-time Adaptation...');
    const adaptationResponse = await fetch('/api/v2/real-time-adaptation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRoute)
    });
    
    if (adaptationResponse.ok) {
      const adaptationData = await adaptationResponse.json();
      console.log('✅ Real-time Adaptation:', adaptationData);
      console.log(`⚡ Adaptation: ${adaptationData.adapted_prediction.real_time_factors.dynamic_routing.time_savings}`);
    } else {
      console.error('❌ Real-time Adaptation Failed:', adaptationResponse.status, adaptationResponse.statusText);
    }
  } catch (error) {
    console.error('❌ Real-time Adaptation Error:', error);
  }

  console.log('🏁 AI Backend Test Complete!');
}

// Run the test
testAIBackend();
```

## Expected Results

If everything is working correctly, you should see:

```
🧪 Testing AI Backend Connection...
1️⃣ Testing Health Endpoint...
✅ Health Check: {status: "healthy", version: "2.0.0", models_loaded: true}
2️⃣ Testing ML Prediction...
✅ ML Prediction: {confidence: 0.75, estimated_duration: 95.2, ...}
🎯 Confidence: 75.0%
⏱️ Duration: 95.2s
📏 Distance: 1420.5m
3️⃣ Testing Route Optimization...
✅ Route Optimization: {optimization: {traffic_analysis: {...}}}
🚦 Traffic: 0.23
💰 Fuel Cost: $0.18
4️⃣ Testing Real-time Adaptation...
✅ Real-time Adaptation: {adapted_prediction: {...}}
⚡ Adaptation: 4 minutes
🏁 AI Backend Test Complete!
```

## Troubleshooting

### If you see 404 errors:
- Check that Netlify proxy is correctly configured in `netlify.toml`
- Verify the backend is running at https://pathoptix-backend-8080.zeabur.app
- Ensure you're testing on the deployed Netlify site, not localhost

### If you see CORS errors:
- The proxy should handle CORS automatically
- Check that requests are going to `/api/v2/` not direct backend URLs

### If you see network errors:
- Test backend directly: https://pathoptix-backend-8080.zeabur.app/api/health
- Check browser Network tab for actual request URLs
- Verify Netlify deployment is successful

## Quick Network Tab Check

In Chrome DevTools Network tab, you should see:

✅ **Request URL**: `https://your-site.netlify.app/api/v2/predict-route`  
✅ **Status**: `200 OK`  
✅ **Response**: JSON with prediction data

❌ **NOT**: Direct requests to `https://pathoptix-backend-8080.zeabur.app`
