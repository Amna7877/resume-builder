import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zqmxsuhurgnerfyrdqnu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbXhzdWh1cmduZXJmeXJkcW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTI2NTAsImV4cCI6MjA4NTM2ODY1MH0.rYneHeTYng4bINMfE9ofRv1o4Dx3nQjPb2MoxK4i8hI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)