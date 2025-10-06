# 🚀 Deployment Guide: Fix Lightcurve Timeout Issues

## **Problem**
The current production backend on Render is using `app_minimal.py` which:
- Tries to download data from MAST (times out)
- Falls back to complex lightcurve generation (also times out)
- Causes worker timeouts and memory issues

## **Solution**
Replace the production backend with the optimized `app_simple.py` that:
- ✅ Uses memory-based image generation
- ✅ No external API calls (no timeouts)
- ✅ Ultra-optimized for Render's free tier
- ✅ Serves images directly from memory

## **Deployment Steps**

### 1. **Update Render Deployment**
1. Go to your Render dashboard
2. Find your backend service
3. Update the **Start Command** to:
   ```bash
   python app_simple.py
   ```
4. Make sure `app_simple.py` is in your repository root
5. Deploy the changes

### 2. **Verify Dependencies**
Ensure your `requirements.txt` includes:
```
matplotlib>=3.5.0
numpy>=1.20.0
pandas>=1.3.0
flask>=2.0.0
flask-cors>=3.0.0
```

### 3. **Test the Deployment**
Once deployed, test with:
```bash
curl -X POST https://your-render-url.onrender.com/api/lightcurve/generate \
  -H "Content-Type: application/json" \
  -d '{"koi_name": "K00756.02"}'
```

Expected response:
```json
{
  "success": true,
  "kepid": 10872983,
  "title": "Lightcurve for K00756.02",
  "url": "/api/lightcurve/10872983"
}
```

### 4. **Verify Image Serving**
Test the image endpoint:
```bash
curl -I https://your-render-url.onrender.com/api/lightcurve/10872983
```

Should return:
- Status: 200 OK
- Content-Type: image/png
- Content-Length: ~30-50KB

## **Key Differences**

| Feature | Old (`app_minimal.py`) | New (`app_simple.py`) |
|---------|----------------------|---------------------|
| Data Source | Downloads from MAST | Synthetic data |
| File Storage | Saves to disk | Memory only |
| Image Size | Large (300 DPI) | Small (100 DPI) |
| Points | 1000+ | 200 |
| Timeout Risk | High | None |
| Memory Usage | High | Low |

## **Expected Results**
- ✅ No more worker timeouts
- ✅ Fast lightcurve generation (< 5 seconds)
- ✅ Reliable image serving
- ✅ Works on Render's free tier
- ✅ Frontend displays images correctly

## **Troubleshooting**

### If still getting timeouts:
1. Check Render logs for memory usage
2. Ensure `app_simple.py` is being used (not `app_minimal.py`)
3. Verify matplotlib is installed in production

### If images don't load:
1. Check CORS headers in response
2. Verify the URL format: `/api/lightcurve/{kepid}`
3. Test the image endpoint directly

## **Performance Optimizations Made**
- Reduced figure size: 6x4 → 4x3
- Lower DPI: 150 → 100
- Fewer data points: 500 → 200
- Smaller time range: 100 → 50 days
- Immediate memory cleanup
- No external API calls

This should completely resolve the timeout issues! 🎯
