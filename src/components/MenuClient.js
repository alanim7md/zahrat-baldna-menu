"use client";

import { useState, useEffect } from 'react';
import styles from './MenuClient.module.css';

export default function MenuClient({ categories, items }) {
  const [activeTab, setActiveTab] = useState(categories.length > 0 ? categories[0].id : null);

  const scrollToCategory = (id) => {
    setActiveTab(id);
    const element = document.getElementById(`category-${id}`);
    if (element) {
      // Offset for the sticky nav
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Basic scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const category of categories) {
        const element = document.getElementById(`category-${category.id}`);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveTab(category.id);
            // Also scroll the nav container so the active tab is visible
            const tabElement = document.getElementById(`tab-${category.id}`);
            if (tabElement) {
              tabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  if (categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
        <p>القائمة فارغة حالياً. يرجى إضافة عناصر عبر لوحة التحكم.</p>
        <a href="/admin" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>الذهاب للوحة التحكم</a>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.nav} glass`}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`tab-${cat.id}`}
            className={`${styles.tab} ${activeTab === cat.id ? styles.active : ''}`}
            onClick={() => scrollToCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className={styles.menuContainer}>
        {categories.map((cat) => {
          const catItems = items.filter(i => i.categoryId === cat.id);
          if (catItems.length === 0) return null;

          return (
            <div key={cat.id} id={`category-${cat.id}`} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{cat.name}</h2>
              <div className={styles.itemsGrid}>
                {catItems.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    {item.imagePath ? (
                      <img src={item.imagePath} alt={item.name} className={styles.itemImage} loading="lazy" />
                    ) : (
                      <div className={styles.itemImagePlaceholder}>بدون صورة</div>
                    )}
                    <div className={styles.itemContent}>
                      <div className={styles.itemHeader}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <span className={styles.itemPrice}>{item.price.toLocaleString('ar-IQ')} د.ع</span>
                      </div>
                      {item.description && (
                        <p className={styles.itemDescription}>{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
