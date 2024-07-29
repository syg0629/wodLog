import { createQueryKeys } from "@lukemorales/query-key-factory";
import { supabase } from "../api/supabase/supabaseClient";
import { handleSupabaseResponse } from "../utils/handleSupabaseResponse";
import Tesseract from "tesseract.js";

export const recordQueryKeys = createQueryKeys("record", {
  // RecordList
  // Record 목록
  list: () => ({
    queryKey: ["all"],
    queryFn: async () => {
      const data = await supabase
        .from("record")
        .select("*")
        .order("record", { ascending: true });

      return handleSupabaseResponse(data);
    },
  }),
  // TextRecognizer
  // 이미지 Record 텍스트 추출
  recognizeText: (imgUrl: string, id: number, type: string) => ({
    queryKey: [imgUrl, id, type],
    queryFn: async () => {
      if (imgUrl) {
        try {
          const result = await Tesseract.recognize(imgUrl, "eng+kor");
          if (result && result.data.text) {
            return result.data.text;
          }
        } catch (error) {
          console.error("텍스트 추출 중 에러 >> ", (error as Error).message);
          throw error;
        }
      }
      return "";
    },
  }),
});
