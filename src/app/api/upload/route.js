import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${ext}`;

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(uniqueFilename, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(uniqueFilename);

    return NextResponse.json({ success: true, imagePath: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
