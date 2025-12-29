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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          category_id: string | null
          created_at: string | null
          event_type: string
          id: string
          product_id: string | null
          referrer: string | null
          session_id: string | null
          subcategory_id: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          subcategory_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          product_id?: string | null
          referrer?: string | null
          session_id?: string | null
          subcategory_id?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_analytics_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "analytics_events_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_subfamily_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subfamilies"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          subcategory: string | null
          supplier_code: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          subcategory?: string | null
          supplier_code?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          subcategory?: string | null
          supplier_code?: string | null
        }
        Relationships: []
      }
      catalog_items: {
        Row: {
          active: boolean | null
          category_name: string
          category_no: number
          category_order: number
          category_slug: string
          code: string
          created_at: string | null
          description: string
          family_name: string
          family_no: string
          family_order: number
          family_slug: string
          id: string
          image_url: string | null
          item_order: number
          item_type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category_name: string
          category_no: number
          category_order: number
          category_slug: string
          code: string
          created_at?: string | null
          description: string
          family_name: string
          family_no: string
          family_order: number
          family_slug: string
          id?: string
          image_url?: string | null
          item_order: number
          item_type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category_name?: string
          category_no?: number
          category_order?: number
          category_slug?: string
          code?: string
          created_at?: string | null
          description?: string
          family_name?: string
          family_no?: string
          family_order?: number
          family_slug?: string
          id?: string
          image_url?: string | null
          item_order?: number
          item_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          catalog_id: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          catalog_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          catalog_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      families: {
        Row: {
          catalog_id: string | null
          category_id: string
          created_at: string | null
          display_order: number
          id: string
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          catalog_id?: string | null
          category_id: string
          created_at?: string | null
          display_order?: number
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          catalog_id?: string | null
          category_id?: string
          created_at?: string | null
          display_order?: number
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "families_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          brand: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          family_id: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          subcategory_id: string | null
          supplier_code: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          family_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          subcategory_id?: string | null
          supplier_code?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          brand?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          family_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          subcategory_id?: string | null
          supplier_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subfamily_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subfamilies"
            referencedColumns: ["id"]
          },
        ]
      }
      subfamilies: {
        Row: {
          catalog_id: string | null
          created_at: string | null
          description: string | null
          display_order: number
          family_id: string
          id: string
          is_consumable: boolean | null
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          catalog_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          family_id: string
          id?: string
          is_consumable?: boolean | null
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          catalog_id?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number
          family_id?: string
          id?: string
          is_consumable?: boolean | null
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subfamilies_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_analytics_summary: {
        Row: {
          category_name: string | null
          conversion_rate: number | null
          image_url: string | null
          last_activity: string | null
          product_id: string | null
          product_name: string | null
          supplier_code: string | null
          total_conversions: number | null
          total_views: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refresh_product_analytics_summary: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
