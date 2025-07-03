import { supabase } from "../lib/supabase";

export const booksApi = {
  async getBooks(userId) {
    const { data, error } = await supabase
      .from("book_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getPublicBooks(userId) {
    const { data, error } = await supabase
      .from("book_entries")
      .select("*")
      .eq("user_id", userId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createBook(bookData) {
    const { data, error } = await supabase
      .from("book_entries")
      .insert([bookData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBook(bookId, userId, bookData) {
    const { data, error } = await supabase
      .from("book_entries")
      .update(bookData)
      .eq("id", bookId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBook(bookId, userId) {
    const { error } = await supabase
      .from("book_entries")
      .delete()
      .eq("id", bookId)
      .eq("user_id", userId);

    if (error) throw error;
  },
};

export const feedApi = {
  async getFeed(limit = 50) {
    const { data: bookEntries, error: bookError } = await supabase
      .from("book_entries")
      .select(
        `
        *,
        journalers!inner(username)
      `
      )
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (bookError) {
      console.error("Error fetching with journalers:", bookError);
      const { data: fallbackEntries, error: fallbackError } = await supabase
        .from("book_entries")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (fallbackError) throw fallbackError;
      return fallbackEntries;
    }

    return bookEntries;
  },
};

export const journalersApi = {
  async getJournaler(userId) {
    const { data, error } = await supabase
      .from("journalers")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async getJournalerByUsername(username) {
    const { data, error } = await supabase
      .from("journalers")
      .select("*")
      .eq("username", username)
      .single();

    if (error) throw error;
    return data;
  },

  async updateJournaler(userId, updates) {
    const { data, error } = await supabase
      .from("journalers")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const authApi = {
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async deleteAccount(userId) {
    try {
      const { error: booksError } = await supabase
        .from("book_entries")
        .delete()
        .eq("user_id", userId);

      if (booksError) throw booksError;

      const { error: journalerError } = await supabase
        .from("journalers")
        .delete()
        .eq("user_id", userId);

      if (journalerError) throw journalerError;

      const { error: deleteUserError } =
        await supabase.auth.admin.deleteUser(userId);
      if (deleteUserError) throw deleteUserError;

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
