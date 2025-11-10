import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchRecipeDetail } from '@/features/programs/programs-thunks';
import {
  selectRecipeDetail,
  selectRecipeDetailLoading,
  selectRecipeDetailError,
} from '@/features/programs/programs-selectors';

export const useRecipeDetail = (programId: number | string, recipeId: number | string) => {
  const dispatch = useDispatch<AppDispatch>();

  const recipeDetail = useSelector(selectRecipeDetail);
  const loading = useSelector(selectRecipeDetailLoading);
  const error = useSelector(selectRecipeDetailError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId || !programId || !recipeId) {
      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    const progId = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    const recId = typeof recipeId === 'string' ? parseInt(recipeId, 10) : recipeId;
    
    if (isNaN(companyId) || isNaN(progId) || isNaN(recId)) {
      console.error('Invalid IDs:', { 
        selectedCompanyId, 
        programId,
        recipeId,
        parsedCompanyId: companyId,
        parsedProgramId: progId,
        parsedRecipeId: recId,
      });
      return;
    }
    
    console.log('🔍 Fetching recipe detail:', { programId: progId, recipeId: recId, companyId });
    
    try {
      await dispatch(fetchRecipeDetail({ programId: progId, recipeId: recId, companyId })).unwrap();
      console.log('✅ Recipe detail fetched successfully');
    } catch (error: any) {
      console.error('❌ Failed to fetch recipe detail:', error);
      console.error('Request details:', { programId: progId, recipeId: recId, companyId, errorMessage: error?.message });
      throw error;
    }
  }, [dispatch, selectedCompanyId, programId, recipeId]);

  useEffect(() => {
    if (selectedCompanyId && programId && recipeId) {
      fetchDetail();
    }
  }, [fetchDetail, selectedCompanyId, programId, recipeId]);

  return {
    recipeDetail,
    loading,
    error,
    fetchDetail,
  };
};

