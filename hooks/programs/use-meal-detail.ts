import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchMealDetail } from '@/features/programs/programs-thunks';
import {
  selectMealDetail,
  selectMealDetailLoading,
  selectMealDetailError,
} from '@/features/programs/programs-selectors';

export const useMealDetail = (programId: number | string, mealId: number | string) => {
  const dispatch = useDispatch<AppDispatch>();

  const mealDetail = useSelector(selectMealDetail);
  const loading = useSelector(selectMealDetailLoading);
  const error = useSelector(selectMealDetailError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId || !programId || !mealId) {
      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    const progId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    const mlId = typeof mealId === 'string' ? parseInt(mealId, 10) : mealId;
    
    if (isNaN(companyId) || isNaN(progId) || isNaN(mlId)) {
      console.error('Invalid IDs:', { 
        selectedCompanyId, 
        programId,
        mealId,
        parsedCompanyId: companyId,
        parsedProgramId: progId,
        parsedMealId: mlId,
      });
      return;
    }
    
    console.log('🔍 Fetching meal detail:', { programId: progId, mealId: mlId, companyId });
    
    try {
      await dispatch(fetchMealDetail({ programId: progId, mealId: mlId, companyId })).unwrap();
      console.log('✅ Meal detail fetched successfully');
    } catch (error: any) {
      console.error('❌ Failed to fetch meal detail:', error);
      console.error('Request details:', { programId: progId, mealId: mlId, companyId, errorMessage: error?.message });
      throw error;
    }
  }, [dispatch, selectedCompanyId, programId, mealId]);

  useEffect(() => {
    if (selectedCompanyId && programId && mealId) {
      fetchDetail();
    }
  }, [fetchDetail, selectedCompanyId, programId, mealId]);

  return {
    mealDetail,
    loading,
    error,
    fetchDetail,
  };
};

