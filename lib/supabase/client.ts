import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bobduitebgjykgjxcwzl.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvYmR1aXRlYmdqeWtnanhjd3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTUwODMsImV4cCI6MjA3ODAzMTA4M30.U6ax0MHHBbnjEE_8V2sVzsPrHaj1b1CmUxpa6V5moa8"

let browserClient: ReturnType<typeof createSupabaseClient> | null = null

export function createBrowserClient() {
  if (browserClient) {
    return browserClient
  }

  browserClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return browserClient
}

export function createClient() {
  return createBrowserClient()
}
