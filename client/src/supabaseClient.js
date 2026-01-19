import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xzflbdfnwngjxmhnrbbb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZmxiZGZud25nanhtaG5yYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODAxNDksImV4cCI6MjA4MzU1NjE0OX0.zWiYRVS-4i2jPcu_sljcB5eVqQ3_n6ttek-dIXN8BOY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)