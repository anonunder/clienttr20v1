import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchTrainingPlan } from '@/features/programs/programs-thunks';
import {
  selectTrainingPlan,
  selectTrainingPlanLoading,
  selectTrainingPlanError,
} from '@/features/programs/programs-selectors';

/**
 * Hook for Training Plan Data Management
 */
export const useTrainingPlan = (programId: number | string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const trainingPlan = useSelector(selectTrainingPlan);
  const loading = useSelector(selectTrainingPlanLoading);
  const error = useSelector(selectTrainingPlanError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  // Fetch training plan detail
  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId || !programId) {

      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    const id = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    
    if (isNaN(companyId) || isNaN(id)) {
      console.error('Invalid company ID or program ID:', { 
        selectedCompanyId, 
        programId,
        parsedCompanyId: companyId,
        parsedProgramId: id,
      });
      return;
    }
    
    console.log('🔍 Fetching training plan:', { programId: id, companyId });
    
    try {
      await dispatch(fetchTrainingPlan({ programId: id, companyId })).unwrap();
      console.log('✅ Training plan fetched successfully');
    } catch (error: any) {
      console.error('❌ Failed to fetch training plan:', error);
      console.error('Request details:', { programId: id, companyId, errorMessage: error?.message });
      throw error;
    }
  }, [dispatch, selectedCompanyId, programId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (selectedCompanyId && programId) {
      fetchDetail();
    }
  }, [selectedCompanyId, programId, fetchDetail]);

  return {
    trainingPlan,
    loading,
    error,
    fetchDetail,
  };
};

