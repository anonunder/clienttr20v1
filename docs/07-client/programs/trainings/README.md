# Client Training Plans API

## Overview

**Module**: Client Training Plan Management  
**Purpose**: Allow clients to view complete training plans with workouts and exercises assigned to their programs  
**Authentication**: Required (JWT Bearer Token)  
**Authorization**: Client role  

### File Structure
- **Routes**: `/src/routes/client/programRoutes.js` (training endpoint)
- **Controller**: `/src/controllers/client/trainingController.js`
- **Service**: `/src/services/client/trainingService.js`

---

## 📋 Endpoints

### Get Training Plan

Retrieves a complete training plan with all workouts, exercises, and media for a specific program. The training plan ID is automatically extracted from the program's metadata.

**Endpoint**: `GET /api/client/programs/:id/training`

**Authentication**: ✅ Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Yes | Program ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID the client belongs to |

**Request Example**:
```http
GET /api/client/programs/5845/training?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 456,
    "post_title": "8-Week Strength Program",
    "post_content": "Complete strength building program",
    "post_date": "2025-01-01T00:00:00.000Z",
    "post_type": "training_plan_assigned",
    "imageUri": "/storage/company-1/user-1/media/training-plan-thumb.jpg",
    "termTaxonomies": [],
    "meta": [],
    "trainingPlanDays": [
      {
        "dayNumber": 1,
        "trainingPlanDayWorkouts": [
          {
            "id": 100,
            "post_title": "Upper Body",
            "post_content": "Chest and back focus",
            "meta": [
              {
                "meta_key": "day",
                "meta_value": "1"
              },
              {
                "meta_key": "workout_thumbnail_media_id",
                "meta_value": "201"
              }
            ],
            "workoutExercises": [
              {
                "term_taxonomy_id": 50,
                "name": "Bench Press",
                "termMeta": [
                  {
                    "meta_key": "sets",
                    "meta_value": "[{\"reps\":10,\"weight\":80,\"rest\":60}]"
                  },
                  {
                    "meta_key": "instructions",
                    "meta_value": "Focus on form"
                  }
                ]
              },
              {
                "term_taxonomy_id": 51,
                "name": "Pull-ups",
                "termMeta": [
                  {
                    "meta_key": "sets",
                    "meta_value": "[{\"reps\":8,\"rest\":90}]"
                  }
                ]
              }
            ],
            "imageUri": "/storage/company-1/user-1/media/workout-100.jpg"
          }
        ]
      },
      {
        "dayNumber": 2,
        "trainingPlanDayWorkouts": [
          {
            "id": 101,
            "post_title": "Lower Body",
            "post_content": "Legs and glutes",
            "meta": [],
            "workoutExercises": []
          }
        ]
      }
    ]
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing/invalid parameters:
```json
{
  "message": "Company ID is required"
}
```
```json
{
  "message": "Valid Program ID is required"
}
```

**403 Forbidden** - User not authorized:
```json
{
  "message": "User not authorized for this company"
}
```

**404 Not Found** - Program doesn't have a training plan:
```json
{
  "message": "Program does not have an assigned training plan"
}
```

**404 Not Found** - Program not found:
```json
{
  "message": "Program not found or not assigned to this client"
}
```

**500 Internal Server Error**:
```json
{
  "message": "<error details>"
}
```

---

## 🔐 Security & Authorization

### Authentication Flow
1. Client logs in via `/api/auth/login`
2. Receives JWT token in response
3. Includes token in `Authorization: Bearer <token>` header for all requests

### Authorization Checks
1. **User Authentication**: JWT token must be valid
2. **Company Membership**: User must have a relationship with the specified company (via `UserRelationship` table)
3. **Program Assignment**: Program must be linked to user via `wp_usermeta` table (`meta_key='program_id'`)
4. **Training Plan Access**: Training plan ID is extracted from program metadata - clients can only access training plans assigned to their programs

### Multi-Tenant Security
- **Main DB Check**: `wp_usermeta` table (MySQL) verifies user has access to program
- **Company DB Check**: Program and training plan fetched from company-specific SQLite database
- **Post Type Filter**: Only `training_plan_assigned` post types are returned (not master `training_plan` templates)

---

## 📊 Data Flow

### Get Training Plan Flow
```
1. Client Request → API Endpoint (/api/client/programs/:id/training)
   ↓
2. Authenticate User (JWT)
   ↓
3. Verify Company Access (UserRelationship table)
   ↓
4. Get Company Database Connection
   ↓
5. Verify Program Assignment (wp_usermeta in Main DB)
   - WHERE user_id = <client_id>
   - AND meta_key = 'program_id'
   - AND meta_value = <program_id>
   ↓
6. Fetch Program & Extract training_plan_id from metadata
   ↓
7. Fetch Training Plan from wp_posts (Company DB)
   - WHERE id = <training_plan_id>
   - AND post_type IN ('training_plan_assigned', 'training_plan')
   ↓
8. Fetch All Workouts for Training Plan
   - WHERE post_parent = <training_plan_id>
   - AND post_type = 'training_plan_workout'
   - ORDER BY menu_order ASC
   ↓
9. For Each Workout:
   a. Fetch workout_exercise TermTaxonomies
      - WHERE post_parent = <workout_id>
      - AND taxonomy = 'workout_exercise'
   b. Fetch full exercise data via Exercise.crud.read.methodLogic
      - Returns complete exercise details with termMeta
   ↓
10. Format using formatDaysInTrainingPlans()
    - Groups workouts by day number
    - Creates trainingPlanDays array structure
   ↓
11. Fetch Training Plan Thumbnail Media (if exists)
    - Get training_plan_thumbnail_media_id from plan metadata
    - Fetch media post and return imageUri
   ↓
12. Return Complete Training Plan with Workouts & Exercises
```

---

## 💡 Response Field Descriptions

### Training Plan Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Training plan ID (post ID in company DB) |
| `post_title` | string | Training plan name/title |
| `post_content` | string | Training plan description |
| `post_date` | string | Creation date (ISO 8601) |
| `post_type` | string | Post type (e.g., "training_plan_assigned") |
| `imageUri` | string\|null | Thumbnail image URL |
| `termTaxonomies` | array | Term taxonomies (colors, tags, etc.) |
| `meta` | array | Training plan metadata |
| `trainingPlanDays` | array | Array of days with workouts (see below) |

### Training Plan Days
| Field | Type | Description |
|-------|------|-------------|
| `dayNumber` | number | Day number in the training plan |
| `trainingPlanDayWorkouts` | array | Array of workouts for this day |

### Workout Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Workout ID (post ID) |
| `post_title` | string | Workout name/title |
| `post_content` | string | Workout description/instructions |
| `meta` | array | Workout metadata (day, thumbnail_media_id, etc.) |
| `imageUri` | string\|null | Workout thumbnail image URL |
| `workoutExercises` | array | Array of exercises in this workout (see below) |

### Exercise Object
| Field | Type | Description |
|-------|------|-------------|
| `term_taxonomy_id` | number | Exercise taxonomy ID |
| `name` | string | Exercise name |
| `termMeta` | array | Exercise metadata (sets, reps, weight, rest, instructions, etc.) |

### Exercise Metadata (termMeta)
Common meta keys:
- `sets`: JSON array of set information (reps, weight, rest, etc.)
- `instructions`: Exercise-specific instructions
- `demonstration_media_id`: ID of demonstration video/image
- `equipment`: Required equipment
- `muscle_groups`: Targeted muscle groups

---

## 🔗 Database Architecture

### Training Plan Structure
- **Training Plan**: Stored as `wp_posts` with `post_type = 'training_plan_assigned'`
- **Workouts**: Child posts with `post_type = 'training_plan_workout'` and `post_parent = <training_plan_id>`
- **Exercises**: Linked via `wp_term_taxonomy` with `taxonomy = 'workout_exercise'` and `post_parent = <workout_id>`
- **Media**: Thumbnails stored as `wp_posts` with `post_type = 'media'` and referenced via metadata

### Post Types
- `training_plan`: Master template created by trainer (not accessible to clients)
- `training_plan_assigned`: Client-specific copy of training plan (accessible to assigned client)
- `training_plan_workout`: Workout posts linked to a training plan
- `media`: Media posts containing images/videos

### Metadata Keys

**Training Plan Metadata**:
- `training_plan_thumbnail_media_id`: Media ID for plan thumbnail

**Workout Metadata**:
- `day`: Day number this workout belongs to
- `workout_thumbnail_media_id`: Media ID for workout thumbnail
- `demo_media_id`: Media ID for workout demonstration

---

## 📝 Implementation Notes

### Service Function: `getClientTrainingPlanById()`

Located in `/src/services/client/trainingService.js`

**Parameters**:
- `programId` (number): Program ID
- `userId` (number): Client user ID
- `companyId` (number): Company ID
- `mainModels` (object): Main database models
- `companyModels` (object): Company database models
- `companyDB` (object): Company database connection

**Process**:
1. Verifies program assignment via `wp_usermeta`
2. Extracts `training_plan_id` from program metadata
3. Fetches training plan post with metadata
4. Fetches all workouts ordered by `menu_order`
5. For each workout:
   - Fetches workout exercises via `TermTaxonomy`
   - Uses `Exercise.crud.read.methodLogic` to get complete exercise data
6. Formats using `formatDaysInTrainingPlans()` helper
7. Fetches and attaches thumbnail media URI

**Key Features**:
- Automatic plan ID extraction (no need to pass plan ID in URL)
- Complete exercise data with all metadata
- Media URI resolution for thumbnails
- Day-based organization of workouts

---

## 🧪 Testing

### Request Example
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get training plan
curl -X GET "http://localhost:3000/api/client/programs/5845/training?companyId=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### JavaScript/Axios Example
```javascript
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'client@example.com',
  password: 'password123'
});
const token = loginResponse.data.token;

// Get training plan
const trainingPlanResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5845/training?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(trainingPlanResponse.data);
```

---

## 🔗 Related Documentation

- [Client Programs API](../programs/README.md) - Main programs endpoint
- [Training Plan Entity](../../03-entities/post-based/training-plan/README.md) - Training plan structure
- [Exercise Entity](../../03-entities/term-based/exercise/README.md) - Exercise structure
- [Workout Entity](../../03-entities/post-based/workout/README.md) - Workout structure
- [Assigned Content](../../04-extending-for-clients/assigned-content.md) - Assignment flow

---

## ✅ Status

**Status**: ✅ Implemented and Tested  
**Version**: 1.0  
**Last Updated**: 2025-01-15
