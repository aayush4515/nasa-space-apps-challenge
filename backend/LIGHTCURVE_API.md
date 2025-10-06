# Lightcurve Database Storage API

This document describes the updated lightcurve functionality that stores images in the database instead of the file system.

## Database Schema

### New `lightcurves` table:
- `id`: Primary key (auto-increment)
- `candidate_id`: Foreign key to predictions table (KOI name)
- `kepid`: Kepler ID (integer)
- `image_data`: Binary data (BLOB) containing the PNG image
- `filename`: Original filename (e.g., "123456.png")
- `created_at`: Timestamp when the lightcurve was created

## API Endpoints

### 1. Generate Lightcurve
**POST** `/api/lightcurve/generate`

Generates a lightcurve for a given KOI name and stores it in the database.

**Request Body:**
```json
{
    "koi_name": "K00752.01"
}
```

**Response:**
```json
{
    "success": true,
    "filename": "123456.png",
    "title": "Lightcurve for K00752.01",
    "candidate_id": "K00752.01",
    "kepid": 123456,
    "url": "/api/lightcurve/K00752.01"
}
```

### 2. Get Lightcurve Image
**GET** `/api/lightcurve/{candidate_id}`

Retrieves and serves the lightcurve image from the database.

**Response:** PNG image data with appropriate headers.

### 3. Get Lightcurve by KEPID
**GET** `/api/lightcurve/kepid/{kepid}`

Retrieves lightcurve by Kepler ID instead of candidate ID.

**Response:** PNG image data with appropriate headers.

### 4. Get Lightcurve Info
**GET** `/api/lightcurve/{candidate_id}/info`

Gets metadata about the lightcurve without the image data.

**Response:**
```json
{
    "success": true,
    "candidate_id": "K00752.01",
    "filename": "123456.png",
    "created_at": "2024-01-01 12:00:00",
    "url": "/api/lightcurve/K00752.01"
}
```

## Database Methods

### `save_lightcurve(candidate_id, kepid, image_data, filename)`
Saves lightcurve image data to the database.

### `get_lightcurve_by_candidate(candidate_id)`
Retrieves lightcurve data by candidate ID.

### `get_lightcurve_by_kepid(kepid)`
Retrieves lightcurve data by Kepler ID.

### `lightcurve_exists(candidate_id)`
Checks if a lightcurve exists for a given candidate.

## Frontend Integration

The frontend can now:

1. **Generate lightcurves** by calling `/api/lightcurve/generate`
2. **Display images** by using the returned URL: `/api/lightcurve/{candidate_id}`
3. **Check existence** by calling the generate endpoint (returns existing if found)
4. **Get metadata** by calling `/api/lightcurve/{candidate_id}/info`

## Benefits

- ✅ **No file system dependencies** - all data stored in database
- ✅ **Scalable** - works with cloud deployments
- ✅ **Persistent** - data survives server restarts
- ✅ **Efficient** - no need to manage file cleanup
- ✅ **Searchable** - can query by candidate ID or KEPID
- ✅ **Versioned** - can store multiple lightcurves per candidate

## Migration from File System

The old file-based system has been completely replaced. The new system:

- Generates lightcurves in memory (no temporary files)
- Stores images as BLOB data in SQLite
- Serves images directly from database
- Maintains backward compatibility with existing API structure
