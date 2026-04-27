import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Cek apakah variabel terbaca (Cek di console browser nanti)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Keys are missing! Check your .env.local file.");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);