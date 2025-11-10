import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchNutritionPlan } from '@/features/programs/programs-thunks';
import {
  selectNutritionPlan,
  selectNutritionPlanLoading,
  selectNutritionPlanError,
} from '@/features/programs/programs-selectors';

/**
 * Hook for Nutrition Plan Data Management
 */
export const useNutritionPlan = (programId: number | string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const nutritionPlan = useSelector(selectNutritionPlan);
  const loading = useSelector(selectNutritionPlanLoading);
  const error = useSelector(selectNutritionPlanError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  // Fetch nutrition plan detail
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
    
    console.log('🔍 Fetching nutrition plan:', { programId: id, companyId });
    
    try {
      const result = await dispatch(fetchNutritionPlan({ programId: id, companyId })).unwrap();
      console.log('✅ Nutrition plan fetched successfully. Has program?', !!result.program, result);
    } catch (error: any) {
      console.error('❌ Failed to fetch nutrition plan:', error);
      console.error('Request details:', { programId: id, companyId, errorMessage: error?.message });
      throw error;
    }
  }, [dispatch, selectedCompanyId, programId]);

  // Auto-fetch on mount
  useEffect(() => {
    if (selectedCompanyId && programId) {
      fetchDetail();
    }
  }, [fetchDetail, selectedCompanyId, programId]);

  return {
    nutritionPlan,
    loading,
    error,
    fetchDetail,
  };
};
