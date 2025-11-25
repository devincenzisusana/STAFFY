import { supabase } from "@/lib/supabase";
import { getUserTenantId } from "./authHelpers";

/**
 * Generic fetch all items from a table with tenant filtering
 */
export const fetchAll = async <T>(
  tableName: string,
  selectQuery: string = "*",
  orderBy?: { column: string; ascending?: boolean }
): Promise<T[]> => {
  let query = supabase.from(tableName).select(selectQuery);

  if (orderBy) {
    query = query.order(orderBy.column, {
      ascending: orderBy.ascending ?? false,
    });
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as T[];
};

/**
 * Generic create item with automatic tenant_id injection
 */
export const createItem = async <T>(
  tableName: string,
  itemData: Omit<T, "id" | "created_at" | "updated_at" | "tenant_id">
): Promise<T> => {
  const tenantId = await getUserTenantId();

  const { data, error } = await supabase
    .from(tableName)
    .insert({
      ...itemData,
      tenant_id: tenantId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as T;
};

/**
 * Generic update item by ID
 */
export const updateItem = async <T>(
  tableName: string,
  id: string,
  updates: Partial<Omit<T, "id" | "created_at" | "updated_at" | "tenant_id">>
): Promise<void> => {
  const { error } = await supabase.from(tableName).update(updates).eq("id", id);

  if (error) throw error;
};

/**
 * Generic update single field by ID
 */
export const updateField = async (
  tableName: string,
  id: string,
  field: string,
  value: any
): Promise<void> => {
  const { error } = await supabase
    .from(tableName)
    .update({ [field]: value })
    .eq("id", id);

  if (error) throw error;
};

/**
 * Generic delete item by ID
 */
export const deleteItem = async (
  tableName: string,
  id: string
): Promise<void> => {
  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) throw error;
};
