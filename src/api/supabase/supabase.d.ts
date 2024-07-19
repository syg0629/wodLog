export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      hold: {
        Row: {
          createdDate: string;
          holdEndDay: string;
          holdStartDay: string;
          id: number;
          requestedHoldDays: number;
          writerUuid: string;
        };
        Insert: {
          createdDate: string;
          holdEndDay: string;
          holdStartDay: string;
          id?: number;
          requestedHoldDays: number;
          writerUuid?: string;
        };
        Update: {
          createdDate?: string;
          holdEndDay?: string;
          holdStartDay?: string;
          id?: number;
          requestedHoldDays?: number;
          writerUuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "hold_writerUuid_fkey";
            columns: ["writerUuid"];
            isOneToOne: false;
            referencedRelation: "userInfo";
            referencedColumns: ["id"];
          }
        ];
      };
      notice: {
        Row: {
          content: string;
          createdDate: string;
          id: number;
          title: string;
          writerUuid: string;
        };
        Insert: {
          content: string;
          createdDate?: string;
          id?: number;
          title: string;
          writerUuid: string;
        };
        Update: {
          content?: string;
          createdDate?: string;
          id?: number;
          title?: string;
          writerUuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notice_writerUuid_fkey";
            columns: ["writerUuid"];
            isOneToOne: false;
            referencedRelation: "userInfo";
            referencedColumns: ["id"];
          }
        ];
      };
      record: {
        Row: {
          createdDate: string;
          id: number;
          name: string;
          record: number;
          workoutType: string;
          writerUuid: string;
        };
        Insert: {
          createdDate?: string;
          id?: number;
          name: string;
          record: number;
          workoutType: string;
          writerUuid: string;
        };
        Update: {
          createdDate?: string;
          id?: number;
          name?: string;
          record?: number;
          workoutType?: string;
          writerUuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "record_writerUuid_fkey";
            columns: ["writerUuid"];
            isOneToOne: false;
            referencedRelation: "userInfo";
            referencedColumns: ["id"];
          }
        ];
      };
      userInfo: {
        Row: {
          auth: string;
          email: string;
          id: string;
          remainingHoldDays: number;
          userName: string;
        };
        Insert: {
          auth?: string;
          email: string;
          id?: string;
          remainingHoldDays: number;
          userName: string;
        };
        Update: {
          auth?: string;
          email?: string;
          id?: string;
          remainingHoldDays?: number;
          userName?: string;
        };
        Relationships: [
          {
            foreignKeyName: "userInfo_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      wod: {
        Row: {
          content: string;
          createdDate: string;
          id: number;
          title: string;
          writerUuid: string;
        };
        Insert: {
          content: string;
          createdDate: string;
          id?: number;
          title: string;
          writerUuid: string;
        };
        Update: {
          content?: string;
          createdDate?: string;
          id?: number;
          title?: string;
          writerUuid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wod_writerUuid_fkey";
            columns: ["writerUuid"];
            isOneToOne: false;
            referencedRelation: "userInfo";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
