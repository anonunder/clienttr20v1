# Client Programs API

## Overview

**Module**: Client Program Management  
**Purpose**: Allow clients to view their assigned programs, training plans, and nutrition plans  
**Authentication**: Required (JWT Bearer Token)  
**Authorization**: Client role  

### File Structure
- **Routes**: `/src/routes/client/programRoutes.js`
- **Controllers**:
  - `/src/controllers/client/programController.js` - Program endpoints
  - `/src/controllers/client/trainingController.js` - Training plan endpoints
  - `/src/controllers/client/nutritionController.js` - Nutrition plan endpoints
- **Services**:
  - `/src/services/client/programService.js` - Program business logic
  - `/src/services/client/trainingService.js` - Training plan business logic
  - `/src/services/client/nutritionService.js` - Nutrition plan business logic

---

## 📋 Endpoints

### 1. Get All Assigned Programs

Retrieves all programs assigned to the authenticated client.

**Endpoint**: `GET /api/client/programs`

**Authentication**: ✅ Required (Bearer Token)

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID the client belongs to |

**Request Example**:
```http
GET /api/client/programs?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 5845,
      "title": "Program za mrsavljenje",
      "description": "Complete 12-week weight loss program",
      "imageUri": "/storage/company-1/user-1/media/123",
      "duration": "12 weeks",
      "difficulty": "Intermediate",
      "trainer": "John Doe",
      "trainingPlan": {
        "id": "456",
        "title": "Program za mrsavljenje - Training",
        "imageUri": "storage/company-1/user-1/media/training-plan-thumb.jpg"
      },
      "nutritionPlan": {
        "id": "789",
        "title": "Program za mrsavljenje - Nutrition",
        "imageUri": "storage/company-1/user-1/media/nutrition-plan-thumb.jpg"
      },
      "status": "active",
      "paymentStatus": "unpaid",
      "startDate": "2025-01-01T00:00:00.000Z",
      "endDate": "2025-03-31T00:00:00.000Z",
      "autoRevealDays": null,
      "hasTrainingPlan": true,
      "hasNutritionPlan": true,
      "trainingPlanId": "456",
      "nutritionPlanId": "789",
      "clientId": "109",
      "dateAssigned": "2025-01-15T10:30:00.000Z",
      "trainerId": 1,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-20T14:45:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Responses**:

**400 Bad Request** - Missing company ID:
```json
{
  "message": "Company ID is required"
}
```

**403 Forbidden** - User not authorized for company:
```json
{
  "message": "User not authorized for this company"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Failed to fetch assigned programs: <error details>"
}
```

---

### 2. Get Single Program by ID

Retrieves a specific assigned program by ID.

**Endpoints**: 
- `GET /api/client/programs/:id` (plural)
- `GET /api/client/program/:id` (singular - alias)

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
GET /api/client/programs/5845?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
Or using singular route:
```http
GET /api/client/program/5845?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 5845,
    "title": "Program za mrsavljenje",
    "description": "Complete 12-week weight loss program with personalized meal plans and training routines",
    "imageUri": "/storage/company-1/user-1/media/123",
    "duration": "12 weeks",
    "difficulty": "Intermediate",
    "trainer": "John Doe",
    "trainingPlan": {
      "id": "456",
      "title": "Program za mrsavljenje - Training",
      "imageUri": "storage/company-1/user-1/media/training-plan-thumb.jpg"
    },
    "nutritionPlan": {
      "id": "789",
      "title": "Program za mrsavljenje - Nutrition",
      "imageUri": "storage/company-1/user-1/media/nutrition-plan-thumb.jpg"
    },
    "status": "active",
    "paymentStatus": "paid",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-03-31T00:00:00.000Z",
    "autoRevealDays": 7,
    "hasTrainingPlan": true,
    "hasNutritionPlan": true,
    "trainingPlanId": "456",
    "nutritionPlanId": "789",
    "clientId": "109",
    "dateAssigned": "2025-01-15T10:30:00.000Z",
    "trainerId": 1,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-20T14:45:00.000Z"
  }
}
```

**Error Responses**:

**400 Bad Request** - Missing/invalid parameters:
```json
{
  "message": "Valid Program ID is required"
}
```
```json
{
  "message": "Company ID is required"
}
```

**403 Forbidden** - User not authorized:
```json
{
  "message": "User not authorized for this company"
}
```
```json
{
  "message": "Unauthorized access to this program"
}
```

**404 Not Found** - Program not found:
```json
{
  "message": "Program not found or not assigned to this client"
}
```
```json
{
  "message": "Program not found in company database"
}
```

**500 Internal Server Error**:
```json
{
  "message": "<error details>"
}
```

---

### 3. Get Training Plan

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
                  }
                ]
              }
            ]
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
            "workoutExercises": []
          }
        ]
      }
    ]
  }
}
```

**Error Responses**:

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

---

### 4. Get Nutrition Plan

Retrieves a complete nutrition plan with all meals, recipes, and media for a specific program. The nutrition plan ID is automatically extracted from the program's metadata.

**Endpoint**: `GET /api/client/programs/:id/nutrition`

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
GET /api/client/programs/5845/nutrition?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)** - By Days Format:
```json
{
  "success": true,
  "data": {
    "id": 789,
    "post_title": "High Protein Diet",
    "post_content": "3000 calories daily",
    "post_date": "2025-01-01T00:00:00.000Z",
    "post_type": "nutrition_plan_assigned",
    "post_mime_type": "days",
    "imageUri": "/storage/company-1/user-1/media/nutrition-plan-thumb.jpg",
    "termTaxonomies": [],
    "meta": [],
    "nutritionPlanDays": [
      {
        "dayNumber": 1,
        "nutritionPlanDayMeals": [
          {
            "id": 300,
            "post_title": "Protein Breakfast",
            "post_content": "High protein morning meal",
            "mealRecipes": [
              {
                "term_taxonomy_id": 200,
                "name": "Protein Pancakes",
                "termMeta": [
                  {
                    "meta_key": "portions",
                    "meta_value": "1"
                  }
                ]
              }
            ],
            "totalMacros": {
              "calories": 450,
              "protein": 30,
              "carbs": 50,
              "fats": 12
            }
          }
        ]
      }
    ]
  }
}
```

**Success Response (200 OK)** - By Meal Groups Format:
```json
{
  "success": true,
  "data": {
    "id": 789,
    "post_title": "Flexible Meal Plan",
    "post_content": "Choose from meal options",
    "post_type": "nutrition_plan_assigned",
    "post_mime_type": "meals",
    "imageUri": "/storage/company-1/user-1/media/nutrition-plan-thumb.jpg",
    "nutritionPlanMealGroups": [
      {
        "mealGroupName": "Breakfast",
        "nutritionPlanGroupMeals": [
          {
            "id": 300,
            "post_title": "Protein Breakfast",
            "mealRecipes": []
          }
        ]
      }
    ]
  }
}
```

**Error Responses**:

**404 Not Found** - Program doesn't have a nutrition plan:
```json
{
  "message": "Program does not have an assigned nutrition plan"
}
```

**404 Not Found** - Program not found:
```json
{
  "message": "Program not found or not assigned to this client"
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

### Multi-Tenant Security
- **Main DB Check**: `wp_usermeta` table (MySQL) verifies user has access to program
- **Company DB Check**: Program fetched from company-specific SQLite database
- **Post Type Filter**: Only `program_assigned` post types are returned (not master `program` templates)

---

## 📊 Data Flow

### Get All Programs Flow
```
1. Client Request → API Endpoint
   ↓
2. Authenticate User (JWT)
   ↓
3. Verify Company Access (UserRelationship table in Main DB)
   ↓
4. Get Company Database Connection (CompaniesDbManager)
   ↓
5. Fetch Program IDs from wp_usermeta (Main DB)
   - WHERE user_id = <client_id>
   - AND meta_key = 'program_id'
   ↓
6. Fetch Program Details from wp_posts (Company DB)
   - WHERE id IN (<program_ids>)
   - AND post_type = 'program_assigned'
   - AND post_status != 'trash'
   ↓
7. Fetch Program Metadata from wp_postmeta (Company DB)
   ↓
8. Format Response & Return to Client
```

### Get Single Program Flow
```
1. Client Request → API Endpoint
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
6. Fetch Program from wp_posts (Company DB)
   - WHERE id = <program_id>
   - AND post_type = 'program_assigned'
   ↓
7. Fetch Program Metadata from wp_postmeta (Company DB)
   ↓
8. Format Response & Return to Client
```

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
   ↓
9. For Each Workout:
   - Fetch workout_exercise TermTaxonomies
   - Fetch full exercise data via Exercise.crud.read.methodLogic
   ↓
10. Format using formatDaysInTrainingPlans()
   ↓
11. Fetch Training Plan Thumbnail Media (if exists)
   ↓
12. Return Complete Training Plan with Workouts & Exercises
```

### Get Nutrition Plan Flow
```
1. Client Request → API Endpoint (/api/client/programs/:id/nutrition)
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
6. Fetch Program & Extract nutrition_plan_id from metadata
   ↓
7. Fetch Nutrition Plan from wp_posts (Company DB)
   - WHERE id = <nutrition_plan_id>
   - AND post_type IN ('nutrition_plan_assigned', 'nutrition_plan')
   ↓
8. Fetch All Meals for Nutrition Plan
   - WHERE post_parent = <nutrition_plan_id>
   - AND post_type = 'nutrition_plan_meal'
   ↓
9. For Each Meal:
   - Fetch full meal data via Meal.crud.read.methodLogic
   - This includes all associated recipes and macros
   ↓
10. Format using formatNutritionPlans()
    - Handles both "days" and "meals" format types
   ↓
11. Fetch Nutrition Plan Thumbnail Media (if exists)
   ↓
12. Return Complete Nutrition Plan with Meals & Recipes
```

---

## 💡 Response Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique program ID (post ID in company DB) |
| `title` | string | Program name/title |
| `description` | string | Program description/details |
| `imageUri` | string\|null | Media URL from `wp_posts.post_content` (where `post_type='media'`) |
| `duration` | string\|null | Program duration (e.g., "12 weeks") |
| `difficulty` | string | Difficulty level (e.g., "Beginner", "Intermediate", "Advanced") |
| `trainer` | string | Trainer name (from metadata) |
| `trainingPlan` | object\|null | Training plan info (`id`, `title`, `imageUri`) |
| `nutritionPlan` | object\|null | Nutrition plan info (`id`, `title`, `imageUri`) |
| `status` | string | Program status (e.g., "active", "paused", "completed") |
| `paymentStatus` | string | Payment status (e.g., "paid", "unpaid", "pending") |
| `startDate` | string\|null | Program start date (ISO 8601 format) |
| `endDate` | string\|null | Program end date (ISO 8601 format) |
| `autoRevealDays` | number\|null | Days before auto-revealing next content |
| `hasTrainingPlan` | boolean | Whether program includes training plan |
| `hasNutritionPlan` | boolean | Whether program includes nutrition plan |
| `trainingPlanId` | string\|null | ID of associated training plan |
| `nutritionPlanId` | string\|null | ID of associated nutrition plan |
| `clientId` | string\|null | Client user ID (from metadata) |
| `dateAssigned` | string\|null | Date program was assigned to client |
| `trainerId` | number | Trainer user ID (post_author) |
| `createdAt` | string | Program creation timestamp |
| `updatedAt` | string | Last update timestamp |

### Image URI Explanation

The `imageUri` field is fetched from the media post:

1. **Program metadata** (`wp_postmeta`) contains `program_thumbnail_media_id` → media post ID
2. **Service fetches** the media post from `wp_posts` where `post_type='media'` and `id=<media_id>`
3. **Returns** `post_content` field which contains the actual file path/URL

**Example Flow**:
```javascript
// In program meta:
meta_key: 'program_thumbnail_media_id'
meta_value: '41'

// Fetch media post:
SELECT post_content FROM wp_posts 
WHERE id = 41 AND post_type = 'media'

// Result (stored in post_content):
'/storage/company-1/user-1/media/41_program.jpg'
```

**Note**: For media posts, the URL is stored in `post_content`, not `post_name`. The `post_name` field contains the filename without path.

**Training & Nutrition Plan Images**: The service also fetches thumbnail images for training and nutrition plans by:
1. Fetching the training/nutrition plan post
2. Looking for `training_plan_thumbnail_media_id` or `nutrition_plan_thumbnail_media_id` in their metadata
3. Fetching the corresponding media post if the meta key exists
4. Returns `null` if no thumbnail is configured

Currently, training and nutrition plans may not have thumbnail meta keys defined in the database, so `imageUri` will be `null` for plans. This is expected behavior and the code is future-proof for when thumbnails are added.

This ensures the client gets the actual media URL, not just the media ID.

---

## 🧪 Testing

### Test File Location
`/tests/program.client.test.js`

### Running Tests
```bash
cd /home/ncode/projects/tr20/server
node tests/program.client.test.js
```

### Test Credentials
```javascript
{
  email: 'nikolaranisavljev994@gmail.com',
  password: 'password123'
}
```

### Test Coverage
1. ✅ User Login
2. ✅ Get All Assigned Programs
3. ✅ Get Single Program by ID
4. ✅ Missing Company ID Error Handling
5. ✅ Invalid Program ID Error Handling

---

## 📝 Implementation Notes

### Code Organization

The client program API is organized into separate modules for better maintainability:

#### Routes (`programRoutes.js`)
- Central route definitions for all program-related endpoints
- Routes delegate to specific controllers:
  - `/api/client/programs` → `programController.getPrograms`
  - `/api/client/programs/:id` → `programController.getProgramById`
  - `/api/client/programs/:id/training` → `trainingController.getTrainingPlanById`
  - `/api/client/programs/:id/nutrition` → `nutritionController.getNutritionPlanById`

#### Controllers
- **`programController.js`**: Handles program listing and single program retrieval
- **`trainingController.js`**: Handles training plan retrieval with full workout and exercise data
- **`nutritionController.js`**: Handles nutrition plan retrieval with full meal and recipe data

Each controller:
- Validates authentication and authorization
- Extracts and validates request parameters
- Verifies company access via `UserRelationship`
- Gets company database connection
- Calls appropriate service function
- Handles errors and formats responses

#### Services
- **`programService.js`**: 
  - `getClientAssignedPrograms()` - Fetches all programs for a client
  - `getClientProgramById()` - Fetches single program with metadata
  
- **`trainingService.js`**:
  - `getClientTrainingPlanById()` - Fetches complete training plan:
    - Extracts training plan ID from program metadata
    - Fetches training plan post and metadata
    - Fetches all workouts for the plan
    - For each workout, fetches associated exercises
    - Formats data using `formatDaysInTrainingPlans()`
    - Attaches media URIs

- **`nutritionService.js`**:
  - `getClientNutritionPlanById()` - Fetches complete nutrition plan:
    - Extracts nutrition plan ID from program metadata
    - Fetches nutrition plan post and metadata
    - Fetches all meals for the plan
    - For each meal, fetches associated recipes using `Meal.crud.read.methodLogic`
    - Formats data using `formatNutritionPlans()`
    - Attaches media URIs

### Database Architecture
- **Main DB (MySQL)**: Stores user-to-program assignments in `wp_usermeta` table
- **Company DB (SQLite)**: Stores actual program data in `wp_posts` and `wp_postmeta` tables
- **Post Types**:
  - `program`: Master template created by trainer (not accessible to clients)
  - `program_assigned`: Client-specific copy of program (accessible to assigned client)
  - `training_plan_assigned`: Client-specific training plan copy
  - `nutrition_plan_assigned`: Client-specific nutrition plan copy

### Training & Nutrition Plan Retrieval

Both training and nutrition plans are automatically retrieved based on program metadata:

1. **Program Metadata**: Each `program_assigned` post has metadata:
   - `training_plan_id`: ID of the assigned training plan
   - `nutrition_plan_id`: ID of the assigned nutrition plan

2. **Automatic Resolution**: The service functions:
   - Verify the program is assigned to the requesting client
   - Extract the plan ID from program metadata
   - Fetch the complete plan with all nested data (workouts/exercises or meals/recipes)
   - Return formatted response

3. **No Plan ID Required**: Since each program can only have one training plan and one nutrition plan, the plan ID doesn't need to be passed in the URL - it's automatically extracted from the program's metadata.

### Key Differences from Trainer API
- Trainers use Socket.IO events (`company:program:read`)
- Clients use REST API endpoints (`GET /api/client/programs`)
- Trainers see `program` post type (masters)
- Clients see `program_assigned` post type (copies)
- Trainers access via `post_author` field
- Clients access via `wp_usermeta` linkage

### Security Considerations
- **JWT Authentication**: All endpoints require valid JWT token
- **Company Isolation**: Each company has separate SQLite database
- **Assignment Verification**: Double-check via `wp_usermeta` table
- **Post Type Filtering**: Only `program_assigned` returned to clients
- **Trainer Context**: `post_author` contains trainer ID, not client ID
- **Plan Access Control**: Training and nutrition plans are only accessible through their parent program, ensuring clients can only access plans assigned to their programs

---

## 🔗 Related Documentation

- [Program Entity](../../03-entities/post-based/program/README.md) - Master program structure
- [Assigned Content](../../04-extending-for-clients/assigned-content.md) - Assignment flow
- [REST API Reference](../../05-api-reference/rest-endpoints.md) - All REST endpoints
- [Authentication](../../02-authentication/README.md) - Auth system overview

---

## 📌 Quick Example

### JavaScript/Axios
```javascript
const axios = require('axios');

// 1. Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'client@example.com',
  password: 'password123'
});
const token = loginResponse.data.token;

// 2. Get all programs
const programsResponse = await axios.get(
  'http://localhost:3000/api/client/programs?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(programsResponse.data);

// 3. Get single program
const programResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5845?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(programResponse.data);

// 4. Get training plan
const trainingPlanResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5845/training?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(trainingPlanResponse.data);

// 5. Get nutrition plan
const nutritionPlanResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5845/nutrition?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(nutritionPlanResponse.data);
```

### cURL
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get all programs
curl -X GET "http://localhost:3000/api/client/programs?companyId=1" \
  -H "Authorization: Bearer $TOKEN"

# 3. Get single program (plural route)
curl -X GET "http://localhost:3000/api/client/programs/5845?companyId=1" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get single program (singular route - alias)
curl -X GET "http://localhost:3000/api/client/program/5845?companyId=1" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get training plan
curl -X GET "http://localhost:3000/api/client/programs/5845/training?companyId=1" \
  -H "Authorization: Bearer $TOKEN"

# 6. Get nutrition plan
curl -X GET "http://localhost:3000/api/client/programs/5845/nutrition?companyId=1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Status

**Status**: ✅ Implemented and Tested  
**Version**: 1.0  
**Last Updated**: 2025-01-15

