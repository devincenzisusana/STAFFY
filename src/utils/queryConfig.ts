import { UseQueryOptions } from "@tanstack/react-query";

/**
 * Standardized query configuration for optimized data fetching
 * Includes caching, stale time, and refetch strategies
 */
export const queryConfig = {
  /**
   * Default configuration for most queries
   * - 5 minute stale time (data considered fresh for 5 mins)
   * - 10 minute cache time
   * - Refetch on window focus
   */
  default: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 1,
  } as UseQueryOptions,

  /**
   * Configuration for frequently changing data (e.g., schedules, tasks)
   * - 1 minute stale time
   * - 5 minute cache time
   * - Refetch on window focus
   */
  frequent: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 1,
  } as UseQueryOptions,

  /**
   * Configuration for rarely changing data (e.g., staff, locations)
   * - 10 minute stale time
   * - 30 minute cache time
   * - No refetch on window focus
   */
  stable: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  } as UseQueryOptions,

  /**
   * Configuration for realtime data (used with subscriptions)
   * - Infinity stale time (always use cached data, updated via subscription)
   * - 30 minute cache time
   * - No automatic refetching
   */
  realtime: {
    staleTime: Infinity, // Always fresh (updated via realtime)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  } as UseQueryOptions,

  /**
   * Configuration for one-time queries (e.g., initial load, reports)
   * - Infinity stale time
   * - 5 minute cache time
   * - No refetching
   */
  static: {
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  } as UseQueryOptions,
};

/**
 * Helper to create query keys consistently
 * @example
 * createQueryKey("staff", { status: "active" }) // ["staff", { status: "active" }]
 */
export function createQueryKey(
  resource: string,
  filters?: Record<string, any>
): any[] {
  if (filters && Object.keys(filters).length > 0) {
    return [resource, filters];
  }
  return [resource];
}
