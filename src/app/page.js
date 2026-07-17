import { readDb } from '@/lib/db';
import MenuClient from '@/components/MenuClient';
import styles from '@/components/MenuClient.module.css';

// Opt out of caching so the menu is always fresh when the user visits
export const dynamic = 'force-dynamic';

export default function Home() {
  const db = readDb();
  
  // Sort categories and items
  const categories = [...db.categories].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.name.localeCompare(b.name);
  });
  
  const items = [...db.items].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return a.name.localeCompare(b.name);
  });

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
