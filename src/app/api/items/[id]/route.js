import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { categoryId, name, description, price, imagePath, displayOrder } = await request.json();

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('items')
      .update({ 
        categoryId, 
        name, 
        description: description || '', 
        price, 
        imagePath: imagePath || null, 
        displayOrder: displayOrder || 0 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
