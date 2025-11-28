# Client Reports API Documentation

**Version:** 1.3  
**Date:** November 18, 2025  
**Status:** ✅ Fully Implemented

---

## 📋 Overview

This module provides REST API endpoints for clients to view, fill, and submit periodic reports/questionnaires assigned to them by trainers. The reports system allows trainers to track client progress through structured questionnaires that can be sent on a recurring basis.

**Key Features:**
- ✅ View pending reports that need to be filled
- ✅ View completed reports with submission history
- ✅ Get detailed report with questions
- ✅ Submit report responses
- ✅ **Draft saving** - Save progress without submitting
- ✅ **Image uploads** - Upload progress photos (compressed & stored as media posts)
- ✅ **Detail statistics fields** (28 comprehensive body measurements)
- ✅ View report statistics (completion rate, totals)

---

## 🗄️ Database Structure

### Report Types

The system uses two post types:

#### 1. Client Report (`client_report`)
Created by trainers, contains the questionnaire template.

```sql
wp_posts
├── id: Report ID
├── post_type: 'client_report'
├── post_title: Report name (e.g., "Weekly Progress Check")
├── post_content: Report description/notes
├── post_author: Trainer ID
├── post_status: 'publish' | 'draft'
└── post_date: Creation date

wp_postmeta
├── client_id: Target client ID
├── report_sending_schedule: Days between sends (e.g., "7" for weekly)
├── start_sending_date: When to start sending (ISO date)
├── initial_sending: Send immediately on creation ("true"/"false")
├── one_time_sending: "1" = send once, "0" = recurring
├── details_statistic: "1" = include detailed stats (28 body measurements)
├── upload_image: "1" or "true" = client can upload progress photos
└── report_questions: JSON array of questions
```

#### 2. Report Response (`report_response`)
Created automatically by cron job, filled by clients.

```sql
wp_posts
├── id: Response ID
├── post_type: 'report_response'
├── post_title: Same as parent report
├── post_author: Client ID
├── post_status: 'pending' | 'publish' (pending = draft or not filled, publish = submitted)
├── post_parent: Client Report ID
└── post_date: When report was sent to client

wp_postmeta
├── client_id: Client ID
├── report_id: Parent client_report ID
├── response_data: JSON array of answers
├── submitted_at: ISO timestamp when submitted (only set when status='submitted')
├── response_status: 'pending' | 'draft' | 'submitted'
└── report_media_id: Media post ID (multiple entries, one per image)
```

#### 3. Media Posts (for uploaded images)
When clients upload images, they're stored as media posts:

```sql
wp_posts
├── id: Media ID
├── post_type: 'media'
├── post_title: Original filename
├── post_content: Web-accessible path
├── post_author: Client ID
├── post_status: 'publish'
├── post_parent: Report Response ID (links to report_response)
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
1. Trainer creates client_report
   ↓
2. Cron job creates report_response (post_status='pending', response_status='pending')
   ↓
3. Client sees report in "pending" list
   ↓
4a. Client saves as DRAFT
    - Responses saved
    - Images uploaded & compressed
    - post_status remains 'pending'
    - response_status='draft'
    - NO submitted_at timestamp
    - Report stays in "pending" list with status='draft'
   ↓
4b. Client SUBMITS report
    - Responses saved
    - Images uploaded & compressed
    - post_status='publish'
    - response_status='submitted'
    - submitted_at timestamp set
    - Report moves to "completed" list
   ↓
5. (If recurring) Cron creates new report_response after X days
```

### Status Flow

```
PENDING (not filled)
response_status: 'pending'
post_status: 'pending'
submitted_at: null

       ↓ (Client saves as draft)

DRAFT (in progress)
response_status: 'draft'
post_status: 'pending'
submitted_at: null

       ↓ (Client submits)

SUBMITTED (completed)
response_status: 'submitted'
post_status: 'publish'
submitted_at: "2025-11-18T10:30:00.000Z"
```

### Question Structure

Questions are stored in `report_questions` metadata as JSON:

```json
[
  {
    "type": "text",
    "text": "How do you feel today?",
    "options": [],
    "required": true
  },
  {
    "type": "number",
    "text": "Current weight (kg)",
    "options": [],
    "required": true
  },
  {
    "type": "textarea",
    "text": "Any pain or discomfort?",
    "options": [],
    "required": false
  },
  {
    "type": "radio",
    "text": "Energy level",
    "options": ["Low", "Medium", "High"],
    "required": true
  }
]
```

### Response Structure

Client responses are stored in `response_data` metadata as JSON:

```json
[
  {
    "question": "How do you feel today?",
    "answer": "Feeling great and motivated!"
  },
  {
    "question": "Current weight (kg)",
    "answer": "75.5"
  },
  {
    "question": "Any pain or discomfort?",
    "answer": "None"
  },
  {
    "question": "Energy level",
    "answer": "High"
  }
]
```

---

## 📡 API Endpoints

### Base Route
```
/api/client/reports
```

All endpoints require:
- **Authentication**: JWT Bearer token
- **Query Parameter**: `companyId` (required)

---

### 1. Get Pending Reports

Get all reports that need to be filled by the client. Includes both new pending reports and saved drafts.

```http
GET /api/client/reports/pending?companyId={companyId}
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
      "responseId": 201,
      "reportId": 110,
      "title": "Weekly Check-in",
      "description": "Please fill out your weekly progress report",
      "questions": [
        {
          "type": "text",
          "text": "How do you feel today?",
          "options": [],
          "required": true
        },
        {
          "type": "number",
          "text": "Current weight (kg)",
          "options": [],
          "required": true
        }
      ],
      "sentDate": "2025-11-18T10:00:00.000Z",
      "status": "pending",
      "clientId": "108",
      // Note: Status can be "pending" for new reports or "draft" for saved drafts
      "detailsStatistic": true,
      "detailStatisticsFields": [
        {
          "fieldName": "bodyWeight",
          "key": "body_weight",
          "slug": "body_weight",
          "unit": "kg",
          "type": "number",
          "order": 1,
          "category": "general",
          "enabled": true,
          "hasGoal": true
        }
        // ... 27 more measurement fields
      ],
      "uploadImage": true,
      "trainerName": "John Doe",
      "trainerEmail": "johndoe@example.com"
    }
  ],
  "count": 1
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 2. Get Completed Reports

Get all reports that have been submitted by the client.

```http
GET /api/client/reports/completed?companyId={companyId}&startDate={startDate}&endDate={endDate}&limit={limit}&offset={offset}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `startDate` | string (ISO) | No | Filter by submission date (from) |
| `endDate` | string (ISO) | No | Filter by submission date (to) |
| `limit` | number | No | Number of results (default: 50) |
| `offset` | number | No | Pagination offset (default: 0) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "responseId": 112,
      "reportId": 110,
      "title": "Weekly Check-in",
      "description": "Please fill out your weekly progress report",
      "questions": [
        {
          "type": "text",
          "text": "How do you feel today?",
          "options": [],
          "required": true
        }
      ],
      "responses": [
        {
          "question": "How do you feel today?",
          "answer": "Feeling great!"
        },
        {
          "question": "Current weight (kg)",
          "answer": "75.5"
        }
      ],
      "submittedAt": "2025-11-18T15:30:00.000Z",
      "sentDate": "2025-11-18T10:00:00.000Z",
      "status": "completed",
      "clientId": "108",
      "detailsStatistic": true,
      "detailStatisticsFields": [
        {
          "fieldName": "bodyWeight",
          "key": "body_weight",
          "slug": "body_weight",
          "unit": "kg",
          "type": "number",
          "order": 1,
          "category": "general",
          "enabled": true,
          "hasGoal": true
        }
        // ... 27 more measurement fields
      ],
      "uploadImage": true,
      "trainerName": "John Doe",
      "trainerEmail": "johndoe@example.com"
    }
  ],
  "pagination": {
    "total": 5,
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

### 3. Get Report Response by ID

Get detailed information about a specific report response (pending or completed).

```http
GET /api/client/reports/{responseId}?companyId={companyId}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `responseId` | number | Yes | Report response ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "responseId": 201,
    "reportId": 110,
    "title": "Weekly Check-in",
    "description": "Please fill out your weekly progress report",
    "questions": [
      {
        "type": "text",
        "text": "How do you feel today?",
        "options": [],
        "required": true
      },
      {
        "type": "number",
        "text": "Current weight (kg)",
        "options": [],
        "required": true
      }
    ],
    "responses": [],
    "submittedAt": null,
    "sentDate": "2025-11-18T10:00:00.000Z",
    "status": "pending",
    "clientId": "108",
    "detailsStatistic": true,
    "detailStatisticsFields": [
      {
        "fieldName": "bodyWeight",
        "key": "body_weight",
        "slug": "body_weight",
        "unit": "kg",
        "type": "number",
        "order": 1,
        "category": "general",
        "enabled": true,
        "hasGoal": true
      }
      // ... 27 more measurement fields
    ],
    "uploadImage": true,
    "trainerName": "John Doe",
    "trainerEmail": "johndoe@example.com"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId or invalid responseId
- `403` - Unauthorized for this company
- `404` - Report response not found
- `500` - Server error

---

### 4. Submit Report Response

Submit or update a report response with answers to the questions. Supports both final submission and draft saving, plus image uploads.

```http
POST /api/client/reports/{responseId}/submit
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `responseId` | number | Yes | Report response ID |

**Request Body:**
```json
{
  "companyId": 1,
  "responses": [
    {
      "question": "How do you feel today?",
      "answer": "Feeling great and motivated!"
    },
    {
      "question": "Current weight (kg)",
      "answer": "75.5"
    },
    {
      "question": "Any pain or discomfort?",
      "answer": "None"
    }
  ],
  "status": "submitted",
  "images": [
    {
      "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/4gHY...",
      "fileName": "progress-photo-front.jpg",
      "mimeType": "image/jpeg"
    },
    {
      "data": "iVBORw0KGgoAAAANSUhEUgAAA...",
      "fileName": "progress-photo-side.png",
      "mimeType": "image/png"
    }
  ]
}
```

**Request Body Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `responses` | Array | Yes | Array of question-answer pairs |
| `status` | string | No | Response status: `"submitted"` (default) or `"draft"` |
| `images` | Array | No | Array of base64 image objects (progress photos) |

**Image Upload Format:**
Each image object should contain:
- `data`: Base64 encoded image (with or without `data:image/...;base64,` prefix)
- `fileName`: Original filename
- `mimeType`: `"image/jpeg"` or `"image/png"`

**Note:** 
- Images are automatically compressed (quality: 80%)
- Images stored in: `storage/company-{id}/clients/client-{id}/reports/`
- Images saved as media posts with `post_parent` linking to report_response
- Maximum recommended size: 10MB per image

---

### 📝 Draft Saving

**To save as draft:**
```json
{
  "companyId": 1,
  "responses": [
    {
      "question": "How do you feel today?",
      "answer": "Feeling okay"
    }
  ],
  "status": "draft",
  "images": [...]
}
```

**Draft Behavior:**
- ✅ Saves all responses
- ✅ Uploads and compresses images
- ✅ `response_status` set to `"draft"`
- ✅ `post_status` remains `"pending"`
- ❌ NO `submitted_at` timestamp
- 📋 Report stays in "pending" list with `status: "draft"`
- 🔄 Can be updated multiple times

**To submit (finalize):**
```json
{
  "status": "submitted"  // or omit status field
}
```

**Submit Behavior:**
- ✅ Saves all responses
- ✅ Uploads and compresses images
- ✅ `response_status` set to `"submitted"`
- ✅ `post_status` changes to `"publish"`
- ✅ `submitted_at` timestamp recorded
- 📋 Report moves to "completed" list

---

**Response (Submitted):**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "responseId": 201,
    "reportId": 110,
    "title": "Weekly Check-in",
    "description": "Please fill out your weekly progress report",
    "questions": [...],
    "responses": [
      {
        "question": "How do you feel today?",
        "answer": "Feeling great and motivated!"
      },
      {
        "question": "Current weight (kg)",
        "answer": "75.5"
      }
    ],
    "images": [
      {
        "id": 456,
        "fileName": "progress-photo-front.jpg",
        "path": "/storage/company-1/clients/client-108/reports/report_201_1732012345_0_compressed.jpg",
        "size": 245678,
        "mimeType": "image/jpeg",
        "uploadedAt": "2025-11-18T15:30:00.000Z"
      }
    ],
    "submittedAt": "2025-11-18T15:30:00.000Z",
    "sentDate": "2025-11-18T10:00:00.000Z",
    "status": "completed",
    "clientId": "108",
    "detailsStatistic": true,
    "detailStatisticsFields": [...],
    "uploadImage": true,
    "trainerName": "John Doe",
    "trainerEmail": "johndoe@example.com"
  }
}
```

**Response (Draft):**
```json
{
  "success": true,
  "message": "Report saved as draft",
  "data": {
    "responseId": 201,
    "reportId": 110,
    "title": "Weekly Check-in",
    "description": "Please fill out your weekly progress report",
    "questions": [...],
    "responses": [
      {
        "question": "How do you feel today?",
        "answer": "Feeling okay"
      }
    ],
    "images": [
      {
        "id": 457,
        "fileName": "progress-photo-draft.jpg",
        "path": "/storage/company-1/clients/client-108/reports/report_201_1732012300_0_compressed.jpg",
        "size": 198234,
        "mimeType": "image/jpeg",
        "uploadedAt": "2025-11-18T15:25:00.000Z"
      }
    ],
    "submittedAt": null,
    "sentDate": "2025-11-18T10:00:00.000Z",
    "status": "draft",
    "clientId": "108",
    "detailsStatistic": true,
    "detailStatisticsFields": [...],
    "uploadImage": true,
    "trainerName": "John Doe",
    "trainerEmail": "johndoe@example.com"
  }
}
```

**Status Codes:**
- `200` - Success (submitted or saved as draft)
- `400` - Missing companyId, invalid responseId, missing responses array, invalid status (must be "submitted" or "draft"), or invalid images array
- `403` - Unauthorized for this company
- `404` - Report response not found
- `500` - Server error

---

### 5. Get Report Statistics

Get statistics about report completion for the client.

```http
GET /api/client/reports/statistics?companyId={companyId}&startDate={startDate}&endDate={endDate}
```

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
    "totalReports": 10,
    "completedReports": 8,
    "pendingReports": 2,
    "completionRate": 80.00
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
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

### 3. Report Ownership Validation
- Report responses must have `post_author = client_user_id`
- Client can only view/submit their own reports
- No access to other clients' data

### 4. Multi-Tenant Isolation
- Each company has separate SQLite database
- No data leakage between companies
- Database selected via `CompaniesDbManager.getCompanyDB(companyId)`

### 5. Trainer Information
- All report responses now include trainer details (ID, name, email)
- Trainer information is retrieved from the global User model
- The trainer is the user who created the original `client_report` (stored in `post_author` field)

---

## 💡 Usage Examples

### Example 1: Getting Pending Reports

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/reports/pending?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`You have ${response.data.count} pending report(s) to fill`);
response.data.data.forEach(report => {
  console.log(`- ${report.title} (${report.questions.length} questions)`);
});
```

### Example 2: Submitting a Report

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const responseId = 201;

const reportAnswers = {
  companyId: companyId,
  responses: [
    {
      question: "How do you feel today?",
      answer: "Feeling great and energized!"
    },
    {
      question: "Current weight (kg)",
      answer: "75.5"
    },
    {
      question: "Any pain or discomfort?",
      answer: "None"
    },
    {
      question: "Energy level",
      answer: "High"
    }
  ]
};

const response = await axios.post(
  `http://localhost:3000/api/client/reports/${responseId}/submit`,
  reportAnswers,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log('Report submitted successfully!');
```

### Example 2b: Saving a Report as Draft

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const responseId = 201;

const reportDraft = {
  companyId: companyId,
  responses: [
    {
      question: "How do you feel today?",
      answer: "Feeling okay, a bit tired"
    },
    {
      question: "Current weight (kg)",
      answer: "75.2"
    }
    // Partial answers - can complete later
  ],
  status: "draft"  // Save as draft
};

const response = await axios.post(
  `http://localhost:3000/api/client/reports/${responseId}/submit`,
  reportDraft,
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log('Report saved as draft!');
console.log('Status:', response.data.data.status); // "draft"
console.log('You can update and submit later');
```

### Example 3: Viewing Completed Reports

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/reports/completed?companyId=${companyId}&limit=10`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`You have completed ${response.data.pagination.total} report(s)`);
response.data.data.forEach(report => {
  console.log(`\n${report.title}`);
  console.log(`Submitted: ${report.submittedAt}`);
  console.log(`Responses: ${report.responses.length} answers`);
});
```

### Example 4: Checking Statistics

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/reports/statistics?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const stats = response.data.data;
console.log(`Report Statistics:`);
console.log(`- Total: ${stats.totalReports}`);
console.log(`- Completed: ${stats.completedReports}`);
console.log(`- Pending: ${stats.pendingReports}`);
console.log(`- Completion Rate: ${stats.completionRate}%`);
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

# Login and get token
echo "=== Logging in ==="
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

echo "Token: $TOKEN"

# Get pending reports
echo -e "\n=== Getting pending reports ==="
curl -s -X GET "$API_URL/api/client/reports/pending?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get completed reports
echo -e "\n=== Getting completed reports ==="
curl -s -X GET "$API_URL/api/client/reports/completed?companyId=$COMPANY_ID&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get statistics
echo -e "\n=== Getting report statistics ==="
curl -s -X GET "$API_URL/api/client/reports/statistics?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Save a report as draft (replace 201 with actual response ID)
echo -e "\n=== Saving report as draft ==="
curl -s -X POST "$API_URL/api/client/reports/201/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "responses": [
      {
        "question": "How do you feel today?",
        "answer": "Feeling okay"
      }
    ],
    "status": "draft"
  }' | jq

# Submit a report (replace 201 with actual response ID)
echo -e "\n=== Submitting report response ==="
curl -s -X POST "$API_URL/api/client/reports/201/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "responses": [
      {
        "question": "How do you feel today?",
        "answer": "Feeling great!"
      },
      {
        "question": "Current weight (kg)",
        "answer": "75.5"
      }
    ],
    "status": "submitted"
  }' | jq
```

---

## 📊 Database Queries

### Find All Report Responses for a Client

```sql
SELECT 
  p.id as response_id,
  p.post_title,
  p.post_status,
  p.post_date as sent_date,
  pm1.meta_value as client_id,
  pm2.meta_value as submitted_at,
  pm3.meta_value as response_data
FROM wp_posts p
LEFT JOIN wp_postmeta pm1 ON p.id = pm1.post_id AND pm1.meta_key = 'client_id'
LEFT JOIN wp_postmeta pm2 ON p.id = pm2.post_id AND pm2.meta_key = 'submitted_at'
LEFT JOIN wp_postmeta pm3 ON p.id = pm3.post_id AND pm3.meta_key = 'response_data'
WHERE p.post_type = 'report_response'
  AND p.post_author = 108  -- Client user ID
ORDER BY p.post_date DESC;
```

### Find Original Report Template

```sql
SELECT 
  p.id as report_id,
  p.post_title,
  p.post_content,
  pm1.meta_value as report_questions,
  pm2.meta_value as details_statistic
FROM wp_posts p
LEFT JOIN wp_postmeta pm1 ON p.id = pm1.post_id AND pm1.meta_key = 'report_questions'
LEFT JOIN wp_postmeta pm2 ON p.id = pm2.post_id AND pm2.meta_key = 'details_statistic'
WHERE p.post_type = 'client_report'
  AND p.id = 110;  -- Report ID
```

---

## 🔧 Integration with Existing System

### Routes Registration

Add to your main routes file (e.g., `src/routes/index.js`):

```javascript
const clientReportsRoutes = require('./client/reportsRoutes');

// Register client reports routes
app.use('/api/client/reports', clientReportsRoutes);
```

### File Structure

```
src/
├── controllers/client/
│   └── reportsController.js       ✅ New
├── services/client/
│   └── reportsService.js          ✅ New
└── routes/client/
    └── reportsRoutes.js           ✅ New
```

---

## 📝 Meta Keys Reference

### Client Report Meta Keys

| Meta Key | Type | Description | Example |
|----------|------|-------------|---------|
| `client_id` | string | Target client user ID | `"108"` |
| `report_sending_schedule` | string | Days between sends | `"7"` (weekly) |
| `start_sending_date` | string (ISO) | When to start sending | `"2025-01-01"` |
| `initial_sending` | string | Send immediately | `"true"` or `"false"` |
| `one_time_sending` | string | Send once vs recurring | `"1"` or `"0"` |
| `details_statistic` | string | Include detailed stats (28 measurements) | `"1"` or `"0"` |
| `upload_image` | string | Allow image upload | `"1"`, `"true"`, or `"0"` |
| `report_questions` | string (JSON) | Array of questions | `[{...}]` |

### Report Response Meta Keys

| Meta Key | Type | Description | Example |
|----------|------|-------------|---------|
| `client_id` | string | Client who received report | `"108"` |
| `report_id` | string | Parent client_report ID | `"110"` |
| `response_data` | string (JSON) | Array of answers | `[{question:"...", answer:"..."}]` |
| `submitted_at` | string (ISO) | Submission timestamp (only when submitted) | `"2025-11-18T15:30:00.000Z"` |
| `response_status` | string | Status | `"pending"`, `"draft"`, or `"submitted"` |
| `report_media_id` | string | Media post ID (multiple entries) | `"456"`, `"457"`, `"458"` |

**Note:** `report_media_id` can have multiple entries for the same `post_id`, one for each uploaded image.

### Media Post Meta Keys (for uploaded images)

| Meta Key | Type | Description | Example |
|----------|------|-------------|---------|
| `file_size` | string | File size in bytes | `"245678"` |
| `file_path` | string | Web-accessible path | `"/storage/company-1/clients/client-108/reports/..."` |
| `original_name` | string | Original filename | `"progress-photo-front.jpg"` |
| `uploaded_at` | string (ISO) | Upload timestamp | `"2025-11-18T15:30:00.000Z"` |

---

## ⚠️ Important Notes

### 1. Report Creation (Trainer Side)
- Reports are created by trainers via Socket.IO (`company:clientreport:create`)
- This REST API is **read-only for report templates**
- Clients can only **read and respond to** reports

### 2. Automatic Report Sending
- Cron job (`/src/jobs/report.js`) creates `report_response` posts automatically
- Based on `report_sending_schedule` and `start_sending_date`
- Clients don't create report_response posts themselves

### 3. Status Determination
Report status values:
- **`"pending"`**: New report that hasn't been started
- **`"draft"`**: Report saved as draft (can be updated multiple times)
- **`"completed"`**: Report fully submitted (final)

A report is considered "completed" if:
- `post_status = 'publish'` OR
- `response_status = 'submitted'` (in meta) AND
- `response_data` contains answers (non-empty array)

### 4. Draft Saving
- Clients can save reports as drafts using `"status": "draft"` in the submit endpoint
- Drafts can be saved and updated multiple times
- Drafts appear in the pending reports list with `status: "draft"`
- Drafts do not have a `submitted_at` timestamp
- To finalize a draft, submit again with `"status": "submitted"` or omit the status field

### 5. No Modification After Submission
- Once submitted (status = "submitted"), report responses cannot be edited
- Clients can only view completed reports
- Drafts can be updated until final submission
- Trainers can view all responses (pending, draft, and completed)

---

## 📊 Detail Statistics & Image Upload

### Detail Statistics Fields

When a report has `details_statistic: '1'`, the API returns a `detailStatisticsFields` array containing 28 comprehensive body measurement fields.

**Purpose:** Allows trainers to request detailed body measurements from clients along with standard report questions.

**Categories:**
- **General** (2 fields): Body Weight, Height
- **Body Composition** (7 fields): Body Fat %, Muscle Mass, Muscle %, Body Water %, Bone Mass, Visceral Fat, Protein %
- **Calculated/Metabolic** (3 fields): BMI, BMR, Metabolic Age
- **Torso Circumferences** (6 fields): Chest, Shoulders, Waist, Abdomen, Hips, Neck
- **Upper Body Circumferences** (5 fields): Biceps (L/R), Forearms (L/R), Wrist
- **Lower Body Circumferences** (5 fields): Thighs (L/R), Calves (L/R), Ankle

**Field Structure:**
```javascript
{
  "fieldName": "bodyWeight",      // camelCase field name
  "key": "body_weight",           // internal key
  "slug": "body_weight",          // i18n slug (snake_case)
  "unit": "kg",                   // measurement unit
  "type": "number",               // data type
  "order": 1,                     // display order
  "category": "general",          // field category
  "enabled": true,                // enabled by default
  "hasGoal": true                 // supports goal tracking
}
```

**When to Use:**
- Progress tracking reports
- Weekly/monthly check-ins
- Body transformation monitoring
- Competition prep tracking

**Example Response:**
```json
{
  "detailsStatistic": true,
  "detailStatisticsFields": [
    {
      "fieldName": "bodyWeight",
      "slug": "body_weight",
      "unit": "kg",
      "hasGoal": true
    },
    {
      "fieldName": "height",
      "slug": "height",
      "unit": "cm",
      "hasGoal": false
    }
    // ... 26 more fields
  ]
}
```

**Frontend Integration:**
```javascript
// Check if report includes detail statistics
if (report.detailsStatistic && report.detailStatisticsFields) {
  // Group fields by category
  const groupedFields = report.detailStatisticsFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {});
  
  // Render measurement form with i18n
  Object.entries(groupedFields).map(([category, fields]) => (
    <Section key={category} title={t(`detail_statistics.categories.${category}`)}>
      {fields.map(field => (
        <Input
          key={field.slug}
          label={t(`detail_statistics.${field.slug}`)}
          placeholder={`Enter ${field.unit}`}
          type={field.type}
          hasGoal={field.hasGoal}
        />
      ))}
    </Section>
  ));
}
```

**Translation Support:**
- **Languages:** English, Serbian, German
- **Translation File:** `/docs/detail-statistics-translations.json`
- **Key Format:** `detail_statistics.{slug}`
- **Constants Module:** `/src/constants/detailStatisticsConst.js`

**Example Translations:**
| Field | English | Serbian | German |
|-------|---------|---------|--------|
| `body_weight` | Body Weight | Telesna težina | Körpergewicht |
| `muscle_mass` | Muscle Mass | Mišićna masa | Muskelmasse |
| `bmi` | BMI | BMI | BMI |

---

### Upload Image Support

When a report has `upload_image: '1'` or `'true'`, clients can upload progress photos alongside their responses.

**Purpose:** Visual progress tracking with before/after photos, body transformation documentation.

**Field:** `uploadImage` (boolean)

**Example:**
```json
{
  "responseId": 201,
  "uploadImage": true,
  "detailsStatistic": true
}
```

**Frontend Implementation:**
```javascript
if (report.uploadImage) {
  // Show image picker component
  <ImageUploadComponent
    onImageSelected={(image) => {
      // Upload image and attach to report response
      uploadProgressPhoto(image, report.responseId);
    }}
    maxImages={4}  // Allow multiple angles
    aspectRatio="3:4"  // Portrait photos
  />
}
```

**Use Cases:**
- Body transformation tracking
- Posture monitoring
- Injury recovery documentation
- Competition prep progress

**Storage:**
Images are typically stored in the media library and linked to the report response via metadata.

---

## 🔗 Related Documentation

- [Client API Overview](../README.md)
- [Client Interactions (Workout Sessions, Favorites)](../CLIENT-INTERACTIONS.md)
- [Questionnaires System](../../03-entities/questionnaires.md)
- [Client Report Entity](../../03-entities/post-based/client-report/README.md)
- [Authentication System](../../02-authentication/README.md)
- **[Detail Statistics Constants](/docs/constants/DETAIL-STATISTICS-README.md)** ⭐ New
- **[Detail Statistics Translations](/docs/detail-statistics-translations.json)** ⭐ New

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Get Pending Reports | ✅ Complete | Filters out completed reports, includes drafts |
| Get Completed Reports | ✅ Complete | With pagination |
| Get Report by ID | ✅ Complete | Pending, draft, or completed |
| Submit Report Response | ✅ Complete | Updates status and metadata |
| **Draft Saving** | ✅ Complete | Save reports as draft, update multiple times |
| Get Statistics | ✅ Complete | Total, completed, pending, rate |
| JWT Authentication | ✅ Complete | All endpoints protected |
| Company Authorization | ✅ Complete | UserRelationship validation |
| Multi-tenant Isolation | ✅ Complete | Separate company databases |
| **Detail Statistics Fields** | ✅ Complete | 28 body measurement fields |
| **Upload Image Support** | ✅ Complete | Progress photo uploads |
| **Multilingual Support** | ✅ Complete | EN, SR, DE translations |

---

## 🚀 Future Enhancements

Potential additions:
- **Notifications**: Push notifications when new reports are available
- **Analytics**: Detailed insights into response patterns and measurement trends
- **Reminders**: Automated reminders for pending reports
- **Export**: Export report history and measurements as PDF or CSV
- **Progress Charts**: Visualize measurement changes over time
- **Comparison View**: Compare measurements between different time periods
- **Custom Fields**: Allow trainers to define additional custom measurement fields
- **Video Upload**: Support video progress clips alongside photos
- **AI Insights**: Automated analysis of measurement trends and recommendations

---

**Last Updated:** November 18, 2025  
**Version:** 1.2 (Added Draft Saving, Detail Statistics & Upload Image)  
**Maintained By:** Development Team

