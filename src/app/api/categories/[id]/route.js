import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { name, displayOrder } = await request.json();

    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const { data, error } = await supabase
      .from('categories')
      .update({ name, displayOrder })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
