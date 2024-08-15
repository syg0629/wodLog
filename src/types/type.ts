import { Database } from "./supabase";

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
  createdDate: string;
  writerUuid: string;
};

export type UserInfo = {
  userName: string;
  writerUuid: string;
  auth: string;
};

export type ContentWithUserInfo = Content & { userInfo: UserInfo };

export type HoldWithUserInfo = Hold & {
  userInfo: {
    userName?: string;
    remainingHoldDays: number;
  };
};
