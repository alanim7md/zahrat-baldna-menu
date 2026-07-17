import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // Verify current password first
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }

    if (data.value !== currentPassword) {
      return NextResponse.json({ success: false, error: 'كلمة المرور الحالية غير صحيحة' }, { status: 401 });
    }

    // Update to new password
    const { error: updateError } = await supabase
      .from('settings')
      .update({ value: newPassword })
      .eq('key', 'admin_password');

    if (updateError) {
      return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
