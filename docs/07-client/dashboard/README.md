# Client Dashboard API Documentation

**Version:** 1.0  
**Date:** November 27, 2025  
**Status:** ✅ Fully Implemented

---

## 📋 Overview

The Client Dashboard API provides a comprehensive overview of a client's fitness journey, aggregating data from multiple modules into a single, efficient endpoint. This module is designed to power the main dashboard screen of client applications with all necessary information.

**Key Features:**
- ✅ Complete dashboard data in a single API call
- ✅ Active programs overview
- ✅ Workout statistics and progress
- ✅ In-progress workout sessions
- ✅ Today's scheduled workouts and meals
- ✅ Daily progress tracking
- ✅ Recent measurements
- ✅ Pending reports count
- ✅ Weekly overview with daily breakdown
- ✅ Overall statistics summary

---

## 🎯 Dashboard Components

### 1. Active Programs
Current programs assigned to the client with status and details.

### 2. Workout Statistics
- Total workouts completed
- Completion rate
- Weekly and monthly workout counts
- Total exercises available and completed

### 3. Continue Workout
Information about any in-progress workout session the client can resume.

### 4. Today's Content
- **Today's Workouts**: Workouts scheduled for current program day (calculated from program start date)
- **Today's Meals**: Meals scheduled for current program day (calculated from program start date)

### 5. Daily Progress
Real-time tracking of today's activities:
- Workouts completed
- Exercises completed
- Total workout duration
- Estimated calories burned

### 6. Measurements
Recent body measurements with dates and values.

### 7. Reports
Pending progress reports that need to be filled.

### 8. Overall Statistics
Summary of all activities across the platform.

---

## 📡 API Endpoints

### Base Route
```
/api/client/dashboard
```

All endpoints require:
- **Authentication**: JWT Bearer token
- **Query Parameter**: `companyId` (required)

---

### 1. Get Complete Dashboard Data

Get all dashboard data in a single comprehensive API call.

```http
GET /api/client/dashboard?companyId={companyId}
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
    "activePrograms": [
      {
        "id": 5845,
        "title": "Weight Loss Program",
        "status": "active",
        "startDate": "2025-01-01",
        "endDate": "2025-03-01",
        "hasTrainingPlan": true,
        "hasNutritionPlan": true,
        "trainingPlanId": "456",
        "nutritionPlanId": "789",
        "durationWeeks": 8,
        "difficultyLevel": "Intermediate"
      }
    ],
    "totalPrograms": 1,
    
    "completedWorkouts": 24,
    "totalWorkouts": 32,
    "workoutCompletionRate": 75,
    "weeklyWorkouts": 3,
    "monthlyWorkouts": 12,
    
    "totalExercises": 150,
    "completedExercises": 320,
    
    "continueWorkout": {
      "sessionId": 999,
      "workoutId": 567,
      "workoutTitle": "Upper Body Strength",
      "startedAt": "2025-11-27T10:00:00.000Z",
      "exercisesCompleted": 3,
      "currentExerciseId": "5604"
    },
    "hasInProgressWorkout": true,
    
    "todayWorkouts": [
      {
        "id": 5900,
        "title": "Upper Body Day",
        "description": "Focus on chest and shoulders",
        "day": 7,
        "programId": 5845,
        "programTitle": "Weight Loss Program"
      }
    ],
    
    "todayMeals": [
      {
        "id": 128,
        "title": "Protein Breakfast",
        "description": "High protein meal",
        "day": 7,
        "programId": 5845,
        "programTitle": "Weight Loss Program"
      }
    ],
    
    "dailyProgress": {
      "date": "2025-11-27",
      "workoutsCompleted": 1,
      "exercisesCompleted": 5,
      "totalDuration": 45,
      "caloriesBurned": 360
    },
    
    "recentMeasurements": [
      {
        "id": 500,
        "date": "2025-11-27T15:30:00.000Z",
        "measurements": {
          "weight": 75.5,
          "body_fat": 18,
          "chest": 100
        },
        "hasImages": true
      }
    ],
    "measurementsCount": 15,
    
    "pendingReportsCount": 2,
    "recentReports": [
      {
        "id": 201,
        "title": "Weekly Check-in",
        "sentDate": "2025-11-27T10:00:00.000Z",
        "status": "pending",
        "reportId": "110"
      }
    ],
    
    "overallStats": {
      "programsActive": 1,
      "workoutsCompleted": 24,
      "exercisesCompleted": 320,
      "reportsCompleted": 8,
      "measurementsTaken": 15
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

### 2. Get Weekly Overview

Get a detailed weekly breakdown of workouts and activities.

```http
GET /api/client/dashboard/weekly?companyId={companyId}
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
    "period": "week",
    "startDate": "2025-11-20",
    "endDate": "2025-11-27",
    "dailyStats": [
      {
        "day": "Monday",
        "workouts": 1,
        "exercises": 5,
        "duration": 45,
        "completed": 1
      },
      {
        "day": "Wednesday",
        "workouts": 1,
        "exercises": 6,
        "duration": 50,
        "completed": 1
      }
    ],
    "totalWorkouts": 3,
    "totalCompleted": 2
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 3. Get Active Programs

Get a summary of active programs only.

```http
GET /api/client/dashboard/programs?companyId={companyId}
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
    "programs": [
      {
        "id": 5845,
        "title": "Weight Loss Program",
        "status": "active",
        "startDate": "2025-01-01",
        "endDate": "2025-03-01",
        "hasTrainingPlan": true,
        "hasNutritionPlan": true,
        "trainingPlanId": "456",
        "nutritionPlanId": "789",
        "durationWeeks": 8,
        "difficultyLevel": "Intermediate"
      }
    ],
    "count": 1
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 4. Get Workout Statistics

Get detailed workout statistics and progress.

```http
GET /api/client/dashboard/workouts?companyId={companyId}
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
    "completedCount": 24,
    "totalCount": 32,
    "completionRate": 75,
    "weeklyCount": 3,
    "monthlyCount": 12,
    "totalExercises": 150,
    "completedExercises": 320
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing companyId
- `403` - Unauthorized for this company
- `500` - Server error

---

### 5. Get Daily Progress

Get today's progress and activity summary.

```http
GET /api/client/dashboard/daily?companyId={companyId}
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
    "date": "2025-11-27",
    "workoutsCompleted": 1,
    "exercisesCompleted": 5,
    "totalDuration": 45,
    "caloriesBurned": 360
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

### 3. Multi-Tenant Isolation
- Each company has separate SQLite database
- No data leakage between companies
- Database selected via `CompaniesDbManager.getCompanyDB(companyId)`

---

## 💡 Usage Examples

### Example 1: Getting Complete Dashboard

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/dashboard?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log('Dashboard Data:', response.data.data);
console.log(`Active Programs: ${response.data.data.totalPrograms}`);
console.log(`Completed Workouts: ${response.data.data.completedWorkouts}`);
console.log(`Completion Rate: ${response.data.data.workoutCompletionRate}%`);

if (response.data.data.hasInProgressWorkout) {
  console.log('Continue Workout:', response.data.data.continueWorkout.workoutTitle);
}
```

### Example 2: Getting Weekly Overview

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/dashboard/weekly?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

console.log('Weekly Overview:');
response.data.data.dailyStats.forEach(day => {
  console.log(`${day.day}: ${day.completed}/${day.workouts} workouts, ${day.exercises} exercises, ${day.duration} min`);
});
```

### Example 3: Checking Daily Progress

```javascript
const axios = require('axios');

const token = 'your_jwt_token_here';
const companyId = 1;

const response = await axios.get(
  `http://localhost:3000/api/client/dashboard/daily?companyId=${companyId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const progress = response.data.data;
console.log(`Today's Progress (${progress.date}):`);
console.log(`- Workouts: ${progress.workoutsCompleted}`);
console.log(`- Exercises: ${progress.exercisesCompleted}`);
console.log(`- Duration: ${progress.totalDuration} minutes`);
console.log(`- Calories: ${progress.caloriesBurned} cal`);
```

### Example 4: Frontend Integration (React)

```typescript
import { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardData {
  activePrograms: any[];
  completedWorkouts: number;
  totalExercises: number;
  continueWorkout: any;
  todayWorkouts: any[];
  todayMeals: any[];
  dailyProgress: any;
  recentMeasurements: any[];
  pendingReportsCount: number;
  overallStats: any;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const companyId = localStorage.getItem('companyId');
        
        const response = await axios.get(
          `http://localhost:3000/api/client/dashboard?companyId=${companyId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div className="dashboard">
      {/* Active Programs */}
      <section>
        <h2>Active Programs ({dashboardData.totalPrograms})</h2>
        {dashboardData.activePrograms.map(program => (
          <div key={program.id}>
            <h3>{program.title}</h3>
            <p>Status: {program.status}</p>
          </div>
        ))}
      </section>

      {/* Continue Workout */}
      {dashboardData.hasInProgressWorkout && (
        <section>
          <h2>Continue Workout</h2>
          <button onClick={() => continueWorkout(dashboardData.continueWorkout.sessionId)}>
            Resume: {dashboardData.continueWorkout.workoutTitle}
          </button>
        </section>
      )}

      {/* Workout Stats */}
      <section>
        <h2>Workout Statistics</h2>
        <div>
          <p>Completed: {dashboardData.completedWorkouts}</p>
          <p>Rate: {dashboardData.workoutCompletionRate}%</p>
          <p>This Week: {dashboardData.weeklyWorkouts}</p>
        </div>
      </section>

      {/* Today's Content */}
      <section>
        <h2>Today's Schedule</h2>
        <div>
          <h3>Workouts</h3>
          {dashboardData.todayWorkouts.map(workout => (
            <div key={workout.id}>{workout.title}</div>
          ))}
        </div>
        <div>
          <h3>Meals</h3>
          {dashboardData.todayMeals.map(meal => (
            <div key={meal.id}>{meal.title}</div>
          ))}
        </div>
      </section>

      {/* Daily Progress */}
      <section>
        <h2>Today's Progress</h2>
        <div>
          <p>Workouts: {dashboardData.dailyProgress.workoutsCompleted}</p>
          <p>Exercises: {dashboardData.dailyProgress.exercisesCompleted}</p>
          <p>Duration: {dashboardData.dailyProgress.totalDuration} min</p>
          <p>Calories: {dashboardData.dailyProgress.caloriesBurned} cal</p>
        </div>
      </section>

      {/* Recent Measurements */}
      <section>
        <h2>Recent Measurements ({dashboardData.measurementsCount})</h2>
        {dashboardData.recentMeasurements.map(measurement => (
          <div key={measurement.id}>
            <p>Date: {new Date(measurement.date).toLocaleDateString()}</p>
            <p>Weight: {measurement.measurements.weight}kg</p>
          </div>
        ))}
      </section>

      {/* Pending Reports */}
      {dashboardData.pendingReportsCount > 0 && (
        <section>
          <h2>Pending Reports ({dashboardData.pendingReportsCount})</h2>
          {dashboardData.recentReports.map(report => (
            <div key={report.id}>
              <p>{report.title}</p>
              <button onClick={() => fillReport(report.id)}>Fill Report</button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
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

# Get complete dashboard
echo -e "\n=== Getting complete dashboard ==="
curl -s -X GET "$API_URL/api/client/dashboard?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get weekly overview
echo -e "\n=== Getting weekly overview ==="
curl -s -X GET "$API_URL/api/client/dashboard/weekly?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get active programs
echo -e "\n=== Getting active programs ==="
curl -s -X GET "$API_URL/api/client/dashboard/programs?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get workout statistics
echo -e "\n=== Getting workout statistics ==="
curl -s -X GET "$API_URL/api/client/dashboard/workouts?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq

# Get daily progress
echo -e "\n=== Getting daily progress ==="
curl -s -X GET "$API_URL/api/client/dashboard/daily?companyId=$COMPANY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🔧 Integration with Existing System

### Routes Registration

Already added to `src/server.js`:

```javascript
const clientDashboardRoutes = require('./routes/client/dashboardRoutes');

// Register client dashboard routes
app.use('/api/client/dashboard', clientDashboardRoutes);
```

### File Structure

```
src/
├── controllers/client/
│   └── dashboardController.js       ✅ New
├── services/client/
│   └── dashboardService.js          ✅ New
└── routes/client/
    └── dashboardRoutes.js           ✅ New
```

---

## 📊 Data Sources

The dashboard aggregates data from multiple sources:

| Data Type | Source | Description |
|-----------|--------|-------------|
| **Programs** | `program_assigned` posts | Active programs assigned to client |
| **Workouts** | `workout_session` posts | Workout sessions and completion |
| **Exercises** | `workout_exercise` taxonomy | Exercise data from workouts |
| **Meals** | `nutrition_plan_meal` posts | Meal plans and schedules |
| **Measurements** | `client_measurement` posts | Body measurements |
| **Reports** | `report_response` posts | Progress reports |
| **Progress** | Meta data | Daily and weekly progress tracking |

---

## 🎯 Performance Optimization

### 1. Parallel Queries
All dashboard data is fetched in parallel using `Promise.all()` for optimal performance.

```javascript
const [
  activePrograms,
  workoutStats,
  todayWorkouts,
  inProgressSession,
  recentMeasurements,
  pendingReports,
  dailyProgressData,
  todayMeals
] = await Promise.all([
  getActivePrograms(...),
  getWorkoutStatistics(...),
  getTodayWorkouts(...),
  getInProgressWorkoutSession(...),
  getRecentMeasurements(...),
  getPendingReportsCount(...),
  getDailyProgress(...),
  getTodayMeals(...)
]);
```

### 2. Limited Result Sets
- Active programs: Limited to 5 most recent
- Recent measurements: Limited to last 3
- Pending reports: Limited to 3 most recent
- Today's workouts/meals: Limited to 5 each

### 3. Efficient Database Queries
- Uses indexes on post_type, post_author, post_status
- Separate metadata queries for better performance
- Minimal JOIN operations

---

---

## 📅 How Program Days Are Calculated

The dashboard calculates the current program day based on the **program's start date**, not the day of the week. This allows for flexible program scheduling.

### Calculation Logic

```javascript
// Get program start date from metadata
const startDate = new Date(program.program_start_date);
const today = new Date();

// Calculate days elapsed since program started
const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

// Fetch workouts/meals for this day
const todayWorkouts = getWorkoutsForDay(daysSinceStart);
```

### Example Scenarios

**Scenario 1: Active Program**
- Program start date: `2025-11-20`
- Today's date: `2025-11-27`
- Days elapsed: `7 days`
- Current program day: **Day 8** (7 + 1)
- Shows: Workouts and meals with `day = "8"`

**Scenario 2: Just Started**
- Program start date: `2025-11-27`
- Today's date: `2025-11-27`
- Days elapsed: `0 days`
- Current program day: **Day 1** (0 + 1)
- Shows: Workouts and meals with `day = "1"`

**Scenario 3: Multiple Programs**
- Program A start date: `2025-11-15` → Current day: **Day 13**
- Program B start date: `2025-11-25` → Current day: **Day 3**
- Shows: Workouts from both programs for their respective days

**Scenario 4: Future Program**
- Program start date: `2025-11-30`
- Today's date: `2025-11-27`
- Days elapsed: `-3 days` (negative)
- Current program day: **Skipped** (not shown in today's content)

### Important Notes

1. **Day 1 = Start Date**: The first day of the program is the start date itself
2. **Multi-Program Support**: Each program tracks its own day independently
3. **Future Programs**: Programs with future start dates are automatically excluded
4. **Format Check**: For nutrition plans, only "days" format shows daily meals (not "meals" format which uses meal groups)

---

## ⚠️ Important Notes

### 1. Day Calculation
- Days are calculated based on the **program start date**, not day of week
- **Formula**: `currentDay = (today - programStartDate) + 1`
- **Example**: 
  - Program start date: November 20
  - Today: November 27
  - Current day: Day 8 (7 days elapsed + 1)
- Each program can be on a different day if they have different start dates
- Workouts and meals with matching `day` metadata will show for that program day

### 2. In-Progress Sessions
- Only one in-progress session can exist at a time per user
- Sessions with `post_status = 'in_progress'` are considered resumable
- Completed sessions have `post_status = 'completed'`

### 3. Program Day Calculation
- Each active program tracks its own day based on `program_start_date` metadata
- Multiple programs can be active simultaneously, each on different days
- Programs that haven't started yet (future start date) are skipped
- Only "days" format nutrition plans show today's meals (not "meals" format)

### 4. Calorie Estimation
- Rough estimate: 8 calories per minute of workout
- Should be customized based on actual workout intensity and user metrics
- Consider integrating with more accurate calorie tracking

### 5. Cache Considerations
- Dashboard data changes frequently
- Consider implementing client-side caching with TTL
- Refresh on user interaction or at regular intervals
- Use optimistic updates for better UX

---

## 🔗 Related Documentation

- [Client API Overview](../README.md)
- [Client Programs API](../programs/README.md)
- [Workout Sessions API](../CLIENT-INTERACTIONS.md)
- [Measurements API](../measurements/README.md)
- [Reports API](../reports/README.md)
- [Authentication System](../../02-authentication/README.md)

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Complete Dashboard Endpoint | ✅ Complete | All data in one call |
| Active Programs | ✅ Complete | Limited to 5 recent |
| Workout Statistics | ✅ Complete | With completion rate |
| In-Progress Session | ✅ Complete | Resume workout feature |
| Today's Workouts | ✅ Complete | Based on day of week |
| Today's Meals | ✅ Complete | Based on day of week |
| Daily Progress | ✅ Complete | Real-time tracking |
| Recent Measurements | ✅ Complete | Last 3 measurements |
| Pending Reports | ✅ Complete | Count and recent list |
| Weekly Overview | ✅ Complete | Daily breakdown |
| Overall Statistics | ✅ Complete | Summary of all activities |
| JWT Authentication | ✅ Complete | All endpoints protected |
| Company Authorization | ✅ Complete | UserRelationship validation |
| Multi-tenant Isolation | ✅ Complete | Separate company databases |
| Performance Optimization | ✅ Complete | Parallel queries |

---

## 🚀 Future Enhancements

Potential additions:
- **Monthly Overview**: Extended time period analysis
- **Goals Tracking**: Progress towards set goals
- **Achievements**: Milestone tracking and badges
- **Streak Tracking**: Consecutive days of activity
- **Social Feed**: Activity from connected trainers/friends
- **Recommendations**: AI-powered workout/meal suggestions
- **Calendar View**: Visual calendar of scheduled activities
- **Progress Charts**: Visual graphs of progress over time
- **Nutrition Tracking**: Calorie and macro tracking
- **Hydration Tracking**: Water intake monitoring
- **Sleep Tracking**: Sleep quality and duration
- **Mood Tracking**: Emotional wellbeing tracking

---

**Last Updated:** November 27, 2025  
**Version:** 1.0  
**Maintained By:** Development Team

