import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import {
  fetchMeasurementTemplates,
  submitMeasurement,
  fetchMeasurementHistory,
  fetchMeasurementById,
  fetchFieldProgress,
} from '@/features/measurements/measurements-thunks';
import {
  selectMeasurementTemplates,
  selectTemplatesLoading,
  selectTemplatesError,
  selectMeasurementHistory,
  selectHistoryLoading,
  selectHistoryError,
  selectHistoryPagination,
  selectSelectedMeasurement,
  selectSelectedMeasurementLoading,
  selectSelectedMeasurementError,
  selectFieldProgress,
  selectFieldProgressLoading,
  selectFieldProgressError,
  selectSubmitting,
  selectSubmitError,
} from '@/features/measurements/measurements-selectors';
import type { SubmitMeasurementPayload } from '@/types/measurements';

/**
 * Hook for Measurements Data Management
 */
export const useMeasurements = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const templates = useSelector(selectMeasurementTemplates);
  const templatesLoading = useSelector(selectTemplatesLoading);
  const templatesError = useSelector(selectTemplatesError);

  const history = useSelector(selectMeasurementHistory);
  const historyLoading = useSelector(selectHistoryLoading);
  const historyError = useSelector(selectHistoryError);
  const historyPagination = useSelector(selectHistoryPagination);

  const selectedMeasurement = useSelector(selectSelectedMeasurement);
  const selectedMeasurementLoading = useSelector(selectSelectedMeasurementLoading);
  const selectedMeasurementError = useSelector(selectSelectedMeasurementError);

  const fieldProgress = useSelector(selectFieldProgress);
  const fieldProgressLoading = useSelector(selectFieldProgressLoading);
  const fieldProgressError = useSelector(selectFieldProgressError);

  const submitting = useSelector(selectSubmitting);
  const submitError = useSelector(selectSubmitError);

  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  // Fetch templates
  const loadTemplates = useCallback(async () => {
    if (!selectedCompanyId) return;
    
    const companyId = parseInt(selectedCompanyId, 10);
    if (isNaN(companyId)) return;

    try {
      await dispatch(fetchMeasurementTemplates(companyId)).unwrap();
    } catch (error: any) {
      console.error('❌ Failed to fetch measurement templates:', error);
    }
  }, [dispatch, selectedCompanyId]);

  // Submit measurement
  const submitNewMeasurement = useCallback(
    async (payload: SubmitMeasurementPayload) => {
      try {
        const result = await dispatch(submitMeasurement(payload)).unwrap();
        return result;
      } catch (error: any) {
        console.error('❌ Failed to submit measurement:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Fetch history
  const loadHistory = useCallback(
    async (params?: {
      templateId?: number;
      startDate?: string;
      endDate?: string;
      limit?: number;
      offset?: number;
    }) => {
      if (!selectedCompanyId) return;

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) return;

      try {
        await dispatch(
          fetchMeasurementHistory({
            companyId,
            ...params,
          })
        ).unwrap();
      } catch (error: any) {
        console.error('❌ Failed to fetch measurement history:', error);
      }
    },
    [dispatch, selectedCompanyId]
  );

  // Fetch measurement by ID
  const loadMeasurementById = useCallback(
    async (measurementId: number) => {
      if (!selectedCompanyId) return;

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) return;

      try {
        await dispatch(fetchMeasurementById({ measurementId, companyId })).unwrap();
      } catch (error: any) {
        console.error('❌ Failed to fetch measurement by ID:', error);
      }
    },
    [dispatch, selectedCompanyId]
  );

  // Fetch field progress
  const loadFieldProgress = useCallback(
    async (
      fieldName: string,
      params?: {
        startDate?: string;
        endDate?: string;
      }
    ) => {
      if (!selectedCompanyId) return;

      const companyId = parseInt(selectedCompanyId, 10);
      if (isNaN(companyId)) return;

      try {
        await dispatch(
          fetchFieldProgress({
            fieldName,
            params: {
              companyId,
              ...params,
            },
          })
        ).unwrap();
      } catch (error: any) {
        console.error('❌ Failed to fetch field progress:', error);
      }
    },
    [dispatch, selectedCompanyId]
  );

  // Auto-fetch templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    // Templates
    templates,
    templatesLoading,
    templatesError,
    loadTemplates,

    // History
    history,
    historyLoading,
    historyError,
    historyPagination,
    loadHistory,

    // Selected measurement
    selectedMeasurement,
    selectedMeasurementLoading,
    selectedMeasurementError,
    loadMeasurementById,

    // Field progress
    fieldProgress,
    fieldProgressLoading,
    fieldProgressError,
    loadFieldProgress,

    // Submit
    submitting,
    submitError,
    submitNewMeasurement,
  };
};

