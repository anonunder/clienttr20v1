import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api-client';
import { endpoints } from '../services/api-client/endpoints';
import { TrainingPlanSchema } from '../services/api-client/zod-schemas';
import type { TrainingPlan } from '../types/domain';

export function usePlans(page = 1) {
  return useQuery({
    queryKey: ['plans', page],
    queryFn: async () => {
      const response = await api<TrainingPlan[]>(endpoints.plans.list(page));
      return response.map(plan => TrainingPlanSchema.parse(plan));
    },
    staleTime: 60_000,
  });
}

export function usePlanById(id: string) {
  return useQuery({
    queryKey: ['plan', id],
    queryFn: async () => {
      const response = await api<TrainingPlan>(endpoints.plans.byId(id));
      return TrainingPlanSchema.parse(response);
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

