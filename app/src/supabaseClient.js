import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jidpqltmtakywxvasodo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppZHBxbHRtdGFreXd4dmFzb2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMDE0MTYsImV4cCI6MjEwNDg3NzQxNn0.77zkzjrv0OoE94viawrCUPttnGoYpzmCjcYErXxBQgE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
