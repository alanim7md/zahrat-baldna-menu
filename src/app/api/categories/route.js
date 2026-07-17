import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const { data, error } = await supabase.from('categories').select('*').order('displayOrder', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const { name, displayOrder } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const id = uuidv4();
    const { data, error } = await supabase
      .from('categories')
      .insert([{ id, name, displayOrder: displayOrder || 0 }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
