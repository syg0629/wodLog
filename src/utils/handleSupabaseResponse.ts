import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const handleSupabaseResponse = async <T>(
  response: PostgrestSingleResponse<T>
): Promise<T> => {
  if (response.error) {
    throw response.error;
  }
  return response.data;
};
