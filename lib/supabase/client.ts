import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bobduitebgjykgjxcwzl.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvYmR1aXRlYmdqeWtnanhjd3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NTUwODMsImV4cCI6MjA3ODAzMTA4M30.U6ax0MHHBbnjEE_8V2sVzsPrHaj1b1CmUxpa6V5moa8"

export function createBrowserClient() {
  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

export function createClient() {
  return createBrowserClient()
}
