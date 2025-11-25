import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";

interface UseRealtimeSubscriptionOptions<T> {
  table: string;
  queryKey: string[];
  schema?: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
 * Custom hook for Supabase realtime subscriptions with React Query integration
 * Automatically invalidates queries when data changes in the database
 *
 * @example
 * useRealtimeSubscription({
 *   table: "staff",
 *   queryKey: ["staff"],
 *   event: "*", // Listen to all events
 * });
 */
export function useRealtimeSubscription<T = any>({
  table,
  queryKey,
  schema = "public",
  filter,
  event = "*",
  onInsert,
  onUpdate,
  onDelete,
}: UseRealtimeSubscriptionOptions<T>) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = () => {
      // Create channel with unique name
      const channelName = `${schema}:${table}:${queryKey.join("-")}`;
      channel = supabase.channel(channelName);

      // Configure subscription
      const subscriptionConfig: any = {
        event,
        schema,
        table,
      };

      if (filter) {
        subscriptionConfig.filter = filter;
      }

      channel
        .on(
          "postgres_changes",
          subscriptionConfig,
          (payload: RealtimePostgresChangesPayload<T>) => {
            // Handle specific events
            if (payload.eventType === "INSERT" && onInsert) {
              onInsert(payload);
            } else if (payload.eventType === "UPDATE" && onUpdate) {
              onUpdate(payload);
            } else if (payload.eventType === "DELETE" && onDelete) {
              onDelete(payload);
            }

            // Invalidate queries to refetch data
            queryClient.invalidateQueries({ queryKey });
          }
        )
        .subscribe();
    };

    setupSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [
    table,
    queryKey,
    schema,
    filter,
    event,
    queryClient,
    onInsert,
    onUpdate,
    onDelete,
  ]);
}
