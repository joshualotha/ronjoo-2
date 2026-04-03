/**
 * Shared React Query hooks for admin CRUD operations.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdmin } from '../context/AdminContext';

type CrudApi<T = any> = {
  list: (params?: Record<string, string>) => Promise<T[]>;
  show: (id: number | string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number | string, data: Partial<T>) => Promise<T>;
  destroy: (id: number | string) => Promise<any>;
};

/**
 * Returns useQuery + useMutation hooks wired to the given entity's CRUD endpoints.
 * Automatically invalidates list queries on create/update/destroy.
 */
export function useAdminCrud<T = any>(
  queryKey: string,
  api: CrudApi<T>,
  params?: Record<string, string>
) {
  const { token } = useAdmin();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

  const listQuery = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => api.list(params),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<T>) => api.create(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<T> }) =>
      api.update(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => api.destroy(id),
    onSuccess: invalidate,
  });

  return {
    items: (Array.isArray((listQuery.data as any)?.data) ? (listQuery.data as any).data : Array.isArray(listQuery.data) ? listQuery.data : []) as T[],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    refetch: listQuery.refetch,
    create: createMutation.mutateAsync,
    update: (id: number | string, data: Partial<T>) =>
      updateMutation.mutateAsync({ id, data }),
    remove: deleteMutation.mutateAsync,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
