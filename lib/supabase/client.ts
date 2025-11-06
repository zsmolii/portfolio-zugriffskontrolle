import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vvduuupzbayobvrzotmx.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2ZHV1dXB6YmF5b2J2cnpvdG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTc4NDEsImV4cCI6MjA3Njk5Mzg0MX0.jABDCE-cdLYkDZCL-6Z6MVsryJi9e_v4mrSNS-72b-g"

export function createBrowserClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export function createClient() {
  return createBrowserClient()
}
