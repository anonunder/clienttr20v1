# Client API Documentation

## Overview

This directory contains comprehensive documentation for all client-facing REST API endpoints. These endpoints allow clients (end-users) to access their assigned programs, training plans, nutrition plans, and workouts.

---

## 📁 Directory Structure

```
07-client/
├── README.md                    # This file - Overview of client APIs
├── CLIENT-INTERACTIONS.md       # 🆕 Workout Sessions, Favorites, Comments
├── ISFAVORITED-FIELD.md        # 🆕 isFavorited field documentation
├── IMPLEMENTATION-SUMMARY.md    # Implementation overview
├── programs/
│   └── README.md               # Get all programs, get single program
├── trainings/
│   └── README.md               # Get training plan with workouts and exercises
├── nutrition/
│   └── README.md               # Get nutrition plan with meals and recipes
├── workouts/
│   └── README.md               # Get individual workouts with exercises
├── favorites/
│   └── README.md               # 🆕 Favorite exercises, recipes, and more
├── measurements/
│   └── README.md               # 🆕 Manual body measurements with images
├── reports/
│   └── README.md               # 🆕 Get and submit progress reports/questionnaires
└── dashboard/
    └── README.md               # 🆕 Complete dashboard overview and statistics
```

---

## 🔗 API Hierarchy

The client API follows a hierarchical structure:

```
Program (assigned to client)
├── Training Plan (optional)
│   └── Days
│       └── Workouts
│           └── Exercises
└── Nutrition Plan (optional)
    ├── Days (format: "days")
    │   └── Meals
    │       └── Recipes
    └── Meal Groups (format: "meals")
        └── Meals
            └── Recipes
```

---

## 📋 Available Endpoints

### Programs
**Base Route**: `/api/client/programs`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/programs` | Get all assigned programs | [programs/README.md](./programs/README.md) |
| GET | `/api/client/programs/:id` | Get single program by ID | [programs/README.md](./programs/README.md) |
| GET | `/api/client/program/:id` | Get single program (alias) | [programs/README.md](./programs/README.md) |

### Training Plans
**Base Route**: `/api/client/programs/:id/training`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/programs/:id/training` | Get complete training plan with workouts and exercises | [trainings/README.md](./trainings/README.md) |

### Nutrition Plans
**Base Route**: `/api/client/programs/:id/nutrition`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/programs/:id/nutrition` | Get complete nutrition plan with meals and recipes | [nutrition/README.md](./nutrition/README.md) |

### Workouts
**Base Route**: `/api/client/workouts`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/workouts/:id` | Get individual workout with exercises | [workouts/README.md](./workouts/README.md) |

### Workout Sessions 🆕
**Base Route**: `/api/client/workout-sessions`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| POST | `/api/client/workout-sessions/start` | Start a new workout session | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |
| PUT | `/api/client/workout-sessions/:sessionId` | Update session (complete exercise, finish) | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |
| GET | `/api/client/workout-sessions` | Get workout sessions with filters | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |
| GET | `/api/client/workout-sessions/:sessionId` | Get single session by ID | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |
| DELETE | `/api/client/workout-sessions/:sessionId` | Delete a workout session | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |

### Favorites 🆕
**Base Route**: `/api/client/favorites`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| POST | `/api/client/favorites/:entityType/:entityId` | Toggle favorite status | [favorites/README.md](./favorites/README.md) |
| GET | `/api/client/favorites/:entityType` | Get favorites for entity type (IDs only) | [favorites/README.md](./favorites/README.md) |
| GET | `/api/client/favorites` | Get all favorites grouped (IDs only) | [favorites/README.md](./favorites/README.md) |
| GET | `/api/client/favorites/detailed` | Get all favorites with full details & pagination | [favorites/README.md](./favorites/README.md) |
| GET | `/api/client/favorites/:entityType/:entityId/status` | Check if favorited | [favorites/README.md](./favorites/README.md) |

### Comments 🆕
**Base Route**: `/api/client/comments`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| POST | `/api/client/comments/:entityType/:entityId` | Add a comment | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |
| GET | `/api/client/comments/:entityType/:entityId` | Get comments for entity | [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md) |

### Measurements 🆕
**Base Route**: `/api/client/measurements`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/measurements/templates` | Get available measurement templates | [measurements/README.md](./measurements/README.md) |
| POST | `/api/client/measurements/submit` | Submit measurements with images | [measurements/README.md](./measurements/README.md) |
| GET | `/api/client/measurements/history` | Get measurement history | [measurements/README.md](./measurements/README.md) |
| GET | `/api/client/measurements/:measurementId` | Get single measurement | [measurements/README.md](./measurements/README.md) |
| GET | `/api/client/measurements/progress/:fieldName` | Get field progress over time | [measurements/README.md](./measurements/README.md) |

### Reports 🆕
**Base Route**: `/api/client/reports`

| Method | Endpoint | Description | Documentation |
|--------|----------|-------------|---------------|
| GET | `/api/client/reports/pending` | Get pending reports to fill | [reports/README.md](./reports/README.md) |
| GET | `/api/client/reports/completed` | Get completed reports history | [reports/README.md](./reports/README.md) |
| GET | `/api/client/reports/statistics` | Get report statistics | [reports/README.md](./reports/README.md) |
| GET | `/api/client/reports/:responseId` | Get specific report response | [reports/README.md](./reports/README.md) |
| POST | `/api/client/reports/:responseId/submit` | Submit report response | [reports/README.md](./reports/README.md) |

### Dashboard U0001F195
**Base Route**: `/api/client/dashboard`

|| Method | Endpoint | Description | Documentation |
||--------|----------|-------------|---------------|
|| GET | `/api/client/dashboard` | Get complete dashboard data | [dashboard/README.md](./dashboard/README.md) |
|| GET | `/api/client/dashboard/weekly` | Get weekly overview | [dashboard/README.md](./dashboard/README.md) |
|| GET | `/api/client/dashboard/programs` | Get active programs summary | [dashboard/README.md](./dashboard/README.md) |
|| GET | `/api/client/dashboard/workouts` | Get workout statistics | [dashboard/README.md](./dashboard/README.md) |
|| GET | `/api/client/dashboard/daily` | Get daily progress | [dashboard/README.md](./dashboard/README.md) |

---

## 🔐 Authentication & Authorization

All client endpoints require:

1. **JWT Authentication**: Valid Bearer token in the `Authorization` header
2. **Company Access**: User must be linked to the company (via `UserRelationship` table)
3. **Program Assignment**: Programs/plans must be assigned to the client (via `wp_usermeta` table)

### Authentication Flow

```bash
# 1. Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@example.com",
    "password": "password123"
  }'

# Response includes token:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}

# 2. Use token in subsequent requests
curl -X GET "http://localhost:3000/api/client/programs?companyId=1" \
  -H "Authorization: Bearer <token>"
```

---

## 📊 Data Relationships

### Program → Training Plan → Workouts → Exercises

```
wp_posts (program_assigned)
├── wp_postmeta (training_plan_id = X)
│
wp_posts (training_plan_assigned, id=X)
├── wp_posts (training_plan_workout)
│   ├── wp_postmeta (day = 1)
│   └── wp_term_taxonomy (workout_exercise)
│       └── wp_terms (exercise data)
│           └── wp_termmeta (sets, reps, weight, etc.)
```

### Program → Nutrition Plan → Meals → Recipes

```
wp_posts (program_assigned)
├── wp_postmeta (nutrition_plan_id = Y)
│
wp_posts (nutrition_plan_assigned, id=Y, post_mime_type='days')
├── wp_posts (nutrition_plan_meal)
│   ├── wp_postmeta (day = 1)
│   └── wp_term_taxonomy (meal_recipe)
│       └── wp_terms (recipe data)
│           └── wp_termmeta (portions, calories, macros, etc.)

OR

wp_posts (nutrition_plan_assigned, id=Y, post_mime_type='meals')
├── wp_postmeta (meal_group = "Breakfast Options")
└── wp_posts (nutrition_plan_meal)
    ├── wp_postmeta (meal_group_id = <meta_id>)
    └── wp_term_taxonomy (meal_recipe)
        └── wp_terms (recipe data)
            └── wp_termmeta (portions, calories, macros, etc.)
```

---

## 🎯 Common Patterns

### 1. Automatic ID Extraction

Training and nutrition plan IDs are **automatically extracted** from program metadata:
- No need to pass training/nutrition plan IDs in URLs
- The service extracts them from the program's `training_plan_id` and `nutrition_plan_id` metadata

### 2. Day-Based Organization

Both training and nutrition plans support day-based organization:
- Workouts/meals have a `day` meta key
- Response groups items by day number
- Days are sorted in ascending order

```json
{
  "trainingPlanDays": [
    { "dayNumber": 1, "trainingPlanDayWorkouts": [...] },
    { "dayNumber": 2, "trainingPlanDayWorkouts": [...] }
  ]
}
```

### 3. Taxonomy-Based Sub-Items

Both use WordPress taxonomies for nested items:
- Training: `workout_exercise` taxonomy links exercises to workouts
- Nutrition: `meal_recipe` taxonomy links recipes to meals
- Complete data fetched via associations and term metadata

### 4. Media Attachment

Images are stored as separate media posts:
- Referenced via metadata (e.g., `workout_thumbnail_media_id`)
- Service resolves media IDs to actual URIs
- Returns `imageUri` field with full path

---

## 🔄 Implementation Comparison

| Feature | Training Plans | Nutrition Plans |
|---------|---------------|-----------------|
| **Parent Type** | `training_plan_assigned` | `nutrition_plan_assigned` |
| **Child Type** | `training_plan_workout` | `nutrition_plan_meal` |
| **Sub-Items** | Exercises (`workout_exercise`) | Recipes (`meal_recipe`) |
| **Organization** | Days only | Days OR Meal Groups |
| **Format Field** | N/A | `post_mime_type` |
| **Day Meta** | `day` | `day` (for days format) |
| **Group Meta** | N/A | `meal_group_id` (for meals format) |
| **Formatter** | `formatDaysInTrainingPlans()` | `formatNutritionPlans()` |
| **Response Field** | `trainingPlanDays` | `nutritionPlanDays` or `nutritionPlanMealGroups` |

---

## 🧪 Testing

### Quick Test Script

```bash
#!/bin/bash

# Configuration
API_URL="http://localhost:3000"
EMAIL="client@example.com"
PASSWORD="password123"
COMPANY_ID=1
PROGRAM_ID=5845

# Login and get token
echo "=== Logging in ==="
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

echo "Token: $TOKEN"

# Get all programs
echo -e "\n=== Getting all programs ==="
curl -s -X GET "$API_URL/api/client/programs?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get single program
echo -e "\n=== Getting program $PROGRAM_ID ==="
curl -s -X GET "$API_URL/api/client/programs/$PROGRAM_ID?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get training plan
echo -e "\n=== Getting training plan for program $PROGRAM_ID ==="
curl -s -X GET "$API_URL/api/client/programs/$PROGRAM_ID/training?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get nutrition plan
echo -e "\n=== Getting nutrition plan for program $PROGRAM_ID ==="
curl -s -X GET "$API_URL/api/client/programs/$PROGRAM_ID/nutrition?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📝 Development Notes

### Key Differences from Trainer API

| Aspect | Trainer API | Client API |
|--------|------------|-----------|
| **Protocol** | Socket.IO | REST API |
| **Post Types** | `program`, `training_plan`, `nutrition_plan` (masters) | `program_assigned`, `training_plan_assigned`, `nutrition_plan_assigned` |
| **Access Filter** | `post_author = trainer_id` | `wp_usermeta.meta_key = 'program_id'` |
| **Database** | Company SQLite only | Main MySQL + Company SQLite |
| **Authentication** | Socket handshake | JWT Bearer token |

### Security Considerations

1. **Multi-Tenant Isolation**: Each company has a separate SQLite database
2. **Assignment Verification**: Double-check via main database `wp_usermeta` table
3. **Post Type Filtering**: Only `*_assigned` types returned to clients
4. **No Author Filter**: Clients access content created by trainers (different authors)
5. **Plan Access Control**: Plans only accessible through parent program

### Performance Optimization

1. **Eager Loading**: All associations loaded in single query
2. **Separate Queries**: Metadata loaded separately for better performance
3. **Order Optimization**: Results sorted by `menu_order` and day number
4. **Media Resolution**: Media URIs fetched only when needed

---

## 🔗 Related Documentation

- [**Client Interactions (NEW)**](./CLIENT-INTERACTIONS.md) - Workout Sessions, Favorites, Comments
- [**isFavorited Field**](./ISFAVORITED-FIELD.md) - Automatic favorite status in exercises & recipes
- [**Implementation Summary**](./IMPLEMENTATION-SUMMARY.md) - System overview
- [Authentication System](../02-authentication/README.md)
- [Entity Definitions](../03-entities/README.md)
- [Assigned Content Flow](../04-extending-for-clients/assigned-content.md)
- [API Reference](../05-api-reference/README.md)

---

## ✅ Implementation Status

| Module | Status | Version | Last Updated |
|--------|--------|---------|--------------|
| Programs | ✅ Complete | 1.0 | 2025-01-15 |
| Training Plans | ✅ Complete | 1.0 | 2025-01-15 |
| Nutrition Plans | ✅ Complete | 1.0 | 2025-11-09 |
| Workouts | ✅ Complete | 1.0 | 2025-01-10 |
| **Workout Sessions** | ✅ Complete | 2.0 | 2025-11-17 |
| **Favorites** | ✅ Complete | 2.0 | 2025-11-17 |
| **Comments** | ✅ Complete | 2.0 | 2025-11-17 |
| **Measurements** | ✅ Complete | 1.0 | 2025-11-27 |
| **Reports** | ✅ Complete | 1.0 | 2025-11-18 |

---

## 📌 Quick Reference

### New Features (v2.0) 🆕

**Workout Sessions:**
- Track workout progress in real-time
- Log exercises, sets, reps, weight
- View workout history and analytics

**Favorites:**
- Mark any entity as favorite (workouts, recipes, exercises, etc.)
- **Auto-included**: All exercises and recipes include `isFavorited` field
- No separate API call needed to check favorite status

**Comments:**
- Leave comments on workouts, recipes, exercises
- View all comments with user info

**📖 Full Documentation**: [CLIENT-INTERACTIONS.md](./CLIENT-INTERACTIONS.md)

---

### Response Structure Examples

**Program:**
```json
{
  "id": 5845,
  "title": "Weight Loss Program",
  "hasTrainingPlan": true,
  "hasNutritionPlan": true,
  "trainingPlanId": "456",
  "nutritionPlanId": "789"
}
```

**Training Plan:**
```json
{
  "id": 456,
  "post_title": "8-Week Training",
  "trainingPlanDays": [
    {
      "dayNumber": 1,
      "trainingPlanDayWorkouts": [
        {
          "id": 100,
          "post_title": "Upper Body",
          "workoutExercises": [
            {
              "term_id": 5604,
              "name": "Barbell Squat",
              "isFavorited": true,
              "sets": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

**Nutrition Plan (Days Format):**
```json
{
  "id": 789,
  "post_title": "Meal Plan",
  "post_mime_type": "days",
  "nutritionPlanDays": [
    {
      "dayNumber": 1,
      "nutritionPlanDayMeals": [
        {
          "id": 100,
          "post_title": "Breakfast",
          "mealRecipes": [
            {
              "term_id": 128,
              "name": "Protein Pancakes",
              "isFavorited": false,
              "portions": 1
            }
          ]
        }
      ]
    }
  ]
}
```

**Nutrition Plan (Meals Format):**
```json
{
  "id": 789,
  "post_title": "Flexible Meal Plan",
  "post_mime_type": "meals",
  "nutritionPlanMealGroups": [
    {
      "mealGroupName": "Breakfast Options",
      "nutritionPlanGroupMeals": [
        {
          "id": 100,
          "post_title": "Protein Breakfast",
          "mealRecipes": [...]
        }
      ]
    }
  ]
}
```

