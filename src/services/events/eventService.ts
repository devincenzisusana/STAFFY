import { supabase } from "@/lib/supabase";

export interface Event {
  id: string;
  tenant_id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  isPublic: boolean;
}

export interface UpdateEventData extends CreateEventData {}

class EventService {
  /**
   * Get all events for the current tenant
   */
  async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Get a single event by ID
   */
  async getEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventData): Promise<Event> {
    console.log("🔵 Creating event with data:", eventData);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("❌ User not authenticated");
      throw new Error("User not authenticated");
    }

    console.log("👤 User ID:", user.id);

    // Get user's tenant_id from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("tenant_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("❌ Error fetching user tenant:", userError);
      throw new Error("Unable to fetch user tenant information");
    }

    if (!userData) {
      console.error("❌ No user data found");
      throw new Error("Unable to fetch user tenant information");
    }

    console.log("🏢 Tenant ID:", userData.tenant_id);

    const insertData = {
      title: eventData.title,
      description: eventData.description || null,
      date: eventData.date,
      is_public: eventData.isPublic,
      user_id: user.id,
      tenant_id: userData.tenant_id,
    };

    console.log("📝 Insert data:", insertData);

    const { data, error } = await supabase
      .from("events")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Error inserting event:", error);
      throw error;
    }

    console.log("✅ Event created successfully:", data);
    return data;
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: string, eventData: UpdateEventData): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        description: eventData.description || null,
        date: eventData.date,
        is_public: eventData.isPublic,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const eventService = new EventService();
