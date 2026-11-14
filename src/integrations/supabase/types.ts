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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      challenge_logs: {
        Row: {
          challenge_id: string
          created_at: string
          day: string
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          created_at?: string
          day?: string
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          created_at?: string
          day?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      checkins: {
        Row: {
          body_areas: string[]
          created_at: string
          day: string
          energy: number
          id: string
          mood: number
          note: string | null
          sleep: number
          stress: number
          user_id: string
        }
        Insert: {
          body_areas?: string[]
          created_at?: string
          day?: string
          energy: number
          id?: string
          mood: number
          note?: string | null
          sleep: number
          stress: number
          user_id: string
        }
        Update: {
          body_areas?: string[]
          created_at?: string
          day?: string
          energy?: number
          id?: string
          mood?: number
          note?: string | null
          sleep?: number
          stress?: number
          user_id?: string
        }
        Relationships: []
      }
      dependents: {
        Row: {
          birth_year: number
          created_at: string
          id: string
          name: string
          relation: string
          user_id: string
        }
        Insert: {
          birth_year: number
          created_at?: string
          id?: string
          name: string
          relation?: string
          user_id?: string
        }
        Update: {
          birth_year?: number
          created_at?: string
          id?: string
          name?: string
          relation?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          focus_areas: string[]
          health_answers: Json
          id: string
          onboarding_completed: boolean
          region: string
          simple_mode: boolean
          updated_at: string
          work_mode: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          focus_areas?: string[]
          health_answers?: Json
          id: string
          onboarding_completed?: boolean
          region?: string
          simple_mode?: boolean
          updated_at?: string
          work_mode?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          focus_areas?: string[]
          health_answers?: Json
          id?: string
          onboarding_completed?: boolean
          region?: string
          simple_mode?: boolean
          updated_at?: string
          work_mode?: string
        }
        Relationships: []
      }
      support_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          relation: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          relation?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          relation?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          display_name: string | null
          joined_at: string
          team_id: string
          user_id: string
        }
        Insert: {
          display_name?: string | null
          joined_at?: string
          team_id: string
          user_id: string
        }
        Update: {
          display_name?: string | null
          joined_at?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          code: string
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_team_member: {
        Args: { _team: string; _user: string }
        Returns: boolean
      }
      join_team: { Args: { _code: string }; Returns: string }
      team_ranking: {
        Args: never
        Returns: {
          members: number
          name: string
          score: number
          team_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
