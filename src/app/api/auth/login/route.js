import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { password } = await request.json();

    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (error) {
      console.error('Error fetching password from settings:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    if (data && data.value === password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
