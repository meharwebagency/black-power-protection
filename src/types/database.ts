// This file mirrors the live Supabase schema (public schema).
// Source of truth: information_schema dump. Keep in sync with the database.
// numeric -> number, jsonb -> unknown, timestamptz -> string, ARRAY(text) -> string[].

export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          slug: string;
          brand_id: string | null;
          model_id: string | null;
          make: string;
          make_ar: string;
          model: string;
          model_ar: string;
          year: number;
          price: number;
          currency: string;
          mileage: number;
          fuel_type: string;
          fuel_type_ar: string;
          transmission: string;
          transmission_ar: string;
          body_type: string;
          body_type_ar: string;
          engine_size: string | null;
          horsepower: number | null;
          color: string;
          color_ar: string;
          interior_color: string | null;
          interior_color_ar: string | null;
          description: string;
          description_ar: string;
          status: string;
          features: string[] | null;
          features_ar: string[] | null;
          vin: string | null;
          is_featured: boolean;
          featured_order: number | null;
          seo_title: string | null;
          seo_title_ar: string | null;
          seo_description: string | null;
          seo_description_ar: string | null;
          created_by: string | null;
          updated_by: string | null;
          published_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          brand_id?: string | null;
          model_id?: string | null;
          make: string;
          make_ar: string;
          model: string;
          model_ar: string;
          year: number;
          price: number;
          currency?: string;
          mileage?: number;
          fuel_type: string;
          fuel_type_ar?: string;
          transmission: string;
          transmission_ar?: string;
          body_type: string;
          body_type_ar?: string;
          engine_size?: string | null;
          horsepower?: number | null;
          color?: string;
          color_ar?: string;
          interior_color?: string | null;
          interior_color_ar?: string | null;
          description?: string;
          description_ar?: string;
          status?: string;
          features?: string[] | null;
          features_ar?: string[] | null;
          vin?: string | null;
          is_featured?: boolean;
          featured_order?: number | null;
          seo_title?: string | null;
          seo_title_ar?: string | null;
          seo_description?: string | null;
          seo_description_ar?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          brand_id?: string | null;
          model_id?: string | null;
          make?: string;
          make_ar?: string;
          model?: string;
          model_ar?: string;
          year?: number;
          price?: number;
          currency?: string;
          mileage?: number;
          fuel_type?: string;
          fuel_type_ar?: string;
          transmission?: string;
          transmission_ar?: string;
          body_type?: string;
          body_type_ar?: string;
          engine_size?: string | null;
          horsepower?: number | null;
          color?: string;
          color_ar?: string;
          interior_color?: string | null;
          interior_color_ar?: string | null;
          description?: string;
          description_ar?: string;
          status?: string;
          features?: string[] | null;
          features_ar?: string[] | null;
          vin?: string | null;
          is_featured?: boolean;
          featured_order?: number | null;
          seo_title?: string | null;
          seo_title_ar?: string | null;
          seo_description?: string | null;
          seo_description_ar?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          published_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          url: string;
          alt: string;
          is_primary: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          url: string;
          alt?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          url?: string;
          alt?: string;
          is_primary?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          name: string;
          name_ar: string;
          slug: string;
          logo_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ar: string;
          slug: string;
          logo_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ar?: string;
          slug?: string;
          logo_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      models: {
        Row: {
          id: string;
          brand_id: string;
          name: string;
          name_ar: string;
          slug: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          name: string;
          name_ar: string;
          slug: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          name?: string;
          name_ar?: string;
          slug?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          full_name_ar: string | null;
          avatar_url: string | null;
          phone: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string;
          full_name_ar?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          full_name_ar?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          id: string;
          vehicle_id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          status: string;
          notes: string | null;
          responded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          status?: string;
          notes?: string | null;
          responded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          status?: string;
          notes?: string | null;
          responded_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          key: string;
          value: unknown;
          category: string;
          description: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value?: unknown;
          category?: string;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: unknown;
          category?: string;
          description?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
