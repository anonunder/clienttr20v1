# Client Workout Endpoints Documentation

## Overview

This document describes the new workout-specific endpoints for clients to access individual workouts and exercises within their assigned training plans.

## Endpoints

### 1. Get Workout with Exercises

**Endpoint**: `GET /api/client/programs/:programId/training/:workoutId`

**Description**: Fetch a specific workout with all its exercises for a training plan assigned to the authenticated client.

**Authentication**: Required (JWT Token)

**Parameters**:
- `programId` (path) - The ID of the assigned program
- `workoutId` (path) - The ID of the workout (training_plan_workout post)
- `companyId` (query) - The company ID (required)

**Example Request**:
```bash
GET http://localhost:3000/api/client/programs/24/training/26?companyId=1
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 26,
    "title": "Workout in Training Plan Template",
    "description": "Detailed workout description",
    "imageUri": "https://example.com/workout-thumbnail.jpg",
    "demoMediaUrls": [
      "https://example.com/demo-video-1.mp4",
      "https://example.com/demo-video-2.mp4"
    ],
    "day": "1",
    "menuOrder": 1,
    "duration": "45",
    "workoutExercises": [
      {
        "term_taxonomy_id": 75,
        "name": "Bench Press",
        "taxonomy": "workout_exercise",
        "description": "Exercise instructions",
        "termMeta": [
          {
            "meta_key": "sets",
            "meta_value": "[{\"reps\":10,\"weight\":80,\"rest\":60}]"
          },
          {
            "meta_key": "exercise_thumbnail_media_id",
            "meta_value": "3"
          }
        ],
        "imageUri": "https://example.com/exercise-thumbnail.jpg",
        "demoMedia": [
          {
            "id": 4,
            "post_content": "https://example.com/exercise-demo.mp4"
          }
        ],
        "alternativeExercises": [],
        "isFavorited": false
      }
    ],
    "meta": [
      {
        "meta_key": "day",
        "meta_value": "1"
      },
      {
        "meta_key": "workout_thumbnail_media_id",
        "meta_value": "3"
      },
      {
        "meta_key": "demo_media_id",
        "meta_value": "3"
      },
      {
        "meta_key": "demo_media_id",
        "meta_value": "4"
      }
    ],
    "createdAt": "2025-01-28 14:30:00",
    "updatedAt": "2025-01-28 14:30:00",
    "trainingPlanId": 25,
    "programId": 24
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing or invalid parameters
- `403 Forbidden` - User not authorized for this company
- `404 Not Found` - Program not found, not assigned to client, or workout doesn't belong to training plan
- `500 Internal Server Error` - Server error

---

### 2. Get Specific Exercise in Workout

**Endpoint**: `GET /api/client/programs/:programId/training/:workoutId/exercise/:exerciseId`

**Description**: Fetch a specific exercise within a workout, including its sets, reps, media, and alternative exercises.

**Authentication**: Required (JWT Token)

**Parameters**:
- `programId` (path) - The ID of the assigned program
- `workoutId` (path) - The ID of the workout
- `exerciseId` (path) - The term_taxonomy_id of the workout_exercise
- `companyId` (query) - The company ID (required)

**Example Request**:
```bash
GET http://localhost:3000/api/client/programs/24/training/26/exercise/75?companyId=1
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "term_taxonomy_id": 75,
    "name": "Bench Press",
    "taxonomy": "workout_exercise",
    "description": "Compound upper body exercise targeting chest, shoulders, and triceps",
    "parent": null,
    "author": 1,
    "post_parent": 26,
    "termMeta": [
      {
        "meta_key": "sets",
        "meta_value": "[{\"reps\":10,\"weight\":80,\"rest\":60},{\"reps\":8,\"weight\":85,\"rest\":90},{\"reps\":6,\"weight\":90,\"rest\":120}]"
      },
      {
        "meta_key": "instructions",
        "meta_value": "Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up"
      },
      {
        "meta_key": "exercise_thumbnail_media_id",
        "meta_value": "3"
      },
      {
        "meta_key": "demo_media_id",
        "meta_value": "4"
      },
      {
        "meta_key": "demo_media_id",
        "meta_value": "22"
      },
      {
        "meta_key": "content",
        "meta_value": "Primary chest builder"
      },
      {
        "meta_key": "source_exercise_term_taxonomy_id",
        "meta_value": "38"
      }
    ],
    "imageUri": "https://example.com/bench-press-thumbnail.jpg",
    "demoMedia": [
      {
        "id": 4,
        "post_content": "https://example.com/bench-press-demo.mp4"
      },
      {
        "id": 22,
        "post_content": "https://example.com/bench-press-tutorial.mp4"
      }
    ],
    "alternativeExercises": [
      {
        "term_taxonomy_id": 76,
        "name": "Dumbbell Press",
        "taxonomy": "alternative_exercise",
        "termMeta": [
          {
            "meta_key": "sets",
            "meta_value": "[{\"reps\":10,\"weight\":35,\"rest\":60}]"
          }
        ],
        "imageUri": "https://example.com/dumbbell-press.jpg"
      }
    ],
    "isFavorited": true,
    "workoutId": 26,
    "programId": 24,
    "trainingPlanId": 25
  }
}
```

**Error Responses**:
- `400 Bad Request` - Missing or invalid parameters
- `403 Forbidden` - User not authorized for this company
- `404 Not Found` - Program, workout, or exercise not found or doesn't belong to the workout
- `500 Internal Server Error` - Server error

---

## Database Structure

### Workout Structure
- **Table**: `wp_posts`
- **Post Type**: `training_plan_workout`
- **Relationship**: `post_parent` points to training plan ID

### Exercise Structure
- **Table**: `wp_term_taxonomy`
- **Taxonomy**: `workout_exercise`
- **Relationship**: `post_parent` points to workout ID (training_plan_workout)
- **Metadata**: Stored in `wp_termmeta` with keys like `sets`, `reps`, `rest`, `weight`, `instructions`
- **Favorites**: `isFavorited` boolean field is automatically included to indicate if the current user has favorited this exercise

### Alternative Exercises
- **Table**: `wp_term_taxonomy`
- **Taxonomy**: `alternative_exercise`
- **Relationship**: `parent` points to workout_exercise term_taxonomy_id

### Media References
- **Workout Media**: `workout_thumbnail_media_id`, `demo_media_id`
- **Exercise Media**: `exercise_thumbnail_media_id`, `demo_media_id`
- Media posts are fetched from `wp_posts` where `post_type = 'media'`

---

## Security & Authorization

All endpoints verify:
1. ✅ **Authentication**: User must be logged in (JWT token)
2. ✅ **Company Access**: User must have relationship with the company
3. ✅ **Program Assignment**: Program must be assigned to the user (checked via `wp_usermeta` in main DB)
4. ✅ **Workout Ownership**: Workout must belong to the training plan within the assigned program
5. ✅ **Exercise Ownership**: Exercise must belong to the workout

### Authorization Flow
```
User Request
  ↓
Verify JWT Token
  ↓
Verify Company Access (UserRelationship)
  ↓
Verify Program Assignment (wp_usermeta: program_id)
  ↓
Verify Workout belongs to Training Plan
  ↓
Return Data
```

---

## Implementation Details

### Files Created/Modified

1. **Service Layer**:
   - `/src/services/client/workoutService.js`
     - `getClientWorkoutById()` - Fetches workout with exercises
     - `getClientWorkoutExerciseById()` - Fetches specific exercise

2. **Controller Layer**:
   - `/src/controllers/client/workoutController.js`
     - `getWorkoutById()` - HTTP handler for workout endpoint
     - `getWorkoutExerciseById()` - HTTP handler for exercise endpoint

3. **Routes**:
   - `/src/routes/client/programRoutes.js` - Updated to include workout routes

### Key Features

✅ **Complete Exercise Data**: Includes sets, reps, weight, rest periods, instructions
✅ **Media Support**: Fetches thumbnails and demo videos for workouts and exercises
✅ **Alternative Exercises**: Returns alternative exercises for each workout exercise
✅ **Metadata**: Returns all custom metadata for workouts and exercises
✅ **Favorites Support**: Each exercise includes an `isFavorited` boolean field indicating if the current user has favorited it
✅ **Security**: Multi-layer authorization checks
✅ **Error Handling**: Comprehensive error messages and HTTP status codes

---

## Usage Examples

### Example 1: Fetch Workout Details
```javascript
// Frontend (React Native / Expo)
const fetchWorkout = async (programId, workoutId, companyId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/client/programs/${programId}/training/${workoutId}?companyId=${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    if (data.success) {
      console.log('Workout:', data.data);
      console.log('Exercises:', data.data.workoutExercises);
    }
  } catch (error) {
    console.error('Error fetching workout:', error);
  }
};
```

### Example 2: Fetch Specific Exercise
```javascript
const fetchExercise = async (programId, workoutId, exerciseId, companyId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/client/programs/${programId}/training/${workoutId}/exercise/${exerciseId}?companyId=${companyId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    if (data.success) {
      console.log('Exercise:', data.data);
      console.log('Sets:', JSON.parse(data.data.termMeta.find(m => m.meta_key === 'sets').meta_value));
      console.log('Alternative Exercises:', data.data.alternativeExercises);
    }
  } catch (error) {
    console.error('Error fetching exercise:', error);
  }
};
```

---

## Testing

### Test Workout Endpoint
```bash
curl -X GET "http://localhost:3000/api/client/programs/24/training/26?companyId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test Exercise Endpoint
```bash
curl -X GET "http://localhost:3000/api/client/programs/24/training/26/exercise/75?companyId=1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes

- **Exercise Order**: Exercises are returned in the order they were added (based on `meta_id` in `wp_termmeta`)
- **Media**: Multiple demo media can exist for both workouts and exercises (multiple `demo_media_id` entries)
- **Alternative Exercises**: Each workout exercise can have multiple alternatives
- **Sets Format**: Sets are stored as JSON arrays with `reps`, `weight`, `rest` properties
- **No Author Filter**: Clients can see exercises created by trainers (no author filter on workout_exercise)

---

## Future Enhancements

- [ ] Add workout progress tracking (completed sets, actual weights lifted)
- [ ] Add exercise substitution functionality
- [ ] Add workout notes/comments from client
- [ ] Add exercise performance history
- [ ] Add real-time updates via Socket.IO
- [ ] Add workout timer integration
- [ ] Add rest period countdown

---

## Related Documentation

- [Training Plan Endpoints](../README.md)
- [Program Endpoints](../../README.md)
- [Client Interactions - Favorites](../../CLIENT-INTERACTIONS.md#favorites-system)
- [Entity Meta Keys](../../../../ENTITY-META-KEYS.md)

