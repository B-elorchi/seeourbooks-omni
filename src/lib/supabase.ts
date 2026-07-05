import { createClient } from '@supabase/supabase-js';

// Hardcoding for MVP to avoid Vite .env restart issues
const supabaseUrl = 'http://46.101.218.188:8000';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgxODAxNTMwLCJleHAiOjE5Mzk0ODE1MzB9.uwvTNKTzfwe5FQ8o_fHSDULeWWomMORdA94GHu1x3nk';

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey.substring(0, 15) + "...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
