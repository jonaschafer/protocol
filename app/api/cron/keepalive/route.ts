import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Weekly keepalive for Supabase.
 * Supabase pauses free-tier projects after 7 days of inactivity.
 * Vercel Cron hits this route weekly to run a minimal DB query so the project stays active.
 *
 * Set CRON_SECRET in Vercel and optionally protect this route by checking
 * Authorization: Bearer <CRON_SECRET>. If CRON_SECRET is not set, the route still runs
 * (useful for dev or external cron services that pass the secret).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const { error } = await supabase
      .from('training_plans')
      .select('id')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[keepalive]', e);
    return NextResponse.json({ error: 'Keepalive failed' }, { status: 500 });
  }
}
