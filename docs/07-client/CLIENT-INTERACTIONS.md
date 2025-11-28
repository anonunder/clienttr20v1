# Client Interactions System - User Progress Tracking, Favorites & Comments

**Version:** 2.0  
**Date:** November 17, 2025  
**Status:** ✅ Implemented for Client Use Only

---

## 📋 Overview

This document describes the NEW system for client interactions including:
1. **Workout Session Tracking** - Start/finish workouts, track exercises and sets
2. **Favorites System** - Mark any entity (workout, recipe, meal, program, etc.) as favorite
3. **Comments System** - Leave comments on workouts, recipes, meals, exercises, foods

**Key Principle:** Client-only features using existing WordPress-like database structure without breaking trainer functionality.

---

## 🎯 Features

### 1. Workout Session Tracking

Clients can:
- ✅ Start a workout session
- ✅ Track individual exercises within the session
- ✅ Record sets, reps, weight for each exercise
- ✅ Mark session as completed/abandoned
- ✅ View workout history
- ✅ Add notes and difficulty ratings

### 2. Favorites System

Clients can favorite:
- Workouts (`workout`, `training_plan_workout`)
- Meals (`meal`, `nutrition_plan_meal`)
- Recipes (`recipe`)
- Exercises (`exercise`)
- Foods (`food`)
- Programs (`program`, `program_assigned`)
- Training Plans (`training_plan`, `training_plan_assigned`)
- Nutrition Plans (`nutrition_plan`, `nutrition_plan_assigned`)

**✨ Automatic Integration**: When fetching workouts or meals, all exercises and recipes automatically include an `isFavorited: boolean` field, making it easy to display favorite status in your UI.

```json
{
  "workoutExercises": [
    {
      "term_id": 5604,
      "name": "Barbell Squat",
      "isFavorited": true,  // ← Automatically included
      "sets": [...]
    }
  ]
}
```

### 3. Comments System

Clients can comment on:
- Post-based entities: Workouts, Meals, Programs
- Term-based entities: Recipes, Exercises, Foods

---

## 🗄️ Database Structure

### Workout Sessions

Uses `wp_posts` table with new post type:

```sql
-- wp_posts
{
  id: 999,
  post_type: 'workout_session',
  post_parent: 567,                  -- Workout ID
  post_author: 105,                  -- Client ID
  post_status: 'in_progress',        -- or 'completed', 'abandoned'
  post_date: '2025-11-17 10:00:00', -- Start time
  post_modified: '2025-11-17 10:45:00' -- End time
}

-- wp_postmeta
{
  post_id: 999,
  meta_key: 'started_at',
  meta_value: '2025-11-17T10:00:00Z'
},
{
  post_id: 999,
  meta_key: 'finished_at',
  meta_value: '2025-11-17T10:45:00Z'
},
{
  post_id: 999,
  meta_key: 'duration_minutes',
  meta_value: '45'
},
{
  post_id: 999,
  meta_key: 'difficulty_rating',
  meta_value: '8'
},
{
  post_id: 999,
  meta_key: 'notes',
  meta_value: 'Great session!'
},
{
  post_id: 999,
  meta_key: 'exercises_completed',
  meta_value: JSON.stringify([
    {
      exercise_id: 123,
      exercise_name: "Barbell Squat",
      started_at: "2025-11-17T10:05:00Z",
      finished_at: "2025-11-17T10:15:00Z",
      sets: [
        { setNumber: 1, reps: 10, weight: 100, completed: true },
        { setNumber: 2, reps: 8, weight: 100, completed: true }
      ]
    }
  ])
}
```

### Favorites

Uses `wp_posts` for user favorites list + `wp_postmeta` for arrays:

```sql
-- One post per user storing ALL favorites
-- wp_posts
{
  id: 6001,
  post_type: 'user_favorites_list',
  post_author: 105,
  post_status: 'publish',
  post_title: 'User 105 Favorites'
}

-- wp_postmeta (one row per entity type)
{
  post_id: 6001,
  meta_key: 'favorite_workouts',
  meta_value: '[567, 568, 570]'  -- Array of workout IDs
},
{
  post_id: 6001,
  meta_key: 'favorite_recipes',
  meta_value: '[128, 130, 145]'  -- Array of recipe IDs
}
```

### Comments

Uses existing `comments` meta key in `wp_postmeta` (for posts) and `wp_termmeta` (for terms):

```sql
-- For workouts/meals/programs (wp_postmeta)
{
  post_id: 567,
  meta_key: 'comments',
  meta_value: JSON.stringify([
    {
      userId: 105,
      userName: "John Doe",
      userProfileImage: "https://...",
      date: "2025-11-17T10:00:00Z",
      comment: "Great workout!"
    }
  ])
}

-- For recipes/exercises/foods (wp_termmeta)
{
  term_id: 128,
  meta_key: 'comments',
  meta_value: JSON.stringify([...])
}
```

---

## 🔌 API Endpoints

### Workout Sessions

```
POST   /api/client/workout-sessions/start
PUT    /api/client/workout-sessions/:sessionId
GET    /api/client/workout-sessions
GET    /api/client/workout-sessions/:sessionId
DELETE /api/client/workout-sessions/:sessionId
```

### Favorites

```
POST   /api/client/favorites/:entityType/:entityId
GET    /api/client/favorites/:entityType
GET    /api/client/favorites
GET    /api/client/favorites/:entityType/:entityId/status
```

### Comments

```
POST   /api/client/comments/:entityType/:entityId
GET    /api/client/comments/:entityType/:entityId
```

---

## 📝 Usage Examples

### Start Workout Session

```bash
curl -X POST http://localhost:3000/api/client/workout-sessions/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "workoutId": 567,
    "companyId": 1
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 999,
    "post_title": "Upper Body Strength - Session",
    "post_parent": 567,
    "post_status": "in_progress",
    "post_date": "2025-11-17T10:00:00Z",
    "meta": [
      { "meta_key": "started_at", "meta_value": "2025-11-17T10:00:00Z" },
      { "meta_key": "exercises_completed", "meta_value": "[]" }
    ]
  }
}
```

### Update Workout Session (Finish)

```bash
curl -X PUT http://localhost:3000/api/client/workout-sessions/999 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "status": "completed",
    "finished_at": "2025-11-17T10:45:00Z",
    "duration_minutes": 45,
    "difficulty_rating": 8,
    "notes": "Great session!",
    "exercises_completed": [
      {
        "exercise_id": 123,
        "exercise_name": "Barbell Squat",
        "sets": [
          { "setNumber": 1, "reps": 10, "weight": 100, "completed": true },
          { "setNumber": 2, "reps": 8, "weight": 100, "completed": true }
        ]
      }
    ]
  }'
```

### Toggle Favorite

```bash
curl -X POST http://localhost:3000/api/client/favorites/workout/567 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "companyId": 1 }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true,
    "totalFavorites": 5
  }
}
```

### Get All Favorites

```bash
curl -X GET "http://localhost:3000/api/client/favorites?companyId=1" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workouts": [567, 568, 570],
    "recipes": [128, 130],
    "exercises": [45, 67],
    "meals": [],
    "foods": [],
    "programs": [34],
    "training_plans": [],
    "nutrition_plans": []
  }
}
```

### Check Favorite Status

```bash
curl -X GET "http://localhost:3000/api/client/favorites/exercise/5604/status?companyId=1" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true
  }
}
```

### Get Workout with Exercises (isFavorited included)

```bash
curl -X GET "http://localhost:3000/api/client/programs/5845/training/5900?companyId=1" \
  -H "Authorization: Bearer <token>"
```

**Response includes `isFavorited` for each exercise:**
```json
{
  "id": 5900,
  "title": "Upper Body Strength",
  "workoutExercises": [
    {
      "term_id": 5604,
      "name": "Barbell Squat",
      "isFavorited": true,
      "sets": [...]
    },
    {
      "term_id": 5605,
      "name": "Bench Press",
      "isFavorited": false,
      "sets": [...]
    }
  ]
}
```

### Add Comment

```bash
curl -X POST http://localhost:3000/api/client/comments/workout/567 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 1,
    "comment": "This workout is amazing!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 105,
    "userName": "John Doe",
    "userProfileImage": "https://...",
    "date": "2025-11-17T10:00:00Z",
    "comment": "This workout is amazing!"
  }
}
```

### Get Comments

```bash
curl -X GET "http://localhost:3000/api/client/comments/workout/567?companyId=1" \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": 105,
      "userName": "John Doe",
      "userProfileImage": "https://...",
      "date": "2025-11-17T10:00:00Z",
      "comment": "This workout is amazing!"
    },
    {
      "userId": 108,
      "userName": "Jane Smith",
      "userProfileImage": "https://...",
      "date": "2025-11-17T11:30:00Z",
      "comment": "I agree, loved it!"
    }
  ],
  "count": 2
}
```

---

## 📂 File Structure

```
src/
├── services/client/
│   ├── workoutSessionService.js    # Workout session business logic
│   ├── favoritesService.js         # Favorites management
│   └── commentsService.js          # Comments management
│
├── controllers/client/
│   ├── workoutSessionController.js # HTTP handlers for sessions
│   ├── favoritesController.js      # HTTP handlers for favorites
│   └── commentsController.js       # HTTP handlers for comments
│
└── routes/client/
    └── programRoutes.js            # All client routes (updated)
```

---

## 🔐 Security

All endpoints require:
1. ✅ JWT Authentication (`authenticated` middleware)
2. ✅ Company Access verification via `UserRelationship` table
3. ✅ User can only access their own sessions/favorites/comments

---

## ⚠️ Important Notes

### 1. No Trainer Functionality Affected

- ❌ No modifications to existing trainer CRUD operations
- ❌ No changes to existing post types used by trainers
- ✅ All new features are client-only

### 2. Clean Data Structure

- ✅ One `user_favorites_list` post per user (not hundreds of meta rows)
- ✅ One `workout_session` post per session
- ✅ Comments use existing pattern (JSON array in meta)

### 3. Scalability

- ✅ Favorites stored as JSON arrays (fast queries)
- ✅ Sessions indexed by user and workout
- ✅ Comments can be paginated if needed (future)

---

## 🚀 Future Enhancements

Potential additions:
- Pagination for comments
- Comment replies/threading
- Favorite collections/playlists
- Session analytics dashboard
- Export session history
- Social features (share workouts)

---

## 📊 Entity Type Mapping

| Client Entity | Database Storage | Meta Key for Favorites |
|---------------|------------------|------------------------|
| `workout` | wp_posts | `favorite_workouts` |
| `training_plan_workout` | wp_posts | `favorite_workouts` |
| `meal` | wp_posts | `favorite_meals` |
| `nutrition_plan_meal` | wp_posts | `favorite_meals` |
| `recipe` | wp_terms/wp_term_taxonomy | `favorite_recipes` |
| `exercise` | wp_terms/wp_term_taxonomy | `favorite_exercises` |
| `food` | wp_terms/wp_term_taxonomy | `favorite_foods` |
| `program` | wp_posts | `favorite_programs` |
| `program_assigned` | wp_posts | `favorite_programs` |
| `training_plan` | wp_posts | `favorite_training_plans` |
| `training_plan_assigned` | wp_posts | `favorite_training_plans` |
| `nutrition_plan` | wp_posts | `favorite_nutrition_plans` |
| `nutrition_plan_assigned` | wp_posts | `favorite_nutrition_plans` |

---

**Related Documentation:**
- [Client API Overview](./README.md)
- [Progress Tracking](../04-extending-for-clients/progress-tracking.md)
- [Architecture](../01-architecture/README.md)

