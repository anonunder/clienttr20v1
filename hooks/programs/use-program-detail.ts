import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchProgramDetail } from '@/features/programs/programs-thunks';
import {
  selectProgramDetail,
  selectProgramDetailLoading,
  selectProgramDetailError,
} from '@/features/programs/programs-selectors';

/**
 * Hook for Program Detail Data Management
 */
export const useProgramDetail = (programId: number | string) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const programDetail = useSelector(selectProgramDetail);
  const loading = useSelector(selectProgramDetailLoading);
  const error = useSelector(selectProgramDetailError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  // Fetch program detail
  const fetchDetail = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId || !programId) {
      console.warn('Cannot fetch program detail: Missing companyId or programId');
      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    const id = typeof programId === 'string' ? parseInt(programId, 10) : programId;
    
    if (isNaN(companyId) || isNaN(id)) {
      console.error('Invalid company ID or program ID:', { selectedCompanyId, programId });
      return;
    }
    
    try {
      await dispatch(fetchProgramDetail({ id, companyId })).unwrap();
      console.log('✅ Program detail fetched successfully');
    } catch (error) {
      console.error('❌ Failed to fetch program detail:', error);
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
    programDetail,
    loading,
    error,
    fetchDetail,
  };
};

