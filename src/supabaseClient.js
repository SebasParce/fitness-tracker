import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Faltan las variables de entorno REACT_APP_SUPABASE_URL y/o REACT_APP_SUPABASE_ANON_KEY. ' +
    'Revisa tu archivo .env.local (desarrollo) o la configuración de variables de entorno en Vercel (producción).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
