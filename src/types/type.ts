import { Database } from "../api/supabase/supabase";

export type Notice = Database["public"]["Tables"]["notice"]["Row"];
export type Wod = Database["public"]["Tables"]["wod"]["Row"];
export type Hold = Database["public"]["Tables"]["hold"]["Row"];
export type Record = Database["public"]["Tables"]["record"]["Row"];

export type Holiday = {
  locdate: number;
  seq: number;
  dateKind: string;
  isHoliday: string;
  dateName: string;
};

export type Content = {
  id: number;
  title: string;
  content: string;
  writer: string;
  createdDate: string;
};

export type ContentWithContentType = Content & { contentType: string };
