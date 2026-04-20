import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ygnvpanwwfabmbqxgerv.supabase.co"

// NOTE: If you see 500 errors, replace this with your anon key from:
// Supabase Dashboard → Project Settings → API → "anon public" key
// It starts with: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_gSS1N_jjPA1lRvNwWC6a9w_STD0AGyZ"

export const supabase = createClient(supabaseUrl, supabaseKey)
