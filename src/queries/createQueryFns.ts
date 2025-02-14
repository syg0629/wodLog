import { supabase } from "../config/supabaseClient";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import { deltaToHtml } from "../utils/deltaToHtml";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Content, ContentWithUserInfo } from "../types/type";

type Tables = "notice" | "wod";

export const createListQueryFn =
  (table: Tables) => async (): Promise<Content[]> => {
    const data = await supabase
      .from(table)
      .select("*, userInfo(userName)")
      .order("id", { ascending: false });
    return deltaToHtml(handleSupabaseResponse(data));
  };

export const createDetailQueryFn =
  (table: Tables) =>
  async (id: number): Promise<Content> => {
    const data = await supabase
      .from(table)
      .select("*, userInfo(userName, auth)")
      .eq("id", id);
    return deltaToHtml(handleSupabaseResponse(data))[0];
  };

export const createSaveQueryFn =
  <T extends ContentWithUserInfo>(table: Tables) =>
  async (data: T): Promise<T> => {
    const { title, content, createdDate } = data;
    const writerUuid = data.userInfo.writerUuid;

    const savedData: PostgrestSingleResponse<T[]> = await supabase
      .from(table)
      .insert([{ title, content, writerUuid, createdDate }])
      .select();

    return handleSupabaseResponse(savedData)[0];
  };

export const editSaveQueryFn =
  <T extends ContentWithUserInfo>(table: Tables, contentId: number) =>
  async (data: T): Promise<T> => {
    const { title, content, createdDate } = data;

    const savedData: PostgrestSingleResponse<T[]> = await supabase
      .from(table)
      .update({ title, content, createdDate })
      .eq("id", contentId)
      .select();

    return handleSupabaseResponse(savedData)[0];
  };
