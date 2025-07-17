# 🔍 Frontend AI Integration Test

This test verifies if the frontend can successfully connect to the AI backend features.

## Test in Browser Console

Copy and paste this code in your browser console when the PathOptix app is loaded:

```javascript
// Test AI Backend Connection with detailed debugging
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
    console.log('Health Response Status:', healthResponse.status);
    console.log('Health Response Headers:', [...healthResponse.headers.entries()]);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Check:', healthData);
    } else {
      const healthText = await healthResponse.text();
      console.log('❌ Health Response Body:', healthText.substring(0, 200));
    }
  } catch (error) {
    console.error('❌ Health Check Failed:', error);
  }

  // Test 2: ML Prediction with detailed error info
  try {
    console.log('2️⃣ Testing ML Prediction...');
    const predictionResponse = await fetch('/api/v2/predict-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testRoute)
    });
    
    console.log('ML Prediction Status:', predictionResponse.status);
    console.log('ML Prediction URL:', predictionResponse.url);
    console.log('ML Prediction Headers:', [...predictionResponse.headers.entries()]);
    
    if (predictionResponse.ok) {
      const predictionData = await predictionResponse.json();
      console.log('✅ ML Prediction:', predictionData);
      console.log(`🎯 Confidence: ${(predictionData.confidence * 100).toFixed(1)}%`);
      console.log(`⏱️ Duration: ${predictionData.estimated_duration.toFixed(1)}s`);
      console.log(`📏 Distance: ${predictionData.estimated_distance.toFixed(1)}m`);
    } else {
      const responseText = await predictionResponse.text();
      console.error('❌ ML Prediction Failed:', predictionResponse.status, predictionResponse.statusText);
      console.error('Response Body:', responseText.substring(0, 500));
      
      // Check if we're getting HTML instead of JSON (redirect issue)
      if (responseText.includes('<html>') || responseText.includes('<!DOCTYPE')) {
        console.error('� ISSUE: Getting HTML instead of JSON - Check netlify.toml redirect order!');
        console.error('The SPA redirect (/*) might be catching API calls before API redirects');
      }
    }
  } catch (error) {
    console.error('❌ ML Prediction Error:', error);
  }

  console.log('🏁 AI Backend Test Complete!');
  console.log('📋 Debugging Info:');
  console.log('- Current URL:', window.location.href);
  console.log('- Environment:', import.meta?.env?.VITE_ENVIRONMENT || 'unknown');
  console.log('- Backend URL:', import.meta?.env?.VITE_API_BASE_URL || 'unknown');
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
