import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gghiawvhuybntxtfjcza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaGlhd3ZodXlibnR4dGZqY3phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDY3NTMsImV4cCI6MjA3NjcyMjc1M30.O2X4480jR2FhTeu2lvgwX-e33a_WRsZwDI6BbpORRnw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
