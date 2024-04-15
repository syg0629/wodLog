import { PostgrestError } from "@supabase/supabase-js";

export const handleSupabaseResponse = async <T>(
  fn: () => Promise<T[] | null>,
  error: PostgrestError | null
): Promise<T[]> => {
  if (error) {
    throw error;
  }
  const data = await fn();
  return data ?? [];
};
