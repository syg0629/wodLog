import { supabase } from "../api/supabase/supabaseClient";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { deltaToHtml } from "../utils/deltaToHtml";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Content } from "../types/type";

type Tables = "notice" | "wod";

export const createListQueryFn =
  (table: Tables) => async (): Promise<Content[]> => {
    const data = await supabase
      .from(table)
      .select("*")
      .order("id", { ascending: false });
    const response = await handleSupabaseResponse(data);
    return deltaToHtml(response);
  };

export const createDetailQueryFn =
  (table: Tables) =>
  async (id: number): Promise<Content> => {
    const data = await supabase.from(table).select("*").eq("id", id);
    const response = await handleSupabaseResponse(data);
    return deltaToHtml(response)[0];
  };

export const createSaveQueryFn =
  <T extends Content>(table: Tables, isEdit: boolean, contentId: number) =>
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
