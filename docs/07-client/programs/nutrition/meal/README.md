# Get Single Meal - Client Nutrition API

## Overview

Retrieves a single meal with its recipes and media from a nutrition plan assigned to a client's program.

**Endpoint**: `GET /api/client/programs/:programId/nutrition/meals/:mealId`

**Parent Documentation**: [Client Nutrition Plans API](../README.md)

---

## Quick Reference

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

---

## Request Example

```bash
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/meals/6028?companyId=1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "id": 6028,
    "post_type": "nutrition_plan_meal",
    "post_title": "High Protein Breakfast",
    "post_content": "A nutritious breakfast meal packed with protein",
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
        ],
        "isFavorited": true
      }
    ],
    "nutritionPlanId": 6019,
    "isFavorited": false
  }
}
```

---

## Response Fields

### Meal Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Meal ID (post ID) |
| `post_type` | string | Post type ("nutrition_plan_meal") |
| `post_title` | string | Meal name/title |
| `post_content` | string | Meal description/instructions |
| `menu_order` | number | Order within the day/group |
| `post_parent` | number | Parent nutrition plan ID |
| `post_date` | string | Creation date (ISO 8601) |
| `meta` | array | Meal metadata |
| `imageUri` | string\|null | Meal thumbnail image URL |
| `media` | array | Array of demo media objects |
| `mealRecipes` | array | Array of recipes in this meal |
| `nutritionPlanId` | number | Nutrition plan ID reference |
| `isFavorited` | boolean | Whether the current user has favorited this meal |

### Meal Media

- **Thumbnail**: Single thumbnail image (`imageUri`)
- **Demo Media**: Multiple demo images/videos (`media` array)
- Each media object contains:
  - `id`: Media post ID
  - `url`: Full media URL path
  - `type`: Media type (typically "demo")
  - `mime_type`: MIME type (e.g., "image/jpeg", "video/mp4")

### Recipe Objects

Each recipe in `mealRecipes` includes an `isFavorited` boolean field indicating if the current user has favorited it.

See [Recipe Documentation](recipe/README.md) for detailed recipe field descriptions.

---

## Error Responses

### 400 Bad Request
Missing or invalid parameters:
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

### 403 Forbidden
User not authorized:
```json
{
  "message": "User not authorized for this company"
}
```

### 404 Not Found
Meal not found:
```json
{
  "message": "Meal not found or does not belong to this nutrition plan"
}
```

### 500 Internal Server Error
```json
{
  "message": "<error details>"
}
```

---

## Implementation Details

**Controller**: `/src/controllers/client/nutritionController.js` → `getMealById()`  
**Service**: `/src/services/client/nutritionService.js` → `getClientMealById()`  
**Route**: `/src/routes/client/programRoutes.js`

### Service Function Process

1. **Verify Program Assignment**: Checks `wp_usermeta` for program assignment
2. **Extract Nutrition Plan ID**: Gets `nutrition_plan_id` from program metadata
3. **Fetch Meal**: Retrieves meal and verifies it belongs to the nutrition plan
4. **Load Meal Media**: Fetches thumbnail and demo media via `associateMediaForPostType`
5. **Fetch Recipes**: Retrieves all recipes linked to the meal via `MealRecipeTaxonomies`
6. **Format Recipes**: Formats recipe data using `formatTermResponse()`
7. **Attach Recipe Media**: Loads recipe media via `attachMediaToTerms()`
8. **Compute Favorites**: Determines if the current user has favorited the meal and each recipe
9. **Return Complete Meal**: Returns meal with recipes and all media

### Security

- Verifies JWT authentication
- Checks company membership via `UserRelationship`
- Validates program assignment to user
- Ensures meal belongs to user's nutrition plan
- Prevents unauthorized access to meals from other programs

---

## Usage Examples

### cURL

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get meal
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/meals/6028?companyId=1" \
  -H "Authorization: Bearer $TOKEN" | jq
```

### JavaScript/Axios

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

### React Native/Expo

```javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

const useMeal = (programId, mealId, companyId, token) => {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/client/programs/${programId}/nutrition/meals/${mealId}?companyId=${companyId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMeal(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (programId && mealId && token) {
      fetchMeal();
    }
  }, [programId, mealId, companyId, token]);

  return { meal, loading, error };
};
```

---

## Related Documentation

- **[Client Nutrition Plans API](../README.md)** - Complete nutrition API documentation
- **[Recipe Endpoint](recipe/README.md)** - Get single recipe details
- **[Client Programs API](../../README.md)** - Main programs endpoint
- **[Meal Entity Documentation](../../../../03-entities/post-based/meal/README.md)** - Meal data structure
- **[Recipe Entity Documentation](../../../../03-entities/term-based/recipe/README.md)** - Recipe data structure

---

## Status

**Status**: ✅ Implemented and Tested  
**Version**: 1.2  
**Last Updated**: 2025-11-09

---

## See Also

- [Get Complete Nutrition Plan](../README.md#1-get-nutrition-plan)
- [Get Single Recipe](recipe/README.md)
- [Nutrition Plan Formats](../README.md#nutrition-plan-formats)
- [Database Architecture](../README.md#database-architecture)

