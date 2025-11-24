// pages/api/tweet.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, content } = req.body;

  // Ejemplo: moderación básica (longitud)
  if (!content || content.length > 280) {
    return res.status(400).json({ error: 'Contenido inválido' });
  }

  // Inserción con role service (usa privilegios totales)
  const { data, error } = await supabaseAdmin
    .from('tweets')
    .insert({ user_id, content })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ tweet: data });
}
