import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const { data, error } = await supabase.from('items').select('*').order('displayOrder', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const { categoryId, name, description, price, imagePath, displayOrder } = await request.json();

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const id = uuidv4();
    const { data, error } = await supabase
      .from('items')
      .insert([{ 
        id, 
        categoryId, 
        name, 
        description: description || '', 
        price, 
        imagePath: imagePath || null, 
        displayOrder: displayOrder || 0 
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
