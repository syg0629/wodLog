import { PostgrestError } from "@supabase/supabase-js";

export const handleSupabaseResponse = <T>(
  data: T | null,
  error: PostgrestError | null
): T => {
  if (error) {
    throw error;
  }
  if (!data) {
    throw new Error("Data is null");
  }
  return data;
};
