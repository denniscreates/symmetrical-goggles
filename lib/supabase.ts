import { createClient } from '@supabase/supabase-js'

// Use MCP Supabase connection - these are the actual credentials from MCP
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://coybmhomfhxukpvmptbv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveWJtaG9tZmh4dWtwdm1wdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDQ2MjUsImV4cCI6MjA4MzU4MDYyNX0.OA41clccQruObMzUQOJxXd8m8c5u1tPE_fR_vS1snxU'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Using fallback.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

