import { createClient } from '@supabase/supabase-js';

// These environment variables must be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definition for a question
export type Question = {
  id: string;
  created_at: string;
  question_text: string;
  context?: string; // This will be stored as part of question_text, but separated in the UI
  tag: 'Operations' | 'Compliance' | 'Technology' | 'General' | 'Fellows Program' | 'Company Success';
  fortnight_id: string;
  answer: string | null;
  is_answered: boolean;
};