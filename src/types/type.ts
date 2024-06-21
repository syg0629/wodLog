import { Database } from "../api/supabase/supabase";

export type Notice = Database["public"]["Tables"]["notice"]["Row"];
export type Wod = Database["public"]["Tables"]["wod"]["Row"];
export type Hold = Database["public"]["Tables"]["hold"]["Row"];
export type Holiday = {
  locdate: number;
  seq: number;
  dateKind: string;
  isHoliday: string;
  dateName: string;
};
