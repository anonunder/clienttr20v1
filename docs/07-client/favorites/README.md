# Client Favorites API Documentation

**Version:** 2.0  
**Date:** November 27, 2025  
**Status:** ✅ Fully Implemented

---

## 📋 Overview

This module provides REST API endpoints for clients to manage their favorite entities. Clients can mark exercises, recipes, workouts, meals, programs, and other entities as favorites for quick access and personalized organization.

**Key Features:**
- ✅ Toggle favorite status for any entity
- ✅ View favorites by entity type (exercises, recipes, etc.)
- ✅ View all favorites grouped by type (IDs only)
- ✅ **View detailed favorites with full entity data & pagination**
- ✅ Check favorite status for specific entities
- ✅ **Auto-included `isFavorited` field** in workout and meal responses
- ✅ **Automatic media resolution** (thumbnails, videos)
- ✅ Efficient storage using JSON arrays
- ✅ One favorites list per client (clean data structure)

---

## 🗄️ Database Structure

### User Favorites List (`user_favorites_list`)

Each client has one post storing all their favorites.

```sql
wp_posts
├── id: Favorites List ID
├── post_type: 'user_favorites_list'
├── post_author: Client ID
├── post_status: 'publish'
└── post_title: 'User {client_id} Favorites'

wp_postmeta (one row per entity type)
├── meta_key: 'favorite_exercises', meta_value: '[5604, 5605, 5610]'
├── meta_key: 'favorite_recipes', meta_value: '[128, 130, 145]'
├── meta_key: 'favorite_workouts', meta_value: '[567, 568, 570]'
├── meta_key: 'favorite_meals', meta_value: '[100, 101]'
├── meta_key: 'favorite_foods', meta_value: '[89, 92]'
├── meta_key: 'favorite_programs', meta_value: '[5845]'
├── meta_key: 'favorite_training_plans', meta_value: '[456]'
└── meta_key: 'favorite_nutrition_plans', meta_value: '[789]'
```

**Meta Key Structure:**
```json
{
  "favorite_exercises": [5604, 5605, 5610],
  "favorite_recipes": [128, 130, 145],
  "favorite_workouts": [567, 568, 570],
  "favorite_meals": [100, 101],
  "favorite_foods": [89, 92],
  "favorite_programs": [5845],
  "favorite_training_plans": [456],
  "favorite_nutrition_plans": [789]
}
```

---

## 🎯 How It Works

### Flow Diagram

```
Client views exercise/recipe
   ↓
Client taps favorite button
   ↓
API checks if user_favorites_list exists
   ↓
If not exists: Create new list post
   ↓
Get current favorites array for entity type
   ↓
Toggle: Add ID if not present, Remove if present
   ↓
Update metadata with new array
   ↓
Return updated favorite status
```

### Automatic Integration

When fetching workouts or meals, all exercises and recipes **automatically include** an `isFavorited` field:

```json
{
  "workoutExercises": [
    {
      "term_id": 5604,
      "name": "Barbell Squat",
      "isFavorited": true,  // ← Automatically included!
      "sets": [...]
    }
  ]
}
```

**No separate API call needed** to check favorite status when viewing workouts/meals!

---

## 📡 API Endpoints

### Base Route
```
/api/client/favorites
```

All endpoints require:
- **Authentication**: JWT Bearer token
- **Query Parameter**: `companyId` (required)

### Endpoint Summary

| Method | Endpoint | Description | Returns |
|--------|----------|-------------|---------|
| POST | `/favorites/:entityType/:entityId` | Toggle favorite status | Favorite status |
| GET | `/favorites/:entityType` | Get favorites by type | Array of IDs |
| GET | `/favorites` | Get all favorites | Object with ID arrays |
| GET | `/favorites/detailed` | Get detailed favorites | Full entity data |
| GET | `/favorites/:entityType/:entityId/status` | Check favorite status | Boolean status |

---

### 1. Toggle Favorite

Add or remove an entity from favorites.

```http
POST /api/client/favorites/:entityType/:entityId
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | string | Yes | Type of entity (see Entity Types table) |
| `entityId` | number | Yes | Entity ID |

**Request Body:**
```json
{
  "companyId": 1
}
```

**Entity Types:**
| Entity Type | Database Storage | Meta Key |
|-------------|------------------|----------|
| `exercise` | wp_terms | `favorite_exercises` |
| `recipe` | wp_terms | `favorite_recipes` |
| `food` | wp_terms | `favorite_foods` |
| `workout` | wp_posts | `favorite_workouts` |
| `training_plan_workout` | wp_posts | `favorite_workouts` |
| `meal` | wp_posts | `favorite_meals` |
| `nutrition_plan_meal` | wp_posts | `favorite_meals` |
| `program` | wp_posts | `favorite_programs` |
| `program_assigned` | wp_posts | `favorite_programs` |
| `training_plan` | wp_posts | `favorite_training_plans` |
| `training_plan_assigned` | wp_posts | `favorite_training_plans` |
| `nutrition_plan` | wp_posts | `favorite_nutrition_plans` |
| `nutrition_plan_assigned` | wp_posts | `favorite_nutrition_plans` |

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

**Status Codes:**
- `200` - Success (toggled)
- `400` - Invalid entityType or entityId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 2. Get Favorites by Type

Get all favorites for a specific entity type.

```http
GET /api/client/favorites/:entityType?companyId={companyId}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | string | Yes | Type of entity (exercise, recipe, etc.) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": [5604, 5605, 5610],
  "count": 3
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId or invalid entityType
- `403` - Unauthorized for this company
- `500` - Server error

---

### 3. Get All Favorites (Grouped)

Get all favorites grouped by entity type (IDs only).

```http
GET /api/client/favorites?companyId={companyId}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "exercises": [5604, 5605, 5610],
    "recipes": [128, 130, 145],
    "workouts": [567, 568, 570],
    "meals": [100, 101],
    "foods": [89, 92],
    "programs": [5845],
    "training_plans": [456],
    "nutrition_plans": [789]
  },
  "totalFavorites": 18
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 4. Get All Favorites (Detailed with Pagination) 🆕

Get all favorites with full entity details and pagination support. This endpoint fetches complete information for each favorited entity, including:
- **Exercises**: name, description, duration, difficulty, equipment, muscle groups, **thumbnail & video URLs**, **relationship IDs + names** (workoutId, workoutName, trainingPlanId, trainingPlanName, programId, programName from first usage)
- **Recipes**: name, description, portions, calories, macros, prep/cook time, ingredients, **thumbnail URLs**, **relationship IDs + names** (mealId, mealName, nutritionPlanId, nutritionPlanName, programId, programName from first usage)
- **Workouts**: name, description, type, day, duration, difficulty, thumbnail, **relationship IDs + names** (workoutId, workoutName, trainingPlanId, trainingPlanName, programId, programName)
- **Meals**: name, description, type, day, meal type, calories, **relationship IDs + names** (mealId, mealName, nutritionPlanId, nutritionPlanName, programId, programName)
- **Foods**: name, description, calories, macros, serving size, **relationship IDs + names** (all null for library entities)
- **Programs**: name, description, type, duration, level, thumbnail, **relationship IDs + names** (programId, programName, trainingPlanId, nutritionPlanId)
- **Training Plans**: name, description, type, duration, level, days per week, **relationship IDs + names** (trainingPlanId, trainingPlanName, programId)
- **Nutrition Plans**: name, description, type, format, calorie/macro targets, **relationship IDs + names** (nutritionPlanId, nutritionPlanName, programId)

**Important Notes:**
- **All IDs are integers**, not strings
- **Includes both IDs and names** for related entities (e.g., `workoutId` + `workoutName`)
- For library entities (exercises, recipes, foods), relationship IDs show where they're first used (if used at all)
- If an exercise/recipe isn't used in any workout/meal, relationship IDs will be `null`

```http
GET /api/client/favorites/detailed?companyId={companyId}&limit={limit}&offset={offset}&entityType={entityType}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |
| `limit` | number | No | Number of items per entity type (default: 50) |
| `offset` | number | No | Pagination offset (default: 0) |
| `entityType` | string | No | Filter by specific entity type (exercises, recipes, workouts, meals, foods, programs, training_plans, nutrition_plans) |

**Note:** Media URLs (thumbnails, videos) are automatically resolved from media post IDs stored in metadata.

**Response (All Entity Types):**
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": 5604,
        "name": "Barbell Squat",
        "description": "Compound lower body exercise",
        "duration": 120,
        "difficulty": "intermediate",
        "equipment": ["barbell", "squat rack"],
        "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
        "thumbnailUrl": "/storage/company-1/exercises/squat.jpg",
        "videoUrl": "/storage/company-1/exercises/squat.mp4",
        "instructions": "Step by step instructions...",
        "workoutId": 567,
        "workoutName": "Upper Body Strength",
        "mealId": null,
        "mealName": null,
        "trainingPlanId": 456,
        "trainingPlanName": "Strength Building Plan",
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "recipes": [
      {
        "id": 7340,
        "name": "Protein Pancakes",
        "description": "High protein breakfast",
        "portions": 2,
        "calories": 350,
        "protein": 35,
        "carbs": 40,
        "fat": 8,
        "prepTime": 5,
        "cookTime": 10,
        "ingredients": ["eggs", "protein powder", "banana"],
        "instructions": "Mix and cook...",
        "thumbnailUrl": "/storage/company-1/recipes/pancakes.jpg",
        "mealId": 100,
        "mealName": "Breakfast - High Protein",
        "workoutId": null,
        "workoutName": null,
        "nutritionPlanId": 789,
        "nutritionPlanName": "Balanced Meal Plan",
        "trainingPlanId": null,
        "trainingPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "workouts": [
      {
        "id": 567,
        "name": "Upper Body Strength",
        "description": "Focus on chest, back, and shoulders",
        "type": "training_plan_workout",
        "day": 1,
        "duration": 60,
        "difficulty": "intermediate",
        "thumbnailUrl": "/storage/company-1/workouts/upper.jpg",
        "workoutId": 567,
        "workoutName": "Upper Body Strength",
        "mealId": null,
        "mealName": null,
        "trainingPlanId": 456,
        "trainingPlanName": "Strength Building Plan",
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "meals": [
      {
        "id": 100,
        "name": "Breakfast - High Protein",
        "description": "Morning meal to start your day",
        "type": "nutrition_plan_meal",
        "day": 1,
        "mealType": "breakfast",
        "calories": 450,
        "mealId": 100,
        "mealName": "Breakfast - High Protein",
        "workoutId": null,
        "workoutName": null,
        "nutritionPlanId": 789,
        "nutritionPlanName": "Balanced Meal Plan",
        "trainingPlanId": null,
        "trainingPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "foods": [
      {
        "id": 89,
        "name": "Chicken Breast",
        "description": "Lean protein source",
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "servingSize": 100,
        "unit": "g",
        "recipeId": null,
        "recipeName": null,
        "mealId": null,
        "mealName": null,
        "workoutId": null,
        "workoutName": null,
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "trainingPlanId": null,
        "trainingPlanName": null,
        "programId": null,
        "programName": null,
        "isFavorited": true
      }
    ],
    "programs": [
      {
        "id": 5845,
        "name": "8-Week Transformation",
        "description": "Complete program for weight loss",
        "type": "program_assigned",
        "duration": 56,
        "level": "intermediate",
        "thumbnailUrl": "/storage/company-1/programs/transform.jpg",
        "programId": 5845,
        "programName": "8-Week Transformation",
        "trainingPlanId": 456,
        "trainingPlanName": null,
        "nutritionPlanId": 789,
        "nutritionPlanName": null,
        "workoutId": null,
        "workoutName": null,
        "mealId": null,
        "mealName": null,
        "isFavorited": true
      }
    ],
    "training_plans": [
      {
        "id": 456,
        "name": "Strength Building Plan",
        "description": "4-week progressive overload",
        "type": "training_plan_assigned",
        "duration": 28,
        "level": "advanced",
        "daysPerWeek": 4,
        "trainingPlanId": 456,
        "trainingPlanName": "Strength Building Plan",
        "programId": 5845,
        "programName": null,
        "workoutId": null,
        "workoutName": null,
        "mealId": null,
        "mealName": null,
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "isFavorited": true
      }
    ],
    "nutrition_plans": [
      {
        "id": 789,
        "name": "Balanced Meal Plan",
        "description": "2000 calorie daily plan",
        "type": "nutrition_plan_assigned",
        "format": "days",
        "caloriesTarget": 2000,
        "proteinTarget": 150,
        "carbsTarget": 200,
        "fatTarget": 67,
        "nutritionPlanId": 789,
        "nutritionPlanName": "Balanced Meal Plan",
        "programId": 5845,
        "programName": null,
        "mealId": null,
        "mealName": null,
        "workoutId": null,
        "workoutName": null,
        "trainingPlanId": null,
        "trainingPlanName": null,
        "isFavorited": true
      }
    ]
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalCounts": {
      "workouts": 3,
      "meals": 2,
      "recipes": 5,
      "exercises": 17,
      "foods": 1,
      "programs": 1,
      "training_plans": 1,
      "nutrition_plans": 1
    }
  }
}
```

**Response (Filtered by Entity Type):**
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": 5604,
        "name": "Barbell Squat",
        "description": "Compound lower body exercise",
        "duration": 120,
        "difficulty": "intermediate",
        "equipment": ["barbell", "squat rack"],
        "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
        "thumbnailUrl": "/storage/company-1/exercises/squat.jpg",
        "videoUrl": "/storage/company-1/exercises/squat.mp4",
        "instructions": "Step by step instructions...",
        "workoutId": 567,
        "workoutName": "Upper Body Strength",
        "mealId": null,
        "mealName": null,
        "trainingPlanId": 456,
        "trainingPlanName": "Strength Building Plan",
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "recipes": [],
    "workouts": [],
    "meals": [],
    "foods": [],
    "programs": [],
    "training_plans": [],
    "nutrition_plans": []
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "totalCounts": {
      "workouts": 0,
      "meals": 0,
      "recipes": 0,
      "exercises": 17,
      "foods": 0,
      "programs": 0,
      "training_plans": 0,
      "nutrition_plans": 0
    }
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 5. Check Favorite Status

Check if a specific entity is favorited.

```http
GET /api/client/favorites/:entityType/:entityId/status?companyId={companyId}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entityType` | string | Yes | Type of entity |
| `entityId` | number | Yes | Entity ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID |

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing parameters or invalid entityType
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

### 3. Favorites Ownership Validation
- Favorites list must have `post_author = client_user_id`
- Client can only view/modify their own favorites
- No access to other clients' favorites

### 4. Multi-Tenant Isolation
- Each company has separate SQLite database
- No data leakage between companies
- Database selected via `CompaniesDbManager.getCompanyDB(companyId)`

---

## 💡 Usage Examples

### Example 1: Favorite an Exercise

**Scenario:** Client loves "Barbell Squat" and wants to favorite it.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const exerciseId = 5604;

const response = await axios.post(
  `http://localhost:3000/api/client/favorites/exercise/${exerciseId}`,
  { companyId },
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log(`Exercise favorited: ${response.data.data.isFavorited}`);
console.log(`Total favorites: ${response.data.data.totalFavorites}`);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true,
    "totalFavorites": 1
  }
}
```

---

### Example 2: Favorite a Recipe

**Scenario:** Client finds a delicious recipe and wants to save it.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const recipeId = 128;

const response = await axios.post(
  `http://localhost:3000/api/client/favorites/recipe/${recipeId}`,
  { companyId },
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

console.log(`Recipe favorited: ${response.data.data.isFavorited}`);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isFavorited": true,
    "totalFavorites": 1
  }
}
```

---

### Example 3: Get All Favorite Exercises

**Scenario:** Display all favorite exercises in the client's profile.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/exercise?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`Favorite exercises: ${response.data.count}`);
console.log('IDs:', response.data.data);
```

**Response:**
```json
{
  "success": true,
  "data": [5604, 5605, 5610],
  "count": 3
}
```

---

### Example 4: Get All Favorite Recipes

**Scenario:** Show favorite recipes in the nutrition section.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/recipe?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`Favorite recipes: ${response.data.count}`);
console.log('Recipe IDs:', response.data.data);
```

**Response:**
```json
{
  "success": true,
  "data": [128, 130, 145],
  "count": 3
}
```

---

### Example 5: Get All Favorites with Full Details (Paginated)

**Scenario:** Display a complete favorites page with all entity details.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/detailed?companyId=${companyId}&limit=10&offset=0`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const favorites = response.data.data;
const pagination = response.data.pagination;

console.log(`Total exercises: ${pagination.totalCounts.exercises}`);
console.log(`Total recipes: ${pagination.totalCounts.recipes}`);

// Display exercises with full details
favorites.exercises.forEach(exercise => {
  console.log(`\n${exercise.name}`);
  console.log(`Duration: ${exercise.duration}s`);
  console.log(`Difficulty: ${exercise.difficulty}`);
  console.log(`Muscle Groups: ${exercise.muscleGroups.join(', ')}`);
});

// Display recipes with full details
favorites.recipes.forEach(recipe => {
  console.log(`\n${recipe.name}`);
  console.log(`Calories: ${recipe.calories}`);
  console.log(`Protein: ${recipe.protein}g`);
  console.log(`Prep Time: ${recipe.prepTime}min`);
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exercises": [
      {
        "id": 5604,
        "name": "Barbell Squat",
        "description": "Compound lower body exercise",
        "duration": 120,
        "difficulty": "intermediate",
        "equipment": ["barbell", "squat rack"],
        "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
        "thumbnailUrl": "/storage/company-1/exercises/squat.jpg",
        "videoUrl": "/storage/company-1/exercises/squat.mp4",
        "instructions": "Step by step instructions...",
        "workoutId": 567,
        "workoutName": "Upper Body Strength",
        "mealId": null,
        "mealName": null,
        "trainingPlanId": 456,
        "trainingPlanName": "Strength Building Plan",
        "nutritionPlanId": null,
        "nutritionPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "recipes": [
      {
        "id": 7340,
        "name": "Protein Pancakes",
        "description": "High protein breakfast",
        "portions": 2,
        "calories": 350,
        "protein": 35,
        "carbs": 40,
        "fat": 8,
        "prepTime": 5,
        "cookTime": 10,
        "ingredients": ["eggs", "protein powder", "banana"],
        "instructions": "Mix and cook...",
        "thumbnailUrl": "/storage/company-1/recipes/pancakes.jpg",
        "mealId": 100,
        "mealName": "Breakfast - High Protein",
        "workoutId": null,
        "workoutName": null,
        "nutritionPlanId": 789,
        "nutritionPlanName": "Balanced Meal Plan",
        "trainingPlanId": null,
        "trainingPlanName": null,
        "programId": 5845,
        "programName": "8-Week Transformation",
        "isFavorited": true
      }
    ],
    "workouts": [],
    "meals": [],
    "foods": [],
    "programs": [],
    "training_plans": [],
    "nutrition_plans": []
  },
  "pagination": {
    "limit": 10,
    "offset": 0,
    "totalCounts": {
      "workouts": 0,
      "meals": 0,
      "recipes": 1,
      "exercises": 17,
      "foods": 0,
      "programs": 0,
      "training_plans": 0,
      "nutrition_plans": 0
    }
  }
}
```

---

### Example 6: Get Only Favorite Exercises (Detailed & Paginated)

**Scenario:** Show only favorite exercises with pagination.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/detailed?companyId=${companyId}&entityType=exercises&limit=5&offset=0`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const exercises = response.data.data.exercises;
const totalExercises = response.data.pagination.totalCounts.exercises;

console.log(`Showing ${exercises.length} of ${totalExercises} favorite exercises`);
exercises.forEach(exercise => {
  console.log(`- ${exercise.name} (${exercise.difficulty})`);
});
```

---

### Example 7: Get Only Favorite Recipes (Detailed & Paginated)

**Scenario:** Show only favorite recipes with pagination.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/detailed?companyId=${companyId}&entityType=recipes&limit=5&offset=0`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const recipes = response.data.data.recipes;
const totalRecipes = response.data.pagination.totalCounts.recipes;

console.log(`Showing ${recipes.length} of ${totalRecipes} favorite recipes`);
recipes.forEach(recipe => {
  console.log(`\n${recipe.name}`);
  console.log(`Calories: ${recipe.calories} | Protein: ${recipe.protein}g`);
  console.log(`Prep: ${recipe.prepTime}min | Cook: ${recipe.cookTime}min`);
});
```

---

### Example 8: Get All Favorites (IDs Only)

**Scenario:** Display a complete favorites page with all entity types (IDs only).

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const favorites = response.data.data;
console.log(`Total favorites: ${response.data.totalFavorites}`);
console.log(`Exercises: ${favorites.exercises.length}`);
console.log(`Recipes: ${favorites.recipes.length}`);
console.log(`Workouts: ${favorites.workouts.length}`);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exercises": [5604, 5605, 5610],
    "recipes": [128, 130, 145],
    "workouts": [567, 568],
    "meals": [100],
    "foods": [],
    "programs": [5845],
    "training_plans": [],
    "nutrition_plans": []
  },
  "totalFavorites": 10
}
```

---

### Example 9: Check if Exercise is Favorited

**Scenario:** Show favorite icon state before user interaction.

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;
const exerciseId = 5604;

const response = await axios.get(
  `http://localhost:3000/api/client/favorites/exercise/${exerciseId}/status?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log(`Is favorited: ${response.data.data.isFavorited}`);
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

---

## 🖼️ Frontend Integration Example

### React Component - Favorite Button for Exercise

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface FavoriteButtonProps {
  exerciseId: number;
  companyId: number;
  token: string;
  initialFavorited?: boolean;
}

const FavoriteButton = ({ 
  exerciseId, 
  companyId, 
  token,
  initialFavorited = false 
}: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/client/favorites/exercise/${exerciseId}`,
        { companyId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setIsFavorited(response.data.data.isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={loading}
      className={isFavorited ? 'favorited' : 'not-favorited'}
    >
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
};

export default FavoriteButton;
```

---

### React Component - Favorite Button for Recipe

```typescript
import { useState } from 'react';
import axios from 'axios';

interface RecipeFavoriteButtonProps {
  recipeId: number;
  companyId: number;
  token: string;
  initialFavorited?: boolean;
}

const RecipeFavoriteButton = ({ 
  recipeId, 
  companyId, 
  token,
  initialFavorited = false 
}: RecipeFavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/client/favorites/recipe/${recipeId}`,
        { companyId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setIsFavorited(response.data.data.isFavorited);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={loading}
      className="favorite-btn"
    >
      <span className="icon">{isFavorited ? '⭐' : '☆'}</span>
      <span className="text">{isFavorited ? 'Favorited' : 'Add to Favorites'}</span>
    </button>
  );
};

export default RecipeFavoriteButton;
```

---

### React Component - Favorites Page with Detailed Data

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface FavoritesDetailedPageProps {
  companyId: number;
  token: string;
}

const FavoritesDetailedPage = ({ companyId, token }: FavoritesDetailedPageProps) => {
  const [favorites, setFavorites] = useState<any>({});
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/client/favorites/detailed?companyId=${companyId}&limit=${limit}&offset=${page * limit}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setFavorites(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [companyId, token, page]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      
      {/* Exercises Section */}
      {favorites.exercises?.length > 0 && (
        <section className="favorites-section">
          <h2>Exercises ({pagination.totalCounts.exercises})</h2>
          <div className="grid">
            {favorites.exercises.map((exercise: any) => (
              <div key={exercise.id} className="card">
                <img src={exercise.thumbnailUrl} alt={exercise.name} />
                <h3>{exercise.name}</h3>
                <p>{exercise.description}</p>
                <div className="meta">
                  <span>Duration: {exercise.duration}s</span>
                  <span>Difficulty: {exercise.difficulty}</span>
                </div>
                <div className="tags">
                  {exercise.muscleGroups?.map((muscle: string) => (
                    <span key={muscle} className="tag">{muscle}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Recipes Section */}
      {favorites.recipes?.length > 0 && (
        <section className="favorites-section">
          <h2>Recipes ({pagination.totalCounts.recipes})</h2>
          <div className="grid">
            {favorites.recipes.map((recipe: any) => (
              <div key={recipe.id} className="card">
                <img src={recipe.thumbnailUrl} alt={recipe.name} />
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                <div className="nutrition">
                  <span>🔥 {recipe.calories} cal</span>
                  <span>💪 {recipe.protein}g protein</span>
                </div>
                <div className="time">
                  <span>Prep: {recipe.prepTime}min</span>
                  <span>Cook: {recipe.cookTime}min</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Workouts Section */}
      {favorites.workouts?.length > 0 && (
        <section className="favorites-section">
          <h2>Workouts ({pagination.totalCounts.workouts})</h2>
          <div className="grid">
            {favorites.workouts.map((workout: any) => (
              <div key={workout.id} className="card">
                <img src={workout.thumbnailUrl} alt={workout.name} />
                <h3>{workout.name}</h3>
                <p>{workout.description}</p>
                <div className="meta">
                  <span>Day: {workout.day}</span>
                  <span>Duration: {workout.duration}min</span>
                  <span>Difficulty: {workout.difficulty}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setPage(p => p - 1)} 
          disabled={page === 0}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={(page + 1) * limit >= Math.max(...Object.values(pagination.totalCounts))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FavoritesDetailedPage;
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
EXERCISE_ID=5604
RECIPE_ID=128

# Login and get token
echo "=== Logging in ==="
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r '.token')

echo "Token: $TOKEN"

# Favorite an exercise
echo -e "\n=== Favoriting exercise $EXERCISE_ID ==="
curl -s -X POST "$API_URL/api/client/favorites/exercise/$EXERCISE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"companyId\": $COMPANY_ID}" | jq

# Favorite a recipe
echo -e "\n=== Favoriting recipe $RECIPE_ID ==="
curl -s -X POST "$API_URL/api/client/favorites/recipe/$RECIPE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"companyId\": $COMPANY_ID}" | jq

# Get detailed favorites (all types)
echo -e "\n=== Getting detailed favorites (all types) ==="
curl -s -X GET "$API_URL/api/client/favorites/detailed?companyId=$COMPANY_ID&limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get detailed favorites (exercises only)
echo -e "\n=== Getting detailed favorites (exercises only) ==="
curl -s -X GET "$API_URL/api/client/favorites/detailed?companyId=$COMPANY_ID&entityType=exercises&limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get detailed favorites (recipes only)
echo -e "\n=== Getting detailed favorites (recipes only) ==="
curl -s -X GET "$API_URL/api/client/favorites/detailed?companyId=$COMPANY_ID&entityType=recipes&limit=5&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get favorite exercises (IDs only)
echo -e "\n=== Getting favorite exercises (IDs only) ==="
curl -s -X GET "$API_URL/api/client/favorites/exercise?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get favorite recipes (IDs only)
echo -e "\n=== Getting favorite recipes (IDs only) ==="
curl -s -X GET "$API_URL/api/client/favorites/recipe?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get all favorites (IDs only)
echo -e "\n=== Getting all favorites (IDs only) ==="
curl -s -X GET "$API_URL/api/client/favorites?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Check favorite status
echo -e "\n=== Checking if exercise $EXERCISE_ID is favorited ==="
curl -s -X GET "$API_URL/api/client/favorites/exercise/$EXERCISE_ID/status?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Unfavorite exercise
echo -e "\n=== Unfavoriting exercise $EXERCISE_ID ==="
curl -s -X POST "$API_URL/api/client/favorites/exercise/$EXERCISE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"companyId\": $COMPANY_ID}" | jq
```

---

## 📊 Integration with Workout & Meal Responses

### Automatic `isFavorited` Field

When fetching workouts or nutrition plans, **all exercises and recipes automatically include** an `isFavorited` field. This eliminates the need for separate API calls to check favorite status.

#### Example: Training Plan Response

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
              "isFavorited": true,  // ← Automatically included
              "sets": [
                {
                  "setNumber": 1,
                  "reps": "10",
                  "weight": "100"
                }
              ]
            },
            {
              "term_id": 5605,
              "name": "Bench Press",
              "isFavorited": false,  // ← Automatically included
              "sets": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

#### Example: Nutrition Plan Response

```json
{
  "id": 789,
  "post_title": "Meal Plan",
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
              "isFavorited": true,  // ← Automatically included
              "portions": 1,
              "calories": 350
            },
            {
              "term_id": 130,
              "name": "Green Smoothie",
              "isFavorited": false,  // ← Automatically included
              "portions": 1
            }
          ]
        }
      ]
    }
  ]
}
```

This makes UI implementation extremely simple:

```typescript
// No need for separate API calls!
exercises.map(exercise => (
  <div key={exercise.term_id}>
    <h3>{exercise.name}</h3>
    <button>{exercise.isFavorited ? '❤️' : '🤍'}</button>
  </div>
))
```

---

## 🔧 Integration with Existing System

### Routes Registration

Already added to `src/routes/client/programRoutes.js`:

```javascript
const favoritesController = require('../../controllers/client/favoritesController');

// Favorites routes
router.post('/favorites/:entityType/:entityId', favoritesController.toggleFavorite);
router.get('/favorites/:entityType/:entityId/status', favoritesController.checkFavoriteStatus);
router.get('/favorites/:entityType', favoritesController.getFavoritesByType);
router.get('/favorites', favoritesController.getAllFavorites);
```

### File Structure

```
src/
├── controllers/client/
│   └── favoritesController.js     ✅ Implemented
├── services/client/
│   └── favoritesService.js        ✅ Implemented
└── routes/client/
    └── programRoutes.js           ✅ Updated with favorites routes
```

---

## 📝 Why This Design?

### ✅ Advantages

1. **Efficient Storage**
   - One post per user (not one per favorite)
   - JSON arrays for fast queries
   - Minimal database rows

2. **Fast Queries**
   - Single database read for all favorites
   - No complex joins needed
   - Array operations in memory

3. **Clean Data Structure**
   - No cluttered metadata tables
   - Easy to understand and maintain
   - Follows WordPress patterns

4. **Automatic Integration**
   - `isFavorited` field included automatically
   - No extra API calls needed
   - Simple frontend implementation

5. **Scalability**
   - Works with any entity type
   - Easy to add new entity types
   - Minimal performance impact

---

## ⚠️ Important Notes

### 1. One List Per User
- Each client has exactly one `user_favorites_list` post
- All favorites stored in this single post's metadata
- Automatically created on first favorite

### 2. Entity Type Mapping
- Multiple post types can map to same favorite key
- Example: `workout` and `training_plan_workout` → `favorite_workouts`
- Example: `program` and `program_assigned` → `favorite_programs`

### 3. Toggle Behavior
- Calling the toggle endpoint again removes the favorite
- Returns `isFavorited: false` when removed
- No separate unfavorite endpoint needed

### 4. No Trainer Functionality Affected
- All new functionality is client-only
- No modifications to trainer CRUD operations
- No changes to existing post types

### 5. Automatic `isFavorited` Field
- Added automatically in workout/meal responses
- No performance impact (single query)
- Always up-to-date with user's favorites

### 6. Relationship IDs
- **All IDs are returned as integers** (not strings)
- **Includes both IDs and names** for related entities (e.g., `workoutId` + `workoutName`, `programId` + `programName`)
- Library entities (exercises, recipes, foods) show where they're first used
- If not used anywhere, relationship IDs are `null`
- Exercises show: `workoutId`, `workoutName`, `trainingPlanId`, `trainingPlanName`, `programId`, `programName`
- Recipes show: `mealId`, `mealName`, `nutritionPlanId`, `nutritionPlanName`, `programId`, `programName`
- Foods show: `recipeId`, `recipeName`, `mealId`, `mealName`, `nutritionPlanId`, `nutritionPlanName`, `programId`, `programName` (usually all null)

---

## 🔗 Related Documentation

- [Client API Overview](../README.md)
- [Client Interactions System](../CLIENT-INTERACTIONS.md)
- [Exercise Entity](../../03-entities/term-based/exercise/README.md)
- [Recipe Entity (Term-Based)](../../03-entities/term-based/recipe/README.md)
- [Workout Entity](../../03-entities/post-based/workout/README.md)
- [Meal Entity](../../03-entities/post-based/meal/README.md)
- [Authentication System](../../02-authentication/README.md)

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Toggle Favorite | ✅ Complete | All entity types supported |
| Get Favorites by Type (IDs) | ✅ Complete | Exercise, recipe, etc. |
| Get All Favorites (IDs) | ✅ Complete | Grouped by entity type |
| **Get Detailed Favorites** | ✅ Complete | With pagination & full entity data |
| **Relationship IDs + Names** | ✅ Complete | All entities include relationship IDs and names |
| Check Favorite Status | ✅ Complete | Single entity check |
| **Auto isFavorited** | ✅ Complete | In workout/meal responses |
| **Media Resolution** | ✅ Complete | Thumbnails & videos resolved |
| **Integer Type IDs** | ✅ Complete | All IDs are integers (not strings) |
| JWT Authentication | ✅ Complete | All endpoints protected |
| Company Authorization | ✅ Complete | UserRelationship validation |
| Multi-tenant Isolation | ✅ Complete | Separate company databases |

---

## 🚀 Future Enhancements

Potential additions:
- **Favorite Collections**: Group favorites into custom lists
- **Favorite Notes**: Add personal notes to favorites
- **Share Favorites**: Share favorite exercises/recipes with other clients
- **Favorite Analytics**: Track most favorited items
- **Smart Recommendations**: Suggest similar exercises/recipes based on favorites
- **Export Favorites**: Export as PDF or share link
- **Favorite Workouts Generator**: Auto-create workout from favorite exercises
- **Favorite Meal Plans**: Auto-create meal plan from favorite recipes

---

**Last Updated:** November 27, 2025  
**Version:** 2.0  
**Maintained By:** Development Team

