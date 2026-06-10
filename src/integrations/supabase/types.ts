export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      employee_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          email: string
          employee_code: string | null
          full_name: string
          id: string
          join_date: string | null
          manager_id: string | null
          status: Database["public"]["Enums"]["account_status"]
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          employee_code?: string | null
          full_name: string
          id: string
          join_date?: string | null
          manager_id?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          employee_code?: string | null
          full_name?: string
          id?: string
          join_date?: string | null
          manager_id?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      late_early_requests: {
        Row: {
          actual_time: string
          approver_id: string | null
          attachment_path: string | null
          code: string
          created_at: string
          date: string
          decided_at: string | null
          decision_note: string | null
          id: string
          kind: Database["public"]["Enums"]["late_early_kind"]
          minutes: number
          reason: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_time: string
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          date: string
          decided_at?: string | null
          decision_note?: string | null
          id?: string
          kind: Database["public"]["Enums"]["late_early_kind"]
          minutes: number
          reason: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_time?: string
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          date?: string
          decided_at?: string | null
          decision_note?: string | null
          id?: string
          kind?: Database["public"]["Enums"]["late_early_kind"]
          minutes?: number
          reason?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          carried_over: number
          created_at: string
          entitled: number
          id: string
          updated_at: string
          used: number
          user_id: string
          year: number
        }
        Insert: {
          carried_over?: number
          created_at?: string
          entitled?: number
          id?: string
          updated_at?: string
          used?: number
          user_id: string
          year: number
        }
        Update: {
          carried_over?: number
          created_at?: string
          entitled?: number
          id?: string
          updated_at?: string
          used?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approver_id: string | null
          attachment_path: string | null
          code: string
          created_at: string
          days: number
          decided_at: string | null
          decision_note: string | null
          end_date: string
          hours: number | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          days?: number
          decided_at?: string | null
          decision_note?: string | null
          end_date: string
          hours?: number | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason: string
          start_date: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          days?: number
          decided_at?: string | null
          decision_note?: string | null
          end_date?: string
          hours?: number | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string
          start_date?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      overtime_requests: {
        Row: {
          actual_minutes: number
          approver_id: string | null
          attachment_path: string | null
          code: string
          created_at: string
          date: string
          decided_at: string | null
          decision_note: string | null
          end_time: string
          id: string
          project: string | null
          reason: string
          rounded_hours: number
          start_time: string
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_minutes: number
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          date: string
          decided_at?: string | null
          decision_note?: string | null
          end_time: string
          id?: string
          project?: string | null
          reason: string
          rounded_hours: number
          start_time: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_minutes?: number
          approver_id?: string | null
          attachment_path?: string | null
          code?: string
          created_at?: string
          date?: string
          decided_at?: string | null
          decision_note?: string | null
          end_time?: string
          id?: string
          project?: string | null
          reason?: string
          rounded_hours?: number
          start_time?: string
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      policy_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      account_status: "active" | "inactive"
      app_role: "admin" | "hr" | "manager" | "employee"
      late_early_kind: "late" | "early"
      leave_type: "fullday" | "halfday" | "hourly"
      request_status: "pending" | "approved" | "rejected" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive"],
      app_role: ["admin", "hr", "manager", "employee"],
      late_early_kind: ["late", "early"],
      leave_type: ["fullday", "halfday", "hourly"],
      request_status: ["pending", "approved", "rejected", "cancelled"],
    },
  },
} as const
