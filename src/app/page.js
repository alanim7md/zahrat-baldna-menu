import { supabase } from '@/lib/supabase';
import MenuClient from '@/components/MenuClient';
import styles from '@/components/MenuClient.module.css';

// Opt out of caching so the menu is always fresh when the user visits
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('displayOrder', { ascending: true })
    .order('name', { ascending: true });
    
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('displayOrder', { ascending: true })
    .order('name', { ascending: true });

  return (
    <main>
      <header className={styles.hero}>
        <div>
          <img src="/images/logo.png" alt="زهرة بلدنا" className={styles.heroLogo} />
          <p>نكهات أصيلة، تجربة استثنائية</p>
        </div>
      </header>
      
      <MenuClient categories={categories} items={items} />
      
      <footer style={{ textAlign: 'center', padding: '2rem', color: '#666', borderTop: '1px solid #333', marginTop: '3rem' }}>
        <p>&copy; {new Date().getFullYear()} زهرة بلدنا. جميع الحقوق محفوظة.</p>
      </footer>
    </main>
  );
}
