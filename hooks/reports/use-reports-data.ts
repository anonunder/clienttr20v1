import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {
  fetchPendingReports,
  fetchCompletedReports,
  fetchReportDetail,
  submitReportResponse,
} from '@/features/reports/reports-thunks';
import {
  selectPendingReports,
  selectCompletedReports,
  selectSelectedReport,
  selectLoadingPending,
  selectLoadingCompleted,
  selectLoadingDetail,
  selectSubmitting,
  selectError,
  selectSubmitError,
  selectIsInitialized,
  selectPendingReportsCount,
} from '@/features/reports/reports-selectors';
import { clearSelectedReport, clearSubmitError } from '@/features/reports/reports-slice';
import type { ReportResponse } from '@/features/reports/reports-slice';

/**
 * Hook for Reports Data Management
 * Follows the programs/dashboard pattern for consistency
 */
export const useReportsData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Redux selectors
  const pendingReports = useSelector(selectPendingReports);
  const completedReports = useSelector(selectCompletedReports);
  const selectedReport = useSelector(selectSelectedReport);
  const loadingPending = useSelector(selectLoadingPending);
  const loadingCompleted = useSelector(selectLoadingCompleted);
  const loadingDetail = useSelector(selectLoadingDetail);
  const submitting = useSelector(selectSubmitting);
  const error = useSelector(selectError);
  const submitError = useSelector(selectSubmitError);
  const isInitialized = useSelector(selectIsInitialized);
  const pendingCount = useSelector(selectPendingReportsCount);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  /**
   * Initialize reports data - fetch both pending and completed reports
   */
  const initializeReports = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId) {
      console.warn('Cannot initialize reports: No company selected');
      return;
    }

    const companyId = parseInt(selectedCompanyId, 10);
    if (isNaN(companyId)) {
      console.error('Invalid company ID:', selectedCompanyId);
      return;
    }

    setIsInitializing((prev) => {
      if (prev) {
        console.log('⏭️ Skipping reports initialization - already in progress');
        return prev;
      }
      return true;
    });

    try {
      // Fetch both pending and completed reports in parallel
      await Promise.all([
        dispatch(fetchPendingReports(companyId)).unwrap(),
        dispatch(fetchCompletedReports({ companyId, limit: 10 })).unwrap(),
      ]);
    } catch (error) {
      console.error('❌ Failed to initialize reports:', error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [dispatch, selectedCompanyId]);

  /**
   * Refresh reports data (for pull-to-refresh)
   */
  const refresh = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId) {
      console.warn('Cannot refresh reports: No company selected');
      return;
    }

    const companyId = parseInt(selectedCompanyId, 10);
    if (isNaN(companyId)) {
      console.error('Invalid company ID:', selectedCompanyId);
      return;
    }

    setIsRefreshing(true);

    try {
      await Promise.all([
        dispatch(fetchPendingReports(companyId)).unwrap(),
        dispatch(fetchCompletedReports({ companyId, limit: 10 })).unwrap(),
      ]);
    } catch (error) {
      console.error('❌ Failed to refresh reports:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, selectedCompanyId]);

  /**
   * Load more completed reports (pagination)
   */
  const loadMoreCompleted = useCallback(
    async (offset: number): Promise<void> => {
      if (!selectedCompanyId) return;

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) return;

      try {
        await dispatch(
          fetchCompletedReports({ companyId, limit: 10, offset })
        ).unwrap();
      } catch (error) {
        console.error('❌ Failed to load more completed reports:', error);
        throw error;
      }
    },
    [dispatch, selectedCompanyId]
  );

  /**
   * Select and load report detail
   */
  const selectReport = useCallback(
    async (responseId: number): Promise<void> => {
      if (!selectedCompanyId) return;

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) return;

      try {
        await dispatch(fetchReportDetail({ responseId, companyId })).unwrap();
      } catch (error) {
        console.error('❌ Failed to load report detail:', error);
        throw error;
      }
    },
    [dispatch, selectedCompanyId]
  );

  /**
   * Submit report response
   */
  const submitReport = useCallback(
    async (
      responseId: number,
      responses: ReportResponse[],
      measurements?: Record<string, string>,
      images?: { uri: string; base64?: string; fileName?: string; mimeType?: string }[],
      status?: 'draft' | 'completed'
    ): Promise<void> => {
      if (!selectedCompanyId) {
        throw new Error('No company selected');
      }

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) {
        throw new Error('Invalid company ID');
      }

      try {
        await dispatch(
          submitReportResponse({
            responseId,
            companyId,
            responses,
            measurements,
            images,
            status,
          })
        ).unwrap();
      } catch (error) {
        console.error('❌ Failed to submit report:', error);
        throw error;
      }
    },
    [dispatch, selectedCompanyId]
  );

  /**
   * Clear selected report
   */
  const clearReport = useCallback(() => {
    dispatch(clearSelectedReport());
  }, [dispatch]);

  /**
   * Clear submit error
   */
  const clearError = useCallback(() => {
    dispatch(clearSubmitError());
  }, [dispatch]);

  return {
    // Data
    pendingReports,
    completedReports,
    selectedReport,
    pendingCount,

    // Loading states
    loading: loadingPending || loadingCompleted,
    loadingPending,
    loadingCompleted,
    loadingDetail,
    submitting,
    isRefreshing,
    isInitializing,
    isInitialized,

    // Errors
    error,
    submitError,

    // Actions
    initializeReports,
    refresh,
    loadMoreCompleted,
    selectReport,
    submitReport,
    clearReport,
    clearError,
  };
};

