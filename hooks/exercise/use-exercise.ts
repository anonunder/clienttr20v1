import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/state/store';
import { 
  selectExerciseDetail, 
  selectExerciseLoading, 
  selectExerciseError 
} from '@/features/exercise/exercise-selectors';
import { fetchExerciseDetail } from '@/features/exercise/exercise-thunks';
import { clearExercise } from '@/features/exercise/exercise-slice';

export const useExercise = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const exerciseDetail = useSelector(selectExerciseDetail);
  const loading = useSelector(selectExerciseLoading);
  const error = useSelector(selectExerciseError);

  const loadExercise = useCallback(async (
    programId: number,
    workoutId: number,
    exerciseId: number,
    companyId: number
  ) => {
    await dispatch(fetchExerciseDetail({ 
      programId, 
      workoutId, 
      exerciseId, 
      companyId 
    })).unwrap();
  }, [dispatch]);

  const clear = useCallback(() => {
    dispatch(clearExercise());
  }, [dispatch]);

  return {
    exerciseDetail,
    loading,
    error,
    loadExercise,
    clear,
  };
};

