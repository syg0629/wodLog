import { supabase } from "../api/supabase/supabaseClient";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { deltaToHtml } from "../utils/deltaToHtml";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Content } from "../types/type";

export const createListQueryFn =
  <T>(table: string) =>
  async (): Promise<T[]> => {
    const data = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: false });
    const response = await handleSupabaseResponse(data);
    return deltaToHtml(response);
  };

export const createDetailQueryFn =
  <T>(table: string) =>
  async (id: number): Promise<T[]> => {
    const data = await supabase.from(table).select("*").eq("id", id);
    const response = await handleSupabaseResponse(data);
    return deltaToHtml(response);
  };

export const createSaveQueryFn =
  <T extends Content>(table: string, isEdit: boolean, contentId: number) =>
  async (data: T): Promise<T> => {
    const { title, content, writer, createdDate } = data;
    const savedData: PostgrestSingleResponse<T[]> = isEdit
      ? await supabase
          .from(table)
          .update({ title, content, createdDate })
          .eq("id", contentId)
          .select()
      : await supabase
          .from(table)
          .insert([{ title, content, writer, createdDate }])
          .select();

    return (await handleSupabaseResponse(savedData))[0];
  };
