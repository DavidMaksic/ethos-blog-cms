import { createClient } from '@supabase/supabase-js';
export const supabaseUrl = 'https://qjbihfajkucvfxqkvtxk.supabase.co';
const supabaseKey =
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqYmloZmFqa3VjdmZ4cWt2dHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MzYwMzksImV4cCI6MjA1MzIxMjAzOX0.EwTsvHQCxtCeKeo_8hM8Uy-V7RET0j6hqKT94EtgeuY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
