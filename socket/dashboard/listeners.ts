import { AppDispatch } from '@/state/store';
import { socketService } from '@/socket/socket-service';
import { DASHBOARD_LISTEN_EVENTS } from './events';
import {
  ExerciseCompletedPayload,
  ExerciseStartedPayload,
  WorkoutProgressPayload,
  WorkoutCompletedPayload,
  MealLoggedPayload,
  MealUpdatedPayload,
  GoalProgressPayload,
  GoalCompletedPayload,
  StatsUpdatedPayload,
  MeasurementAddedPayload,
  ReportGeneratedPayload,
  DataRefreshPayload,
  SocketEventCallback,
} from './types';
import {
  updateExerciseCompletion,
  updateWorkoutProgress,
  updateMealLog,
  updateGoalProgress,
  updateStats,
  addMeasurement,
  addReport,
} from '@/features/dashboard/dashboard-slice';
import { fetchDashboardData } from '@/features/dashboard/dashboard-thunks';

/**
 * Dashboard Socket Listeners
 * Manages all incoming socket events for dashboard
 */

class DashboardSocketListeners {
  private activeListeners: Map<string, SocketEventCallback> = new Map();
  private dispatch: AppDispatch | null = null;

  /**
   * Initialize listeners with Redux dispatch
   */
  public initialize(dispatch: AppDispatch): void {
    this.dispatch = dispatch;
    console.log('✅ Dashboard socket listeners initialized');
  }

  /**
   * Register a single listener
   */
  private registerListener<T>(
    event: string,
    callback: SocketEventCallback<T>
  ): void {
    const socket = socketService.getSocket();
    if (!socket) {
      console.warn(`Cannot register listener for ${event}: socket not connected`);
      return;
    }

    // Remove existing listener if any
    if (this.activeListeners.has(event)) {
      socket.off(event, this.activeListeners.get(event));
    }

    // Register new listener
    socket.on(event, callback);
    this.activeListeners.set(event, callback);

  }

  /**
   * Register all dashboard listeners
   */
  public registerAll(): void {
    if (!this.dispatch) {
      console.error('Dispatch not initialized. Call initialize() first.');
      return;
    }

    // Exercise listeners
    this.registerListener<ExerciseCompletedPayload>(
      DASHBOARD_LISTEN_EVENTS.EXERCISE_COMPLETED,
      (payload) => {
        console.log('📊 Exercise completed:', payload);
        this.dispatch!(updateExerciseCompletion({
          exerciseId: payload.exerciseId,
          completed: payload.completed,
        }));
      }
    );

    this.registerListener<ExerciseStartedPayload>(
      DASHBOARD_LISTEN_EVENTS.EXERCISE_STARTED,
      (payload) => {
        console.log('🏋️ Exercise started:', payload);
      }
    );

    // Workout listeners
    this.registerListener<WorkoutProgressPayload>(
      DASHBOARD_LISTEN_EVENTS.WORKOUT_PROGRESS,
      (payload) => {
        console.log('📈 Workout progress:', payload);
        this.dispatch!(updateWorkoutProgress({
          workoutId: payload.workoutId,
          progress: payload.progress,
        }));
      }
    );

    this.registerListener<WorkoutCompletedPayload>(
      DASHBOARD_LISTEN_EVENTS.WORKOUT_COMPLETED,
      (payload) => {
        console.log('✅ Workout completed:', payload);
      }
    );

    // Meal listeners
    this.registerListener<MealLoggedPayload>(
      DASHBOARD_LISTEN_EVENTS.MEAL_LOGGED,
      (payload) => {
        console.log('🍽️ Meal logged:', payload);
        // Only update if it's a main meal (breakfast, lunch, dinner)
        // Skip snacks for now as they're not in the current data structure
        if (payload.mealType !== 'snack') {
          this.dispatch!(updateMealLog({
            mealType: payload.mealType,
            data: payload.meal,
          }));
        }
      }
    );

    this.registerListener<MealUpdatedPayload>(
      DASHBOARD_LISTEN_EVENTS.MEAL_UPDATED,
      (payload) => {
        console.log('🍽️ Meal updated:', payload);
        // Only update if it's a main meal (breakfast, lunch, dinner)
        // Skip snacks for now as they're not in the current data structure
        if (payload.mealType !== 'snack') {
          this.dispatch!(updateMealLog({
            mealType: payload.mealType,
            data: payload.updates,
          }));
        }
      }
    );

    // Goal listeners
    this.registerListener<GoalProgressPayload>(
      DASHBOARD_LISTEN_EVENTS.GOAL_PROGRESS,
      (payload) => {
        console.log('🎯 Goal progress:', payload);
        this.dispatch!(updateGoalProgress({
          goalId: payload.goalId,
          goalName: payload.goalName,
          current: payload.current,
        }));
      }
    );

    this.registerListener<GoalCompletedPayload>(
      DASHBOARD_LISTEN_EVENTS.GOAL_COMPLETED,
      (payload) => {
        console.log('🎉 Goal completed:', payload);
      }
    );

    // Stats listeners
    this.registerListener<StatsUpdatedPayload>(
      DASHBOARD_LISTEN_EVENTS.STATS_UPDATED,
      (payload) => {
        this.dispatch!(updateStats(payload.stats));
      }
    );

    // Measurement listeners
    this.registerListener<MeasurementAddedPayload>(
      DASHBOARD_LISTEN_EVENTS.MEASUREMENT_ADDED,
      (payload) => {
        this.dispatch!(addMeasurement(payload.measurement));
      }
    );

    // Report listeners
    this.registerListener<ReportGeneratedPayload>(
      DASHBOARD_LISTEN_EVENTS.REPORT_GENERATED,
      (payload) => {
        this.dispatch!(addReport(payload.report));
      }
    );

    // Data refresh listener
    this.registerListener<DataRefreshPayload>(
      DASHBOARD_LISTEN_EVENTS.DATA_REFRESH,
      (payload) => {
        this.dispatch!(fetchDashboardData());
      }
    );

  }

  /**
   * Unregister all listeners
   */
  public unregisterAll(): void {
    const socket = socketService.getSocket();
    if (!socket) return;

    this.activeListeners.forEach((callback, event) => {
      socket.off(event, callback);
    });

    this.activeListeners.clear();
  }

  /**
   * Get active listeners count
   */
  public getActiveListenersCount(): number {
    return this.activeListeners.size;
  }

  /**
   * Get active listener events
   */
  public getActiveEvents(): string[] {
    return Array.from(this.activeListeners.keys());
  }
}

// Export singleton instance
export const dashboardListeners = new DashboardSocketListeners();

