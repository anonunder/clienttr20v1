import { Play, FileText, Ruler, ChevronRight, Heart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { DashboardStats } from "@/components/dashboard/DashboardStats/DashboardStats";
import { TodayExercises } from "@/components/dashboard/TodayExercises/TodayExercises";
import { TodayMeals } from "@/components/dashboard/TodayMeals/TodayMeals";
import { DailyProgress } from "@/components/dashboard/DailyProgress/DailyProgress";

const Index = () => {
  const navigate = useNavigate();

  const todayGoals = [
    { name: "Today's Exercise Time", current: 22, target: 30, unit: "min" },
    { name: "Daily Steps", current: 5832, target: 10000, unit: "steps" },
    { name: "Completed Goals", current: 3, target: 5, unit: "goals" },
  ];

  // Continue section - incomplete workouts
  const continueWorkout = {
    name: "Upper Body Strength",
    progress: 60,
    lastExercise: "Dumbbell Shoulder Press",
    planId: "1",
    workoutId: "1",
    exerciseId: "2"
  };

  // Today's exercises
  const todaysExercises = [
    { id: "1", name: "Dumbbell Shoulder Press", sets: 3, reps: 12, completed: true },
    { id: "2", name: "Barbell Squats", sets: 4, reps: 10, completed: false },
    { id: "3", name: "Bench Press", sets: 3, reps: 8, completed: false },
  ];

  // Today's meal
  const todaysMeal = {
    breakfast: { name: "Breakfast", description: "Oatmeal with Berries", calories: 350 },
    lunch: { name: "Lunch", description: "Grilled Chicken Salad", calories: 450 },
    dinner: { name: "Dinner", description: "Not logged yet", calories: 0 },
    totalCalories: 800,
    targetCalories: 2100
  };

  // Recent reports
  const recentReports = [
    { id: "1", name: "Weekly Progress", date: "2025-10-20", type: "Progress" },
    { id: "2", name: "Body Composition", date: "2025-10-15", type: "Measurements" },
    { id: "3", name: "Nutrition Summary", date: "2025-10-12", type: "Nutrition" },
  ];

  // Measurements overview
  const measurements = [
    { label: "Weight", value: "75.2", unit: "kg", change: "-0.5", trend: "down" },
    { label: "Body Fat", value: "18.5", unit: "%", change: "-1.2", trend: "down" },
    { label: "Muscle Mass", value: "61.3", unit: "kg", change: "+0.8", trend: "up" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" description="Manage your fitness journey and track progress" />
      
      <div className="container px-4 py-8 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Stats Grid */}
          <DashboardStats />

          {/* Quick Action - Favorites */}
          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/favorites')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  <h3 className="text-lg font-semibold text-foreground">Favorites</h3>
                </div>
                <p className="text-sm text-muted-foreground">Access your favorite workouts & nutrition plans</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </div>
          </Card>

          {/* Continue Section */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Continue Workout</h3>
                </div>
                <p className="text-foreground font-medium">{continueWorkout.name}</p>
                <p className="text-sm text-muted-foreground">Last: {continueWorkout.lastExercise}</p>
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-medium">{continueWorkout.progress}%</span>
                  </div>
                  <Progress value={continueWorkout.progress} className="h-2" />
                </div>
              </div>
              <Button 
                size="lg" 
                className="ml-4"
                onClick={() => navigate(`/programs/training/${continueWorkout.planId}/workout/${continueWorkout.workoutId}`, {
                  state: { highlightExerciseId: continueWorkout.exerciseId }
                })}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Today's Exercises */}
            <TodayExercises exercises={todaysExercises} />

            {/* Today's Meal */}
            <TodayMeals
              breakfast={todaysMeal.breakfast}
              lunch={todaysMeal.lunch}
              dinner={todaysMeal.dinner}
              totalCalories={todaysMeal.totalCalories}
              targetCalories={todaysMeal.targetCalories}
            />
          </div>

          {/* Progress Section */}
          <DailyProgress goals={todayGoals} />

          <div className="grid lg:grid-cols-2 gap-6">
          {/* Measurements Overview */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Measurements</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/progress')}>
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {measurements.map((measurement) => (
                <div key={measurement.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div>
                    <p className="text-sm text-muted-foreground">{measurement.label}</p>
                    <p className="text-xl font-bold text-foreground">
                      {measurement.value} <span className="text-sm font-normal">{measurement.unit}</span>
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded ${
                    measurement.trend === 'down' ? 'bg-success/20 text-success' : 'bg-info/20 text-info'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ${measurement.trend === 'down' ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-medium">{measurement.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Reports */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/progress')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {recentReports.map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/progress')}
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">{report.type}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          </div>

          {/* Daily Goal Card */}
          <Card className="bg-gradient-to-br from-card to-secondary border-border p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Daily Goal</h3>
                <p className="text-muted-foreground">Do 3-5 exercises you haven't done today</p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => navigate('/programs/training')}>
                Try a 6-min cardio workout today
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;