import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

/**
 * Get the user's role for the currently selected company
 */
export const useUserRole = (): string | null => {
  const user = useSelector((state: RootState) => state.auth.user);
  const selectedCompanyId = useSelector((state: RootState) => state.auth.selectedCompanyId);

  if (!user?.relationships || !selectedCompanyId) {
    return null;
  }

  const relationship = user.relationships.find(
    (rel) => rel.company_id === selectedCompanyId
  );

  return relationship?.role || null;
};

