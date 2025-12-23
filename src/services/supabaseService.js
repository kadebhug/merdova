import { supabase } from '../config/supabaseClient';
import { DatabaseService, StorageService } from './serviceInterface';

/**
 * Supabase Database Service Implementation
 */
export class SupabaseDatabaseService extends DatabaseService {
  constructor(tableName = 'flower_entries') {
    super();
    this.tableName = tableName;
  }

  async fetchEntries() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  }

  async createEntry(entryData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([entryData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  }

  async updateEntry(entryId, entryData) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(entryData)
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  }

  async deleteEntry(entryId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', entryId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }

  async getEntryById(entryId) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting entry:', error);
      throw error;
    }
  }
}

/**
 * Supabase Storage Service Implementation
 */
export class SupabaseStorageService extends StorageService {
  async uploadFile(file, bucket, fileName = null) {
    try {
      const fileExt = file.name.split('.').pop();
      const finalFileName = fileName || `${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(finalFileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(finalFileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async deleteFile(bucket, fileName) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([fileName]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  getPublicUrl(bucket, fileName) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);
    return publicUrl;
  }
}

