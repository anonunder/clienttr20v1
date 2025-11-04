import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { useSocketReady } from '@/hooks/use-socket-ready';
import {
  dashboardEmitters,
  dashboardListeners,
  MarkExerciseCompletePayload,
  MarkGoalCompletePayload,
  SyncDataPayload,
} from '@/socket/dashboard';

/**
 * Hook for Dashboard Socket Operations
 * Manages socket listeners and emitters for dashboard
 */
export const useDashboardSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketStatus = useSocketReady();
  const [listenersRegistered, setListenersRegistered] = useState(false);

  // Initialize and register listeners when socket is ready
  useEffect(() => {
    if (!socketStatus.isReady) {
      setListenersRegistered(false);
      return;
    }

    console.log('🔌 Initializing dashboard socket...');

    // Initialize listeners with dispatch
    dashboardListeners.initialize(dispatch);

    // Register all dashboard listeners
    dashboardListeners.registerAll();
    setListenersRegistered(true);

    // Join dashboard room
    dashboardEmitters.joinDashboard(socketStatus.userId!);

    // Cleanup on unmount
    return () => {
      console.log('🔌 Cleaning up dashboard socket...');
      dashboardEmitters.leaveDashboard(socketStatus.userId!);
      dashboardListeners.unregisterAll();
      setListenersRegistered(false);
    };
  }, [socketStatus.isReady, socketStatus.userId, dispatch]);

  // Emitter methods with ready check
  const requestStats = useCallback(() => {
    if (!socketStatus.isReady) {
      console.warn('Cannot request stats: socket not ready');
      return;
    }
    dashboardEmitters.requestStats(socketStatus.userId!);
  }, [socketStatus.isReady, socketStatus.userId]);

  const requestExercises = useCallback(() => {
    if (!socketStatus.isReady) return;
    dashboardEmitters.requestExercises(socketStatus.userId!);
  }, [socketStatus.isReady, socketStatus.userId]);

  const requestMeals = useCallback(() => {
    if (!socketStatus.isReady) return;
    dashboardEmitters.requestMeals(socketStatus.userId!);
  }, [socketStatus.isReady, socketStatus.userId]);

  const requestGoals = useCallback(() => {
    if (!socketStatus.isReady) return;
    dashboardEmitters.requestGoals(socketStatus.userId!);
  }, [socketStatus.isReady, socketStatus.userId]);

  const markExerciseComplete = useCallback((data: MarkExerciseCompletePayload) => {
    if (!socketStatus.isReady) {
      console.warn('Cannot mark exercise: socket not ready');
      return;
    }
    dashboardEmitters.markExerciseComplete(data);
  }, [socketStatus.isReady]);

  const markGoalComplete = useCallback((data: MarkGoalCompletePayload) => {
    if (!socketStatus.isReady) return;
    dashboardEmitters.markGoalComplete(data);
  }, [socketStatus.isReady]);

  const syncData = useCallback((data?: SyncDataPayload) => {
    if (!socketStatus.isReady) return;
    dashboardEmitters.syncData(data || {});
  }, [socketStatus.isReady]);

  const getEmitQueueStatus = useCallback(() => {
    return dashboardEmitters.getQueueStatus();
  }, []);

  return {
    // Connection status (from centralized check)
    ...socketStatus,
    listenersRegistered,
    listenersCount: listenersRegistered ? dashboardListeners.getActiveListenersCount() : 0,

    // Request methods
    requestStats,
    requestExercises,
    requestMeals,
    requestGoals,

    // Action methods
    markExerciseComplete,
    markGoalComplete,
    syncData,

    // Utility methods
    getEmitQueueStatus,
  };
};

