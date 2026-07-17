require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Polyfill WebSocket for Node.js 20
global.WebSocket = require('ws');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  console.log('Starting migration...');

  if (!fs.existsSync('menu-db.json')) {
    console.log('menu-db.json not found, nothing to migrate.');
    return;
  }

  const db = JSON.parse(fs.readFileSync('menu-db.json', 'utf8'));

  // 1. Insert Categories
  if (db.categories && db.categories.length > 0) {
    console.log(`Migrating ${db.categories.length} categories...`);
    const { error } = await supabase.from('categories').upsert(db.categories);
    if (error) {
      console.error('Failed to migrate categories:', error);
      return;
    }
  }

  // 2. Migrate Images and Items
  if (db.items && db.items.length > 0) {
    console.log(`Migrating ${db.items.length} items and uploading images...`);
    
    for (let item of db.items) {
      if (item.imagePath && item.imagePath.startsWith('/images/')) {
        const localImagePath = path.join(__dirname, 'public', item.imagePath);
        
        if (fs.existsSync(localImagePath)) {
          const filename = path.basename(localImagePath);
          const fileBuffer = fs.readFileSync(localImagePath);
          const contentType = mime.lookup(filename) || 'image/png';
          
          console.log(`Uploading image: ${filename}`);
          
          const { error: uploadError } = await supabase.storage
            .from('menu-images')
            .upload(filename, fileBuffer, {
              contentType,
              upsert: true
            });
            
          if (uploadError) {
            console.error(`Failed to upload ${filename}:`, uploadError);
          } else {
            const { data } = supabase.storage.from('menu-images').getPublicUrl(filename);
            item.imagePath = data.publicUrl;
          }
        }
      }
    }

    console.log('Inserting items into database...');
    const { error: itemsError } = await supabase.from('items').upsert(db.items);
    if (itemsError) {
      console.error('Failed to migrate items:', itemsError);
      return;
    }
  }

  console.log('Migration complete!');
}

run();
