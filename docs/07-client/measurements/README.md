# Client Measurements API Documentation

**Version:** 1.0  
**Date:** November 27, 2025  
**Status:** ✅ Fully Implemented

---

## 📋 Overview

This module provides REST API endpoints for clients to manually submit body measurements with optional progress photos. Unlike the scheduled Reports system, this allows clients to add measurements anytime they want based on predefined templates created by trainers.

**Key Features:**
- ✅ View available measurement templates
- ✅ Submit measurements manually (client-initiated)
- ✅ **Image upload support** - Upload progress photos with measurements
- ✅ View measurement history with images
- ✅ Track progress for specific fields over time
- ✅ **Automatic image compression** (quality: 80%)
- ✅ Flexible measurement fields defined by trainers

---

## 🗄️ Database Structure

### Measurement Template (`measurement_template`)

Created by trainers, defines which fields clients should track.

```sql
wp_posts
├── id: Template ID
├── post_type: 'measurement_template'
├── post_title: Template name
├── post_author: Trainer ID
├── post_status: 'publish'
└── post_date: Creation date

wp_postmeta
└── selectedFields: JSON array of field definitions
```

**Selected Fields Structure:**
```json
[
  { "field": "weight", "label": "Weight", "type": "number", "unit": "kg" },
  { "field": "body_fat", "label": "Body Fat %", "type": "number", "unit": "%" },
  { "field": "chest", "label": "Chest", "type": "number", "unit": "cm" },
  { "field": "waist", "label": "Waist", "type": "number", "unit": "cm" }
]
```

### Client Measurement (`client_measurement`)

Created when clients submit measurements.

```sql
wp_posts
├── id: Measurement ID
├── post_type: 'client_measurement'
├── post_author: Client ID
├── post_parent: Template ID
├── post_date: Measurement date
└── post_status: 'publish'

wp_postmeta
├── measurements: JSON object with values
└── measurement_media_id: Media post ID (multiple entries for multiple images)
```

**Measurements Structure:**
```json
{
  "weight": 75.5,
  "body_fat": 18,
  "chest": 100,
  "waist": 80,
  "hips": 95,
  "biceps_left": 37,
  "biceps_right": 37.5
}
```

### Media Posts (for uploaded images)

When clients upload images, they're stored as media posts:

```sql
wp_posts
├── id: Media ID
├── post_type: 'media'
├── post_title: Original filename
├── post_content: Web-accessible path
├── post_author: Client ID
├── post_status: 'publish'
├── post_parent: Client Measurement ID
├── post_mime_type: 'image/jpeg' | 'image/png'
└── post_name: Web path

wp_postmeta
├── file_size: Size in bytes
├── file_path: Web-accessible path
├── original_name: Original filename
└── uploaded_at: ISO timestamp
```

---

## 🎯 How It Works

### Flow Diagram

```
1. Trainer creates measurement_template
   ↓
2. Client views available templates
   ↓
3. Client fills measurements (anytime)
   ↓
4. Client optionally uploads progress photos
   ↓
5. Images are compressed (quality: 80%)
   ↓
6. Measurement + images saved to database
   ↓
7. Client can view history and track progress
```

### Image Processing

```
Client uploads base64 image
   ↓
Backend decodes base64
   ↓
Saves temporary file
   ↓
Compresses using Sharp (quality: 80%)
   ↓
Deletes temporary file
   ↓
Creates media post
   ↓
Links to client_measurement via metadata
```

---

## 📡 API Endpoints

### Base Route
```
/api/client/measurements
```

All endpoints require:
- **Authentication**: JWT Bearer token
- **Query Parameter**: `companyId` (required on most endpoints)

---

### 1. Get Measurement Templates

Get all measurement templates available to the client.

**Note:** If no templates have been created by trainers, a **default template** is automatically returned with all 28 standard body measurement fields from the detail statistics constants.

```http
GET /api/client/measurements/templates?companyId={companyId}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Standard Body Measurements",
      "selectedFields": [
        { "field": "weight", "label": "Weight", "type": "number", "unit": "kg" },
        { "field": "body_fat", "label": "Body Fat %", "type": "number", "unit": "%" },
        { "field": "chest", "label": "Chest", "type": "number", "unit": "cm" },
        { "field": "waist", "label": "Waist", "type": "number", "unit": "cm" }
      ],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "isDefault": false
    }
  ],
  "count": 1
}
```

**Default Template Response (when no templates exist):**
```json
{
  "success": true,
  "data": [
    {
      "id": 0,
      "title": "Standard Body Measurements",
      "selectedFields": [
        { "field": "body_weight", "label": "Body Weight", "type": "number", "unit": "kg" },
        { "field": "height", "label": "Height", "type": "number", "unit": "cm" },
        { "field": "body_fat_percentage", "label": "Body Fat Percentage", "type": "number", "unit": "%" },
        // ... 25 more fields from detail statistics constants
      ],
      "createdAt": "2025-11-27T10:00:00.000Z",
      "isDefault": true
    }
  ],
  "count": 1
}
```

**Note:** The default template (ID: 0) uses all 28 measurement fields from `detailStatisticsConst.js`, ensuring consistency with the Reports API.

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 2. Submit Measurements

Submit new measurements with optional progress photos.

```http
POST /api/client/measurements/submit
```

**Request Body:**
```json
{
  "companyId": 1,
  "templateId": 1,
  "measurements": {
    "weight": 75.5,
    "body_fat": 18,
    "chest": 100,
    "waist": 80,
    "hips": 95,
    "biceps_left": 37,
    "biceps_right": 37.5
  },
  "images": [
    {
      "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHY...",
      "fileName": "progress-front.jpg",
      "mimeType": "image/jpeg"
    },
    {
      "data": "iVBORw0KGgoAAAANSUhEUgAAA...",
      "fileName": "progress-side.png",
      "mimeType": "image/png"
    }
  ]
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `templateId` | number | Yes | Template ID to use (use 0 for default template) |
| `measurements` | Object | Yes | Object with field-value pairs |
| `images` | Array | No | Array of base64 image objects |

**Image Object Format:**
- `data`: Base64 encoded image (with or without `data:image/...;base64,` prefix)
- `fileName`: Original filename
- `mimeType`: `"image/jpeg"` or `"image/png"`

**Note:** 
- Images are automatically compressed (quality: 80%)
- Images stored in: `storage/company-{id}/clients/client-{id}/measurements/`
- Maximum recommended size: 10MB per image

**Response:**
```json
{
  "success": true,
  "message": "Measurements saved successfully",
  "data": {
    "id": 500,
    "templateId": 1,
    "date": "2025-11-27T15:30:00.000Z",
    "measurements": {
      "weight": 75.5,
      "body_fat": 18,
      "chest": 100,
      "waist": 80
    },
    "images": [
      {
        "id": 456,
        "fileName": "progress-front.jpg",
        "path": "/storage/company-1/clients/client-108/measurements/measurement_500_1732725000_0_compressed.jpg",
        "size": 245678,
        "mimeType": "image/jpeg",
        "uploadedAt": "2025-11-27T15:30:00.000Z"
      },
      {
        "id": 457,
        "fileName": "progress-side.png",
        "path": "/storage/company-1/clients/client-108/measurements/measurement_500_1732725000_1_compressed.png",
        "size": 198234,
        "mimeType": "image/png",
        "uploadedAt": "2025-11-27T15:30:00.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing required fields or invalid data
- `403` - Unauthorized for this company
- `404` - Template not found
- `500` - Server error

---

### 3. Get Measurement History

Get client's measurement history with optional filtering.

```http
GET /api/client/measurements/history?companyId={companyId}&templateId={templateId}&startDate={startDate}&endDate={endDate}&limit={limit}&offset={offset}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `templateId` | number | No | Filter by template ID |
| `startDate` | string (ISO) | No | Filter by date (from) |
| `endDate` | string (ISO) | No | Filter by date (to) |
| `limit` | number | No | Number of results (default: 50) |
| `offset` | number | No | Pagination offset (default: 0) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 500,
      "templateId": 1,
      "date": "2025-11-27T15:30:00.000Z",
      "measurements": {
        "weight": 75.5,
        "body_fat": 18,
        "chest": 100,
        "waist": 80
      },
      "images": [
        {
          "id": 456,
          "fileName": "progress-front.jpg",
          "path": "/storage/company-1/clients/client-108/measurements/measurement_500_1732725000_0_compressed.jpg",
          "size": 245678,
          "mimeType": "image/jpeg",
          "uploadedAt": "2025-11-27T15:30:00.000Z"
        }
      ]
    },
    {
      "id": 501,
      "templateId": 1,
      "date": "2025-11-20T10:00:00.000Z",
      "measurements": {
        "weight": 76.2,
        "body_fat": 19,
        "chest": 98,
        "waist": 82
      },
      "images": []
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 4. Get Measurement by ID

Get a specific measurement entry with all images.

```http
GET /api/client/measurements/{measurementId}?companyId={companyId}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `measurementId` | number | Yes | Measurement ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 500,
    "templateId": 1,
    "date": "2025-11-27T15:30:00.000Z",
    "measurements": {
      "weight": 75.5,
      "body_fat": 18,
      "chest": 100,
      "waist": 80
    },
    "images": [
      {
        "id": 456,
        "fileName": "progress-front.jpg",
        "path": "/storage/company-1/clients/client-108/measurements/measurement_500_1732725000_0_compressed.jpg",
        "size": 245678,
        "mimeType": "image/jpeg",
        "uploadedAt": "2025-11-27T15:30:00.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId or invalid measurementId
- `403` - Unauthorized for this company
- `404` - Measurement not found
- `500` - Server error

---

### 5. Get Field Progress

Get progress for a specific measurement field over time.

```http
GET /api/client/measurements/progress/{fieldName}?companyId={companyId}&startDate={startDate}&endDate={endDate}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fieldName` | string | Yes | Field name to track (e.g., "weight", "body_fat") |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `startDate` | string (ISO) | No | Filter by date (from) |
| `endDate` | string (ISO) | No | Filter by date (to) |

**Response:**
```json
{
  "success": true,
  "data": {
    "fieldName": "weight",
    "data": [
      {
        "date": "2025-11-01T10:00:00.000Z",
        "value": 77
      },
      {
        "date": "2025-11-15T10:00:00.000Z",
        "value": 76.2
      },
      {
        "date": "2025-11-27T15:30:00.000Z",
        "value": 75.5
      }
    ],
    "count": 3,
    "latestValue": 75.5,
    "oldestValue": 77,
    "change": -1.5
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId or fieldName
- `403` - Unauthorized for this company
- `500` - Server error

---

## 🔒 Security & Authorization

All endpoints implement these security measures:

### 1. JWT Authentication
- Bearer token required in `Authorization` header
- Token validated via `authenticated` middleware
- User must be active and valid

### 2. Company Access Verification
```javascript
const userRelationship = await UserRelationship.findOne({
  where: {
    user_id: userId,
    company_id: companyId
  }
});
```

### 3. Measurement Ownership Validation
- Measurements must have `post_author = client_user_id`
- Client can only view/submit their own measurements
- No access to other clients' data

### 4. Multi-Tenant Isolation
- Each company has separate SQLite database
- No data leakage between companies
- Database selected via `CompaniesDbManager.getCompanyDB(companyId)`

---

## 💡 Usage Examples

### Example 1: Getting Available Templates

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/measurements/templates?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`Available templates: ${response.data.count}`);
response.data.data.forEach(template => {
  console.log(`- ${template.title} (${template.selectedFields.length} fields)`);
});
```

### Example 2: Submitting Measurements with Images

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const templateId = 1;

// Get base64 images from your frontend (e.g., from FileReader)
const frontImage = 'data:image/jpeg;base64,/9j/4AAQ...';
const sideImage = 'data:image/jpeg;base64,/9j/4AAQ...';

const payload = {
  companyId: companyId,
  templateId: templateId,
  measurements: {
    weight: 75.5,
    body_fat: 18,
    chest: 100,
    waist: 80,
    hips: 95,
    biceps_left: 37,
    biceps_right: 37.5
  },
  images: [
    {
      data: frontImage,
      fileName: 'progress-front.jpg',
      mimeType: 'image/jpeg'
    },
    {
      data: sideImage,
      fileName: 'progress-side.jpg',
      mimeType: 'image/jpeg'
    }
  ]
};

const response = await axios.post(
  'http://localhost:3000/api/client/measurements/submit',
  payload,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log('Measurements submitted successfully!');
console.log(`Measurement ID: ${response.data.data.id}`);
console.log(`Images uploaded: ${response.data.data.images.length}`);
```

### Example 3: Viewing Measurement History

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/measurements/history?companyId=${companyId}&limit=10`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`Total measurements: ${response.data.pagination.total}`);
response.data.data.forEach(measurement => {
  console.log(`\n${measurement.date}`);
  console.log(`Weight: ${measurement.measurements.weight}kg`);
  console.log(`Images: ${measurement.images.length}`);
});
```

### Example 4: Tracking Weight Progress

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/measurements/progress/weight?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const progress = response.data.data;
console.log(`Weight Progress:`);
console.log(`- Current: ${progress.latestValue}kg`);
console.log(`- Starting: ${progress.oldestValue}kg`);
console.log(`- Change: ${progress.change}kg`);
console.log(`- Entries: ${progress.count}`);
```

---

## 🖼️ Frontend Integration Example

### React Component with Image Upload

```typescript
import { useState } from 'react';

const MeasurementsForm = () => {
  const [measurements, setMeasurements] = useState({
    weight: '',
    body_fat: '',
    chest: '',
    waist: ''
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file); // Creates base64 string
    });
  };

  const handleSubmit = async () => {
    const payload = {
      companyId: 1,
      templateId: 1,
      measurements: {
        weight: parseFloat(measurements.weight),
        body_fat: parseFloat(measurements.body_fat),
        chest: parseFloat(measurements.chest),
        waist: parseFloat(measurements.waist)
      },
      images: uploadedImages.map((img, idx) => ({
        data: img, // Already base64 from FileReader
        fileName: `progress-${Date.now()}-${idx}.jpg`,
        mimeType: 'image/jpeg'
      }))
    };

    try {
      const response = await fetch('/api/client/measurements/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Success!', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form>
      <input
        type="number"
        placeholder="Weight (kg)"
        value={measurements.weight}
        onChange={(e) => setMeasurements({...measurements, weight: e.target.value})}
      />
      
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      
      <button type="button" onClick={handleSubmit}>
        Save Measurements
      </button>
    </form>
  );
};
```

---

## 🧪 Testing

### Test Script (Bash)

```bash
#!/bin/bash

API_URL="http://localhost:3000"
EMAIL="client@example.com"
PASSWORD="password123"
COMPANY_ID=1
TEMPLATE_ID=1

# Login and get token
echo "=== Logging in ==="
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

echo "Token: $TOKEN"

# Get templates
echo -e "\n=== Getting measurement templates ==="
curl -s -X GET "$API_URL/api/client/measurements/templates?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Submit measurements
echo -e "\n=== Submitting measurements ==="
curl -s -X POST "$API_URL/api/client/measurements/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"companyId\": $COMPANY_ID,
    \"templateId\": $TEMPLATE_ID,
    \"measurements\": {
      \"weight\": 75.5,
      \"body_fat\": 18,
      \"chest\": 100,
      \"waist\": 80
    }
  }" | jq

# Get history
echo -e "\n=== Getting measurement history ==="
curl -s -X GET "$API_URL/api/client/measurements/history?companyId=$COMPANY_ID&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get weight progress
echo -e "\n=== Getting weight progress ==="
curl -s -X GET "$API_URL/api/client/measurements/progress/weight?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📊 Storage Structure

### Directory Layout

```
storage/
└── company-1/
    └── clients/
        └── client-108/
            └── measurements/
                ├── measurement_500_1732725000_0_compressed.jpg
                ├── measurement_500_1732725000_1_compressed.png
                └── measurement_501_1732812400_0_compressed.jpg
```

### Database Schema

```sql
-- Client measurement post
wp_posts (id=500, post_type='client_measurement', post_parent=1, post_author=108)

-- Measurement values
wp_postmeta (post_id=500, meta_key='measurements', meta_value='{"weight":75.5, "body_fat":18}')

-- Media post
wp_posts (id=456, post_type='media', post_parent=500, post_author=108)

-- Link to measurement
wp_postmeta (post_id=500, meta_key='measurement_media_id', meta_value='456')

-- Media metadata
wp_postmeta (post_id=456, meta_key='file_size', meta_value='245678')
wp_postmeta (post_id=456, meta_key='file_path', meta_value='/storage/company-1/clients/client-108/measurements/measurement_500_1732725000_0_compressed.jpg')
wp_postmeta (post_id=456, meta_key='original_name', meta_value='progress-front.jpg')
wp_postmeta (post_id=456, meta_key='uploaded_at', meta_value='2025-11-27T15:30:00.000Z')
```

---

## 🔧 Integration with Existing System

### Routes Registration

Already added to `src/server.js`:

```javascript
const clientMeasurementsRoutes = require('./routes/client/measurementsRoutes');

// Register client measurements routes
app.use('/api/client/measurements', clientMeasurementsRoutes);
```

### File Structure

```
src/
├── controllers/client/
│   └── measurementsController.js     ✅ New
├── services/client/
│   └── measurementsService.js        ✅ New
└── routes/client/
    └── measurementsRoutes.js         ✅ New
```

---

## 📝 Comparison with Reports System

| Feature | Measurements API | Reports API |
|---------|-----------------|-------------|
| **Trigger** | Client manually (anytime) | Cron schedule (automated) |
| **Purpose** | Body measurements | Comprehensive check-ins |
| **Questions** | No (just measurements) | Yes (custom questions) |
| **Fields** | Trainer-defined (flexible) | 28 fixed fields (optional) |
| **Images** | ✅ Yes | ✅ Yes |
| **Draft Support** | No | ✅ Yes |
| **Scheduling** | No | ✅ Yes (recurring) |
| **API Protocol** | REST | REST |
| **Post Type** | `client_measurement` | `report_response` |
| **Best For** | Regular self-tracking | Trainer-requested updates |

---

## ⚠️ Important Notes

### 1. Template Management (Trainer Side)
- Templates are created by trainers via Socket.IO (`company:measurementtemplate:create`)
- This REST API is **read-only for templates**
- Clients can only **view and use** templates

### 2. Image Compression
- All images automatically compressed (quality: 80%)
- Uses Sharp library (same as Reports system)
- Saves disk space and improves load times
- Original images are deleted after compression

### 3. Measurement Ownership
- Clients can only view/submit their own measurements
- No access to other clients' data
- All operations validated against `post_author` field

### 4. Multi-Image Support
- Multiple images per measurement entry
- Each image stored as separate media post
- Linked via `measurement_media_id` metadata
- Can have different file types (JPEG, PNG)

---

## 🔗 Related Documentation

- [Client API Overview](./README.md)
- [Client Reports API](./reports/README.md)
- [Measurement Template Entity](../../03-entities/post-based/measurement-template/README.md)
- [Detail Statistics Constants](../../constants/DETAIL-STATISTICS-README.md)
- [Authentication System](../../02-authentication/README.md)

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Get Templates | ✅ Complete | Read-only for clients |
| Submit Measurements | ✅ Complete | With image upload support |
| Get History | ✅ Complete | With pagination |
| Get by ID | ✅ Complete | Single measurement details |
| Field Progress | ✅ Complete | Track specific fields over time |
| **Image Upload** | ✅ Complete | Base64, compression, storage |
| **Image Compression** | ✅ Complete | Quality: 80%, Sharp library |
| JWT Authentication | ✅ Complete | All endpoints protected |
| Company Authorization | ✅ Complete | UserRelationship validation |
| Multi-tenant Isolation | ✅ Complete | Separate company databases |

---

## 🚀 Future Enhancements

Potential additions:
- **Goal Setting**: Allow clients to set goals for fields
- **Reminders**: Push notifications for measurement reminders
- **Analytics**: Advanced insights and trends
- **Export**: Export measurement history as PDF/CSV
- **Comparison**: Compare measurements between date ranges
- **Body Composition Analysis**: Calculate additional metrics (BMI, body fat estimation)
- **Progress Charts**: Visual representations of progress
- **Photo Comparison**: Side-by-side before/after photo comparisons
- **Voice Notes**: Audio comments with measurements
- **Trainer Feedback**: Allow trainers to comment on measurements

---

**Last Updated:** November 27, 2025  
**Version:** 1.0  
**Maintained By:** Development Team

