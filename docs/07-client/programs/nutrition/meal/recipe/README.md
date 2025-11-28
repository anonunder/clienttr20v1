# Get Single Recipe - Client Nutrition API

## Overview

Retrieves a single recipe with all its details and media from a nutrition plan assigned to a client's program.

**Endpoint**: `GET /api/client/programs/:programId/nutrition/recipes/:recipeId`

**Parent Documentation**: [Client Nutrition Plans API](../../README.md)

---

## Quick Reference

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

---

## Request Example

```bash
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/recipes/200?companyId=1" \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Success Response (200 OK)

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
    "programId": 5962,
    "isFavorited": true
  }
}
```

---

## Response Fields

### Recipe Object

| Field | Type | Description |
|-------|------|-------------|
| `term_taxonomy_id` | number | Recipe taxonomy ID |
| `term_id` | number | Recipe term ID |
| `taxonomy` | string | Taxonomy type ("meal_recipe") |
| `name` | string | Recipe name |
| `slug` | string | Recipe slug (URL-friendly name) |
| `description` | string | Recipe description/subtitle |
| `termMeta` | array | Recipe metadata (see below) |
| `imageUri` | string\|null | Recipe thumbnail image URL |
| `media` | array | Array of demo media objects |
| `nutritionPlanId` | number | Nutrition plan ID reference |
| `programId` | number | Program ID reference |
| `isFavorited` | boolean | Whether the current user has favorited this recipe |

### Recipe Metadata (termMeta)

Common meta keys included in recipes:

| Meta Key | Type | Description |
|----------|------|-------------|
| `portions` | string | Number of servings |
| `calories` | string | Total calories per serving |
| `protein` | string | Protein in grams |
| `carbs` | string | Carbohydrates in grams |
| `fats` | string | Fats in grams |
| `prep_time` | string | Preparation time in minutes |
| `cook_time` | string | Cooking time in minutes |
| `content` | string | Recipe subtitle/short description |
| `ingredients` | string (JSON) | List of ingredients with amounts |
| `description` | string (JSON) | Step-by-step cooking instructions |
| `categories` | string (JSON) | Recipe categories/tags |

### Ingredients Format (JSON)

```json
[
  {
    "name": "Eggs",
    "amount": "3",
    "unit": "pieces"
  },
  {
    "name": "Oat Flour",
    "amount": "100",
    "unit": "g"
  }
]
```

### Cooking Instructions Format (JSON)

```json
[
  {
    "step": 1,
    "instruction": "Mix all dry ingredients in a bowl"
  },
  {
    "step": 2,
    "instruction": "Add eggs and milk, whisk until smooth"
  }
]
```

### Recipe Media

- **Thumbnail**: Single thumbnail image (`imageUri`)
- **Demo Media**: Multiple demo images/videos (`media` array)
- Each media object contains:
  - `id`: Media post ID
  - `url`: Full media URL path
  - `type`: Media type (typically "demo")
  - `mime_type`: MIME type (e.g., "image/jpeg", "video/mp4")

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
  "message": "Valid Recipe ID is required"
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
Recipe not found:
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

### 500 Internal Server Error
```json
{
  "message": "<error details>"
}
```

---

## Implementation Details

**Controller**: `/src/controllers/client/nutritionController.js` → `getRecipeById()`  
**Service**: `/src/services/client/nutritionService.js` → `getClientRecipeById()`  
**Route**: `/src/routes/client/programRoutes.js`

### Service Function Process

1. **Verify Program Assignment**: Checks `wp_usermeta` for program assignment
2. **Extract Nutrition Plan ID**: Gets `nutrition_plan_id` from program metadata
3. **Fetch Recipe**: Retrieves recipe from `wp_term_taxonomy` with all term metadata
4. **Verify Recipe Usage**: Ensures recipe is used in at least one meal from the nutrition plan
5. **Format Recipe Data**: Formats recipe using `formatTermResponse()`
6. **Attach Media**: Loads recipe media via `attachMediaToTerms()`
7. **Compute Favorites**: Determines if the current user has favorited this recipe
8. **Return Complete Recipe**: Returns recipe with all details and media

### Security

- Verifies JWT authentication
- Checks company membership via `UserRelationship`
- Validates program assignment to user
- Ensures recipe is used in the user's nutrition plan
- Prevents unauthorized access to recipes from other programs
- Validates recipe belongs to a meal in the assigned nutrition plan

---

## Usage Examples

### cURL

```bash
# 1. Login
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@example.com","password":"password123"}' \
  | jq -r '.token')

# 2. Get recipe
curl -X GET "http://localhost:3000/api/client/programs/5962/nutrition/recipes/200?companyId=1" \
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

// Get single recipe
const recipeResponse = await axios.get(
  'http://localhost:3000/api/client/programs/5962/nutrition/recipes/200?companyId=1',
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

console.log(recipeResponse.data);
```

### React Native/Expo

```javascript
import axios from 'axios';
import { useState, useEffect } from 'react';

const useRecipe = (programId, recipeId, companyId, token) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/client/programs/${programId}/nutrition/recipes/${recipeId}?companyId=${companyId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setRecipe(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (programId && recipeId && token) {
      fetchRecipe();
    }
  }, [programId, recipeId, companyId, token]);

  return { recipe, loading, error };
};
```

---

## Parsing Recipe Data

### Parsing Ingredients

```javascript
const parseIngredients = (ingredientsJson) => {
  try {
    const ingredients = JSON.parse(ingredientsJson);
    return ingredients.map(ing => ({
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit || ''
    }));
  } catch (error) {
    console.error('Error parsing ingredients:', error);
    return [];
  }
};

// Usage
const ingredientsMeta = recipe.termMeta.find(m => m.meta_key === 'ingredients');
if (ingredientsMeta) {
  const ingredients = parseIngredients(ingredientsMeta.meta_value);
  console.log(ingredients);
}
```

### Parsing Cooking Instructions

```javascript
const parseInstructions = (instructionsJson) => {
  try {
    const instructions = JSON.parse(instructionsJson);
    return instructions.sort((a, b) => a.step - b.step);
  } catch (error) {
    console.error('Error parsing instructions:', error);
    return [];
  }
};

// Usage
const instructionsMeta = recipe.termMeta.find(m => m.meta_key === 'description');
if (instructionsMeta) {
  const instructions = parseInstructions(instructionsMeta.meta_value);
  instructions.forEach(step => {
    console.log(`Step ${step.step}: ${step.instruction}`);
  });
}
```

### Parsing Categories

```javascript
const parseCategories = (categoriesJson) => {
  try {
    return JSON.parse(categoriesJson);
  } catch (error) {
    console.error('Error parsing categories:', error);
    return [];
  }
};

// Usage
const categoriesMeta = recipe.termMeta.find(m => m.meta_key === 'categories');
if (categoriesMeta) {
  const categories = parseCategories(categoriesMeta.meta_value);
  console.log(categories);
}
```

---

## Related Documentation

- **[Client Nutrition Plans API](../../README.md)** - Complete nutrition API documentation
- **[Meal Endpoint](../README.md)** - Get single meal with recipes
- **[Client Programs API](../../../README.md)** - Main programs endpoint
- **[Recipe Entity Documentation](../../../../../03-entities/term-based/recipe/README.md)** - Recipe data structure
- **[Meal Entity Documentation](../../../../../03-entities/post-based/meal/README.md)** - Meal data structure

---

## Status

**Status**: ✅ Implemented and Tested  
**Version**: 1.2  
**Last Updated**: 2025-11-09

---

## See Also

- [Get Complete Nutrition Plan](../../README.md#1-get-nutrition-plan)
- [Get Single Meal](../README.md)
- [Recipe Metadata](../../README.md#recipe-metadata-termmeta)
- [Database Architecture](../../README.md#database-architecture)

