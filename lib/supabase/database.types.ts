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
      activity_events: {
        Row: {
          actor_user_id: string | null
          body: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json
          source: string
          tenant_id: string
          title: string
        }
        Insert: {
          actor_user_id?: string | null
          body?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          source?: string
          tenant_id: string
          title: string
        }
        Update: {
          actor_user_id?: string | null
          body?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          source?: string
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          ai_search_prompt: string | null
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          ends_at: string
          flight_number: string | null
          id: string
          passenger_count: number | null
          pickup_location_id: string | null
          quoted_total_myr: number | null
          source_channel: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          tenant_id: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          ai_search_prompt?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          ends_at: string
          flight_number?: string | null
          id?: string
          passenger_count?: number | null
          pickup_location_id?: string | null
          quoted_total_myr?: number | null
          source_channel?: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_id: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          ai_search_prompt?: string | null
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          ends_at?: string
          flight_number?: string | null
          id?: string
          passenger_count?: number | null
          pickup_location_id?: string | null
          quoted_total_myr?: number | null
          source_channel?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          tenant_id?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_pickup_location_id_fkey"
            columns: ["pickup_location_id"]
            isOneToOne: false
            referencedRelation: "fleet_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_locations: {
        Row: {
          airport_code: string | null
          city: string
          country_code: string
          created_at: string
          id: string
          is_public: boolean
          name: string
          pickup_instructions: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          airport_code?: string | null
          city: string
          country_code?: string
          created_at?: string
          id?: string
          is_public?: boolean
          name: string
          pickup_instructions?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          airport_code?: string | null
          city?: string
          country_code?: string
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string
          pickup_instructions?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fleet_locations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          platform_role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          platform_role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          platform_role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tenant_brands: {
        Row: {
          contact_channels: Json
          created_at: string
          display_name: string
          hero_image_url: string | null
          logo_url: string | null
          tagline: string | null
          tenant_id: string
          theme: Json
          updated_at: string
        }
        Insert: {
          contact_channels?: Json
          created_at?: string
          display_name: string
          hero_image_url?: string | null
          logo_url?: string | null
          tagline?: string | null
          tenant_id: string
          theme?: Json
          updated_at?: string
        }
        Update: {
          contact_channels?: Json
          created_at?: string
          display_name?: string
          hero_image_url?: string | null
          logo_url?: string | null
          tagline?: string | null
          tenant_id?: string
          theme?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_brands_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_memberships: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["tenant_member_role"]
          status: Database["public"]["Enums"]["member_status"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["tenant_member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          tenant_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["tenant_member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string
          id: string
          marketplace_enabled: boolean
          name: string
          primary_domain: string | null
          slug: string
          status: Database["public"]["Enums"]["tenant_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          marketplace_enabled?: boolean
          name: string
          primary_domain?: string | null
          slug: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          marketplace_enabled?: boolean
          name?: string
          primary_domain?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["tenant_status"]
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_public: boolean
          sort_order: number
          storage_path: string
          tenant_id: string
          vehicle_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          sort_order?: number
          storage_path: string
          tenant_id: string
          vehicle_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          sort_order?: number
          storage_path?: string
          tenant_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_media_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_media_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          daily_rate_myr: number
          features: string[]
          fuel_type: string | null
          home_location_id: string | null
          id: string
          make: string | null
          marketplace_status: Database["public"]["Enums"]["marketplace_status"]
          model: string | null
          name: string
          rating: number | null
          seats: number
          status: Database["public"]["Enums"]["vehicle_status"]
          tenant_id: string
          transmission: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          created_at?: string
          daily_rate_myr: number
          features?: string[]
          fuel_type?: string | null
          home_location_id?: string | null
          id?: string
          make?: string | null
          marketplace_status?: Database["public"]["Enums"]["marketplace_status"]
          model?: string | null
          name: string
          rating?: number | null
          seats: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          tenant_id: string
          transmission?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          created_at?: string
          daily_rate_myr?: number
          features?: string[]
          fuel_type?: string | null
          home_location_id?: string | null
          id?: string
          make?: string | null
          marketplace_status?: Database["public"]["Enums"]["marketplace_status"]
          model?: string | null
          name?: string
          rating?: number | null
          seats?: number
          status?: Database["public"]["Enums"]["vehicle_status"]
          tenant_id?: string
          transmission?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_home_location_id_fkey"
            columns: ["home_location_id"]
            isOneToOne: false
            referencedRelation: "fleet_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_is_platform_admin: { Args: never; Returns: boolean }
      has_tenant_role: {
        Args: {
          accepted_roles: Database["public"]["Enums"]["tenant_member_role"][]
          target_tenant_id: string
        }
        Returns: boolean
      }
      is_tenant_member: { Args: { target_tenant_id: string }; Returns: boolean }
    }
    Enums: {
      booking_status:
        | "requested"
        | "quoted"
        | "confirmed"
        | "cancelled"
        | "completed"
      marketplace_status: "private" | "draft" | "published" | "paused"
      member_status: "invited" | "active" | "disabled"
      tenant_member_role:
        | "owner"
        | "operations_manager"
        | "fleet_manager"
        | "finance_manager"
        | "runner"
        | "support_agent"
      tenant_status: "onboarding" | "active" | "suspended" | "archived"
      vehicle_status:
        | "available"
        | "cleaning"
        | "delivery"
        | "maintenance"
        | "returning"
        | "rented"
        | "inactive"
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
      booking_status: [
        "requested",
        "quoted",
        "confirmed",
        "cancelled",
        "completed",
      ],
      marketplace_status: ["private", "draft", "published", "paused"],
      member_status: ["invited", "active", "disabled"],
      tenant_member_role: [
        "owner",
        "operations_manager",
        "fleet_manager",
        "finance_manager",
        "runner",
        "support_agent",
      ],
      tenant_status: ["onboarding", "active", "suspended", "archived"],
      vehicle_status: [
        "available",
        "cleaning",
        "delivery",
        "maintenance",
        "returning",
        "rented",
        "inactive",
      ],
    },
  },
} as const
