import { RootState } from '@/state/store';

export const selectPrograms = (state: RootState) => state.programs?.programs || [];
export const selectProgramsLoading = (state: RootState) => state.programs?.loading || false;
export const selectProgramsError = (state: RootState) => state.programs?.error || null;
export const selectProgramsLastUpdated = (state: RootState) => state.programs?.lastUpdated || null;

export const selectProgramDetail = (state: RootState) => state.programs?.programDetail || null;
export const selectProgramDetailLoading = (state: RootState) => state.programs?.detailLoading || false;
export const selectProgramDetailError = (state: RootState) => state.programs?.detailError || null;

