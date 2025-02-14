import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const handleSupabaseResponse = <T>(
  response: PostgrestSingleResponse<T>
): T => {
  if (response.error) {
    throw response.error;
  }
  return response.data;
};
