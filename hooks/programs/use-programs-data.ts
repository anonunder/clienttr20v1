import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { fetchProgramsList } from '@/features/programs/programs-thunks';
import {
  selectPrograms,
  selectProgramsLoading,
  selectProgramsError,
} from '@/features/programs/programs-selectors';

/**
 * Hook for Programs Data Management
 * Follows the dashboard pattern for consistency
 */
export const useProgramsData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Redux selectors
  const programs = useSelector(selectPrograms);
  const loading = useSelector(selectProgramsLoading);
  const error = useSelector(selectProgramsError);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  // Initialize programs - clean async function
  const initializePrograms = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId) {
      console.warn('Cannot initialize programs: No company selected');
      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    if (isNaN(companyId)) {
      console.error('Invalid company ID:', selectedCompanyId);
      return;
    }
    setIsInitializing((prev) => {
      if (prev) {
        console.log('⏭️ Skipping initialization - already in progress');
        return prev;
      }
      return true;
    });
    
    try {
      await dispatch(fetchProgramsList(companyId)).unwrap();
      console.log('✅ Programs initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize programs:', error);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [dispatch, selectedCompanyId]);

  // Refresh function for pull-to-refresh
  const refresh = useCallback(async (): Promise<void> => {
    if (!selectedCompanyId) {
      console.warn('Cannot refresh programs: No company selected');
      return;
    }
    const companyId = parseInt(selectedCompanyId, 10);
    if (isNaN(companyId)) {
      console.error('Invalid company ID:', selectedCompanyId);
      return;
    }
    setIsRefreshing(true);
    try {
      await dispatch(fetchProgramsList(companyId)).unwrap();
      console.log('✅ Programs refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh programs:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, selectedCompanyId]);

  return {
    programs,
    loading,
    isRefreshing,
    isInitializing,
    error,
    initializePrograms,
    refresh,
  };
};

