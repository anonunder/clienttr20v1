# Client Nutrition Plans API

## Overview

**Module**: Client Nutrition Plan Management  
**Purpose**: Allow clients to view complete nutrition plans with meals and recipes assigned to their programs  
**Authentication**: Required (JWT Bearer Token)  
**Authorization**: Client role  

### File Structure
- **Routes**: `/src/routes/client/programRoutes.js` (nutrition endpoint)
- **Controller**: `/src/controllers/client/nutritionController.js`
- **Service**: `/src/services/client/nutritionService.js`

---

## 📋 Endpoints

### 1. Get Nutrition Plan

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

**Success Response (200 OK)** - Days Format:
```json
{
  "success": true,
  "data": {
    "id": 5904,
    "post_title": "56 dana (8ned) Haljina (veganska/posna)",
    "post_content": "",
    "post_date": "2025-10-04T01:31:33.000Z",
    "post_type": "nutrition_plan_assigned",
    "post_mime_type": "days",
    "imageUri": null,
    "termTaxonomies": [],
    "meta": [
      {
        "meta_id": 18809,
        "post_id": 5904,
        "meta_key": "duration",
        "meta_value": "56"
      },
      {
        "meta_id": 18810,
        "post_id": 5904,
        "meta_key": "program_id",
        "meta_value": "5845"
      }
    ],
    "nutritionPlanDays": [
      {
        "dayNumber": 1,
        "nutritionPlanDayMeals": [
          {
            "id": 100,
            "post_title": "Breakfast",
            "post_content": "High protein morning meal",
            "menu_order": 1,
            "post_parent": 5904,
            "meta": [
              {
                "meta_key": "day",
                "meta_value": "1"
              },
              {
                "meta_key": "meal_thumbnail_media_id",
                "meta_value": "201"
              }
            ],
            "mealRecipes": [
              {
                "term_taxonomy_id": 50,
                "name": "Protein Pancakes",
                "termMeta": [
                  {
                    "meta_key": "portions",
                    "meta_value": "1"
                  },
                  {
                    "meta_key": "calories",
                    "meta_value": "450"
                  },
                  {
                    "meta_key": "protein",
                    "meta_value": "30"
                  },
                  {
                    "meta_key": "carbs",
                    "meta_value": "50"
                  },
                  {
                    "meta_key": "fats",
                    "meta_value": "12"
                  }
                ],
                "isFavorited": true
              },
              {
                "term_taxonomy_id": 51,
                "name": "Greek Yogurt",
                "termMeta": [
                  {
                    "meta_key": "portions",
                    "meta_value": "1"
                  }
                ],
                "isFavorited": false
              }
            ],
            "imageUri": "/storage/company-1/user-1/media/meal-100.jpg",
            "isFavorited": false
          }
        ]
      },
      {
        "dayNumber": 2,
        "nutritionPlanDayMeals": [
          {
            "id": 101,
            "post_title": "Breakfast",
            "post_content": "Healthy morning meal",
            "meta": [],
            "mealRecipes": []
          }
        ]
      }
    ]
  }
}
```

**Success Response (200 OK)** - Meal Groups Format:
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
    "termTaxonomies": [],
    "meta": [],
    "nutritionPlanMealGroups": [
      {
        "mealGroupName": "Breakfast Options",
        "meta_id": 1,
        "nutritionPlanGroupMeals": [
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
                ],
                "isFavorited": false
              }
            ]
          }
        ]
      },
      {
        "mealGroupName": "Lunch Options",
        "meta_id": 2,
        "nutritionPlanGroupMeals": [
          {
            "id": 301,
            "post_title": "Chicken Salad",
            "mealRecipes": [],
            "isFavorited": true
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

**500 Internal Server Error**:
```json
{
  "message": "<error details>"
}
```

---

### 2. Get Single Meal

Retrieves a single meal with its recipes and media from a nutrition plan.

**Endpoint**: `GET /api/client/programs/:programId/nutrition/meals/:mealId`

**📖 [View Full Meal Endpoint Documentation →](meal/README.md)**

**Authentication**: ✅ Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `programId` | number | Yes | Program ID |
| `mealId` | number | Yes | Meal ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID the client belongs to |

**Request Example**:
```http
GET /api/client/programs/5962/nutrition/meals/6028?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 6028,
    "post_type": "nutrition_plan_meal",
    "post_title": "Test 123",
    "post_content": "",
    "menu_order": 1,
    "post_parent": 6019,
    "post_date": "2025-11-09T23:10:05.000Z",
    "meta": [
      {
        "meta_id": 19634,
        "post_id": 6028,
        "meta_key": "meal_group_id",
        "meta_value": "19632"
      }
    ],
    "imageUri": "/storage/company-1/user-1/media/meal-6028.jpg",
    "media": [
      {
        "id": 301,
        "url": "/storage/company-1/user-1/media/meal-demo-1.mp4",
        "type": "demo",
        "mime_type": "video/mp4"
      }
    ],
    "mealRecipes": [
      {
        "term_taxonomy_id": 200,
        "term_id": 150,
        "name": "Protein Pancakes",
        "taxonomy": "meal_recipe",
        "description": "Delicious high-protein pancakes",
        "termMeta": [
          {
            "meta_key": "portions",
            "meta_value": "2"
          },
          {
            "meta_key": "calories",
            "meta_value": "450"
          },
          {
            "meta_key": "protein",
            "meta_value": "35"
          },
          {
            "meta_key": "carbs",
            "meta_value": "50"
          },
          {
            "meta_key": "fats",
            "meta_value": "10"
          },
          {
            "meta_key": "ingredients",
            "meta_value": "[{\"name\":\"Eggs\",\"amount\":\"3\"},{\"name\":\"Oats\",\"amount\":\"100g\"}]"
          },
          {
            "meta_key": "description",
            "meta_value": "[{\"step\":1,\"instruction\":\"Mix all ingredients\"},{\"step\":2,\"instruction\":\"Cook on medium heat\"}]"
          }
        ],
        "imageUri": "/storage/company-1/user-1/media/recipe-150.jpg",
        "media": [
          {
            "id": 401,
            "url": "/storage/company-1/user-1/media/recipe-demo-1.jpg",
            "type": "demo",
            "mime_type": "image/jpeg"
          }
        ]
      }
    ],
    "nutritionPlanId": 6019,
    "isFavorited": true
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
  "message": "Valid Meal ID is required"
}
```

**403 Forbidden** - User not authorized:
```json
{
  "message": "User not authorized for this company"
}
```

**404 Not Found** - Meal not found:
```json
{
  "message": "Meal not found or does not belong to this nutrition plan"
}
```

**500 Internal Server Error**:
```json
{
  "message": "<error details>"
}
```

---

### 3. Get Single Recipe

Retrieves a single recipe with all its details and media from a nutrition plan.

**Endpoint**: `GET /api/client/programs/:programId/nutrition/recipes/:recipeId`

**📖 [View Full Recipe Endpoint Documentation →](meal/recipe/README.md)**

**Authentication**: ✅ Required (Bearer Token)

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `programId` | number | Yes | Program ID |
| `recipeId` | number | Yes | Recipe Term Taxonomy ID |

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `companyId` | number | Yes | Company ID the client belongs to |

**Request Example**:
```http
GET /api/client/programs/5962/nutrition/recipes/200?companyId=1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "term_taxonomy_id": 200,
    "term_id": 150,
    "taxonomy": "meal_recipe",
    "name": "Protein Pancakes",
    "slug": "protein-pancakes",
    "description": "Delicious high-protein pancakes perfect for breakfast",
    "termMeta": [
      {
        "meta_key": "portions",
        "meta_value": "2"
      },
      {
        "meta_key": "calories",
        "meta_value": "450"
      },
      {
        "meta_key": "protein",
        "meta_value": "35"
      },
      {
        "meta_key": "carbs",
        "meta_value": "50"
      },
      {
        "meta_key": "fats",
        "meta_value": "10"
      },
      {
        "meta_key": "prep_time",
        "meta_value": "10"
      },
      {
        "meta_key": "cook_time",
        "meta_value": "15"
      },
      {
        "meta_key": "content",
        "meta_value": "High-protein breakfast option"
      },
      {
        "meta_key": "ingredients",
        "meta_value": "[{\"name\":\"Eggs\",\"amount\":\"3\",\"unit\":\"pieces\"},{\"name\":\"Oat Flour\",\"amount\":\"100\",\"unit\":\"g\"},{\"name\":\"Protein Powder\",\"amount\":\"30\",\"unit\":\"g\"},{\"name\":\"Milk\",\"amount\":\"100\",\"unit\":\"ml\"}]"
      },
      {
        "meta_key": "description",
        "meta_value": "[{\"step\":1,\"instruction\":\"Mix all dry ingredients in a bowl\"},{\"step\":2,\"instruction\":\"Add eggs and milk, whisk until smooth\"},{\"step\":3,\"instruction\":\"Heat pan on medium heat\"},{\"step\":4,\"instruction\":\"Pour batter and cook 2-3 minutes each side\"}]"
      },
      {
        "meta_key": "categories",
        "meta_value": "[\"Breakfast\",\"High-Protein\",\"Quick Meals\"]"
      }
    ],
    "imageUri": "/storage/company-1/user-1/media/recipe-150.jpg",
    "media": [
      {
        "id": 401,
        "url": "/storage/company-1/user-1/media/recipe-demo-1.jpg",
        "type": "demo",
        "mime_type": "image/jpeg"
      },
      {
        "id": 402,
        "url": "/storage/company-1/user-1/media/recipe-demo-2.mp4",
        "type": "demo",
        "mime_type": "video/mp4"
      }
    ],
    "nutritionPlanId": 6019,
    "programId": 5962
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
  "message": "Valid Recipe ID is required"
}
```

**403 Forbidden** - User not authorized:
```json
{
  "message": "User not authorized for this company"
}
```

**404 Not Found** - Recipe not found:
```json
{
  "message": "Recipe not found"
}
```
```json
{
  "message": "Recipe not found in this nutrition plan"
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
4. **Nutrition Plan Access**: Nutrition plan ID is extracted from program metadata - clients can only access nutrition plans assigned to their programs

### Multi-Tenant Security
- **Main DB Check**: `wp_usermeta` table (MySQL) verifies user has access to program
- **Company DB Check**: Program and nutrition plan fetched from company-specific SQLite database
- **Post Type Filter**: Only `nutrition_plan_assigned` post types are returned (not master `nutrition_plan` templates)

---

## 📊 Data Flow

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
   - ORDER BY menu_order ASC
   ↓
9. For Each Meal:
   a. Fetch meal_recipe TermTaxonomies
      - Included via MealRecipeTaxonomies association
      - WHERE taxonomy = 'meal_recipe'
   b. Format recipe data using formatTermResponse()
      - Returns complete recipe details with termMeta
   c. Attach media to recipes using attachMediaToTerms()
      - Fetches recipe_thumbnail_media_id
      - Fetches demo_media_id (multiple)
      - Returns imageUri and media array for each recipe
   ↓
10. Format using formatNutritionPlans()
    - Groups meals by day number (for 'days' format)
    - OR groups meals by meal group (for 'meals' format)
    - Creates appropriate structure based on post_mime_type
   ↓
11. Fetch Nutrition Plan Thumbnail Media (if exists)
    - Get nutrition_plan_thumbnail_media_id from plan metadata
    - Fetch media post and return imageUri
   ↓
12. Return Complete Nutrition Plan with Meals & Recipes
```

### Get Single Meal Flow
```
1. Client Request → API Endpoint (/api/client/programs/:programId/nutrition/meals/:mealId)
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
7. Fetch Single Meal from wp_posts (Company DB)
   - WHERE id = <meal_id>
   - AND post_parent = <nutrition_plan_id>
   - AND post_type = 'nutrition_plan_meal'
   ↓
8. Fetch Meal Recipes:
   a. Fetch meal_recipe TermTaxonomies
      - Included via MealRecipeTaxonomies association
      - WHERE taxonomy = 'meal_recipe'
   b. Format recipe data using formatTermResponse()
      - Returns complete recipe details with termMeta
   c. Attach media to recipes using attachMediaToTerms()
      - Fetches recipe_thumbnail_media_id
      - Fetches demo_media_id (multiple)
      - Returns imageUri and media array for each recipe
   ↓
9. Attach Meal Media
   - Fetch meal_thumbnail_media_id (thumbnail)
   - Fetch demo_media_id (multiple demo media)
   ↓
10. Return Single Meal with Recipes & Media
```

### Get Single Recipe Flow
```
1. Client Request → API Endpoint (/api/client/programs/:programId/nutrition/recipes/:recipeId)
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
7. Fetch Recipe from wp_term_taxonomy (Company DB)
   - WHERE term_taxonomy_id = <recipe_id>
   - AND taxonomy = 'meal_recipe'
   - Include term with termMeta
   ↓
8. Verify Recipe is Used in Nutrition Plan
   - Find at least one meal with post_parent = <nutrition_plan_id>
   - AND meal has this recipe in MealRecipeTaxonomies
   ↓
9. Format Recipe Data
   - Format using formatTermResponse()
   - Returns complete recipe details with termMeta
   ↓
10. Attach Recipe Media
    - Fetch recipe_thumbnail_media_id (thumbnail)
    - Fetch demo_media_id (multiple demo media)
    - Returns imageUri and media array
   ↓
11. Return Single Recipe with All Details & Media
```

---

## 💡 Response Field Descriptions

### Nutrition Plan Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Nutrition plan ID (post ID in company DB) |
| `post_title` | string | Nutrition plan name/title |
| `post_content` | string | Nutrition plan description |
| `post_date` | string | Creation date (ISO 8601) |
| `post_type` | string | Post type (e.g., "nutrition_plan_assigned") |
| `post_mime_type` | string | Format type: "days" or "meals" |
| `imageUri` | string\|null | Thumbnail image URL |
| `termTaxonomies` | array | Term taxonomies (colors, tags, etc.) |
| `meta` | array | Nutrition plan metadata |
| `nutritionPlanDays` | array | Array of days with meals (for "days" format) |
| `nutritionPlanMealGroups` | array | Array of meal groups (for "meals" format) |

### Nutrition Plan Days (for "days" format)
| Field | Type | Description |
|-------|------|-------------|
| `dayNumber` | number | Day number in the nutrition plan |
| `nutritionPlanDayMeals` | array | Array of meals for this day |

### Nutrition Plan Meal Groups (for "meals" format)
| Field | Type | Description |
|-------|------|-------------|
| `mealGroupName` | string | Name of the meal group (e.g., "Breakfast Options") |
| `meta_id` | number | Metadata ID for the meal group |
| `nutritionPlanGroupMeals` | array | Array of meals in this group |

### Meal Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Meal ID (post ID) |
| `post_title` | string | Meal name/title |
| `post_content` | string | Meal description/instructions |
| `menu_order` | number | Order within the day/group |
| `post_parent` | number | Parent nutrition plan ID |
| `meta` | array | Meal metadata (day, thumbnail_media_id, demo_media_id, etc.) |
| `imageUri` | string\|null | Meal thumbnail image URL |
| `media` | array | Array of demo media objects for the meal |
| `mealRecipes` | array | Array of recipes in this meal (see below) |
| `isFavorited` | boolean | Whether the current user has favorited this meal |

### Meal Media
Meals can have multiple images/videos:
- **Thumbnail**: Single thumbnail image (`meal_thumbnail_media_id`)
- **Demo Media**: Multiple demo images/videos (`demo_media_id`, can appear multiple times)
- Each media object contains:
  - `id`: Media post ID
  - `url`: Full media URL path
  - `type`: Media type (image, video, etc.)
  - `mime_type`: MIME type (e.g., "image/jpeg", "video/mp4")

### Recipe Object
| Field | Type | Description |
|-------|------|-------------|
| `term_taxonomy_id` | number | Recipe taxonomy ID |
| `name` | string | Recipe name |
| `term` | object | Recipe term data with meta |
| `termMeta` | array | Recipe metadata (see below) |
| `imageUri` | string\|null | Recipe thumbnail image URL |
| `media` | array | Array of demo media objects for the recipe |
| `isFavorited` | boolean | Whether the current user has favorited this recipe |

### Recipe Media
Recipes can have multiple images/videos:
- **Thumbnail**: Single thumbnail image (`recipe_thumbnail_media_id`)
- **Demo Media**: Multiple demo images/videos (`demo_media_id`, can appear multiple times)
- Each media object contains:
  - `id`: Media post ID
  - `url`: Full media URL path
  - `type`: Media type (image, video, etc.)
  - `mime_type`: MIME type (e.g., "image/jpeg", "video/mp4")

### Recipe Metadata (termMeta)
Common meta keys:
- `portions`: Number of servings
- `calories`: Total calories per serving
- `protein`: Protein grams
- `carbs`: Carbohydrate grams
- `fats`: Fat grams
- `ingredients`: List of ingredients (JSON)
- `content`: Recipe subtitle/description
- `description`: Detailed cooking instructions (JSON)
- `categories`: Recipe categories (JSON)
- `prep_time`: Preparation time
- `cook_time`: Cooking time
- `recipe_thumbnail_media_id`: ID of recipe thumbnail
- `demo_media_id`: IDs of demo media (can be multiple)

---

## 🔗 Database Architecture

### Nutrition Plan Structure
- **Nutrition Plan**: Stored as `wp_posts` with `post_type = 'nutrition_plan_assigned'`
- **Meals**: Child posts with `post_type = 'nutrition_plan_meal'` and `post_parent = <nutrition_plan_id>`
- **Recipes**: Linked via `wp_term_taxonomy` with `taxonomy = 'meal_recipe'` and `post_parent = <meal_id>`
- **Media**: Thumbnails stored as `wp_posts` with `post_type = 'media'` and referenced via metadata

### Nutrition Plan Formats

There are two formats for nutrition plans, determined by the `post_mime_type` field:

#### 1. Days Format (`post_mime_type = 'days'`)
- Meals are organized by day number
- Each meal has a `day` meta key indicating which day it belongs to
- Response includes `nutritionPlanDays` array
- Use case: Fixed daily meal plans (e.g., 7-day, 30-day plans)

#### 2. Meal Groups Format (`post_mime_type = 'meals'`)
- Meals are organized into named groups
- Each meal has a `meal_group_id` meta key linking it to a meal group
- Meal groups are stored as `meal_group` meta entries on the nutrition plan itself
- Response includes `nutritionPlanMealGroups` array
- Use case: Flexible meal plans where clients can choose from options (e.g., "Breakfast Options", "Lunch Options")

### Post Types
- `nutrition_plan`: Master template created by trainer (not accessible to clients)
- `nutrition_plan_assigned`: Client-specific copy of nutrition plan (accessible to assigned client)
- `nutrition_plan_meal`: Meal posts linked to a nutrition plan
- `media`: Media posts containing images/videos

### Metadata Keys

**Nutrition Plan Metadata**:
- `nutrition_plan_thumbnail_media_id`: Media ID for plan thumbnail
- `duration`: Duration in days
- `program_id`: Associated program ID
- `meal_group` (for "meals" format): Meal group definitions

**Meal Metadata**:
- `day` (for "days" format): Day number this meal belongs to
- `meal_group_id` (for "meals" format): Meal group meta_id this meal belongs to
- `meal_thumbnail_media_id`: Media ID for meal thumbnail image
- `demo_media_id`: Media IDs for meal demonstration (can be multiple entries)
- `description`: Meal description (JSON format)
- `menu_order`: Order within the day/group
- `ingredients`: List of ingredients (JSON)

---

## 📝 Implementation Notes

### Service Functions

Located in `/src/services/client/nutritionService.js`

#### 1. `getClientNutritionPlanById()`

**Parameters**:
- `programId` (number): Program ID
- `userId` (number): Client user ID
- `companyId` (number): Company ID
- `mainModels` (object): Main database models
- `companyModels` (object): Company database models
- `companyDB` (object): Company database connection

**Process**:
1. Verifies program assignment via `wp_usermeta`
2. Extracts `nutrition_plan_id` from program metadata
3. Fetches nutrition plan post with metadata
4. Fetches all meals ordered by `menu_order`
5. For each meal:
   - Meal images are loaded via `associateMediaForPostType` (thumbnail + demo media)
   - Fetches meal recipes via `MealRecipeTaxonomies` association
   - Formats recipe data using `formatTermResponse()`
   - Attaches media to recipes using `attachMediaToTerms()` helper
   - Each recipe gets `imageUri` (thumbnail) and `media` array (demo media)
6. Formats using `formatNutritionPlans()` helper
7. Fetches and attaches nutrition plan thumbnail media URI

**Media Handling**:
- **Meals**: Thumbnail and multiple demo media loaded via `associateMediaForPostType`
- **Recipes**: Thumbnail and multiple demo media loaded via `attachMediaToTerms`
- **Nutrition Plan**: Single thumbnail loaded separately
- All media includes full URL paths, MIME types, and metadata

**Favorites Handling**:
- Each recipe includes an `isFavorited` boolean field indicating if the current user has favorited it
- Each meal includes an `isFavorited` boolean field indicating if the current user has favorited it
- The field is automatically computed based on the user's favorites list stored in `user_favorites_list` post type
- Favorites are fetched once per request and applied to all recipes/meals for optimal performance

#### 2. `getClientMealById()`

**Parameters**:
- `programId` (number): Program ID
- `mealId` (number): Meal ID
- `userId` (number): Client user ID
- `companyId` (number): Company ID
- `mainModels` (object): Main database models
- `companyModels` (object): Company database models
- `companyDB` (object): Company database connection

**Process**:
1. Verifies program assignment via `wp_usermeta`
2. Extracts `nutrition_plan_id` from program metadata
3. Fetches single meal and verifies it belongs to the nutrition plan
4. Meal images are loaded via `associateMediaForPostType` (thumbnail + demo media)
5. Fetches meal recipes via `MealRecipeTaxonomies` association
6. Formats recipe data using `formatTermResponse()`
7. Attaches media to recipes using `attachMediaToTerms()` helper
8. Returns meal object with recipes and media

**Media Handling**:
- **Meal**: Thumbnail and multiple demo media loaded via `associateMediaForPostType`
- **Recipes**: Thumbnail and multiple demo media loaded via `attachMediaToTerms`
- All media includes full URL paths, MIME types, and metadata

**Security**:
- Verifies meal belongs to the nutrition plan associated with the user's program
- Prevents unauthorized access to meals from other programs

#### 3. `getClientRecipeById()`

**Parameters**:
- `programId` (number): Program ID
- `recipeTermTaxonomyId` (number): Recipe term taxonomy ID
- `userId` (number): Client user ID
- `companyId` (number): Company ID
- `mainModels` (object): Main database models
- `companyModels` (object): Company database models
- `companyDB` (object): Company database connection

**Process**:
1. Verifies program assignment via `wp_usermeta`
2. Extracts `nutrition_plan_id` from program metadata
3. Fetches recipe from `wp_term_taxonomy` with all term metadata
4. Verifies recipe is used in at least one meal belonging to the nutrition plan
5. Formats recipe data using `formatTermResponse()`
6. Attaches media to recipe using `attachMediaToTerms()` helper
7. Returns recipe object with all details and media

**Media Handling**:
- **Recipe**: Thumbnail and multiple demo media loaded via `attachMediaToTerms`
- All media includes full URL paths, MIME types, and metadata

**Security**:
- Verifies recipe is used in the nutrition plan associated with the user's program
- Prevents unauthorized access to recipes from other nutrition plans
- Ensures recipe belongs to a meal in the user's assigned nutrition plan

---

### Key Features
- Automatic plan ID extraction (no need to pass plan ID in URL)
- Complete recipe data with all metadata
- **Comprehensive media support**:
  - Meals: Thumbnail + multiple demo media
  - Recipes: Thumbnail + multiple demo media
  - Nutrition Plan: Thumbnail
  - All media includes URLs, types, and metadata
- **Favorites support**: Each recipe and meal includes an `isFavorited` boolean field
- Supports both "days" and "meals" format types
- Day-based organization OR meal group organization
- Same media handling pattern as training plans (exercises)

**Comparison with Training Plans**:

| Aspect | Training Plans | Nutrition Plans |
|--------|---------------|-----------------|
| Parent Type | `training_plan_assigned` | `nutrition_plan_assigned` |
| Child Type | `training_plan_workout` | `nutrition_plan_meal` |
| Sub-items | Exercises (via `workout_exercise` taxonomy) | Recipes (via `meal_recipe` taxonomy) |
| Organization | Days only | Days OR Meal Groups |
| Format Field | N/A | `post_mime_type` ("days" or "meals") |
| Day Meta Key | `day` | `day` (for days format) |
| Group Meta Key | N/A | `meal_group_id` (for meals format) |
| Formatter | `formatDaysInTrainingPlans()` | `formatNutritionPlans()` |
| Response Field | `trainingPlanDays` | `nutritionPlanDays` or `nutritionPlanMealGroups` |

---

## 🧪 Testing

### Get Nutrition Plan Request
```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get nutrition plan
curl -X GET "http://localhost:3000/api/client/programs/5845/nutrition?companyId=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Get Single Meal Request
```bash
# 1. Login (if not already done)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get single meal
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/meals/6028?companyId=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Get Single Recipe Request
```bash
# 1. Login (if not already done)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get single recipe
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/recipes/200?companyId=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### JavaScript/Axios Examples

**Get Nutrition Plan**:
```javascript
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'client@example.com',
  password: 'password123'
});
const token = loginResponse.data.token;

// Get nutrition plan
const nutritionPlanResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5845/nutrition?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(nutritionPlanResponse.data);
```

**Get Single Meal**:
```javascript
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'client@example.com',
  password: 'password123'
});
const token = loginResponse.data.token;

// Get single meal
const mealResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5962/nutrition/meals/6028?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(mealResponse.data);
```

**Get Single Recipe**:
```javascript
const axios = require('axios');

// Login
const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'client@example.com',
  password: 'password123'
});
const token = loginResponse.data.token;

// Get single recipe
const recipeResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5962/nutrition/recipes/200?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
console.log(recipeResponse.data);
```

---

## 🔗 Related Documentation

**Detailed Endpoint Documentation**:
- 📄 [Get Single Meal Endpoint](meal/README.md) - Detailed meal endpoint documentation
- 📄 [Get Single Recipe Endpoint](meal/recipe/README.md) - Detailed recipe endpoint documentation

**General Documentation**:
- [Client Programs API](../README.md) - Main programs endpoint
- [Client Training Plans API](../trainings/README.md) - Training plans structure
- [Client Interactions - Favorites](../CLIENT-INTERACTIONS.md#favorites-system) - Favorites system documentation
- [Nutrition Plan Entity](../../../03-entities/post-based/nutrition-plan/README.md) - Nutrition plan structure
- [Meal Entity](../../../03-entities/post-based/meal/README.md) - Meal structure
- [Recipe Entity](../../../03-entities/term-based/recipe/README.md) - Recipe structure
- [Assigned Content](../../../04-extending-for-clients/assigned-content.md) - Assignment flow

---

## ✅ Status

**Status**: ✅ Implemented and Tested  
**Version**: 1.2  
**Last Updated**: 2025-11-09

**Endpoints**:
- ✅ `GET /api/client/programs/:id/nutrition` - Get complete nutrition plan
- ✅ `GET /api/client/programs/:programId/nutrition/meals/:mealId` - Get single meal ([docs](meal/README.md))
- ✅ `GET /api/client/programs/:programId/nutrition/recipes/:recipeId` - Get single recipe ([docs](meal/recipe/README.md))

---

## 📌 Key Differences from Training Plans

### Similarities
1. Both use parent-child post relationships
2. Both use taxonomies for sub-items (exercises vs recipes)
3. Both support day-based organization
4. Both are automatically extracted from program metadata
5. Both have thumbnail media support

### Unique Features in Nutrition Plans
1. **Two Format Types**: "days" (fixed daily schedule) vs "meals" (flexible meal groups)
2. **Meal Groups**: Meals can be grouped into categories for client choice
3. **Format Field**: `post_mime_type` determines the structure
4. **Dynamic Response**: Response structure changes based on format type

### Implementation Recommendations
1. Always check `post_mime_type` to determine response structure
2. For "days" format, access meals via `nutritionPlanDays` array
3. For "meals" format, access meals via `nutritionPlanMealGroups` array
4. Recipes are always available in `mealRecipes` array regardless of format
5. Display logic should adapt based on format type
