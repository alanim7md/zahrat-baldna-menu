"use client";

import { useState, useEffect } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  
  const [newCatName, setNewCatName] = useState('');
  
  const [newItem, setNewItem] = useState({ categoryId: '', name: '', description: '', price: '', imagePath: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsLoggedIn(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const catRes = await fetch('/api/categories');
    const catData = await catRes.json();
    setCategories(catData);

    const itemRes = await fetch('/api/items');
    const itemData = await itemRes.json();
    setItems(itemData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsLoggedIn(false);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCatName })
    });
    setNewCatName('');
    fetchData();
  };

  const deleteCategory = async (id) => {
    if (!confirm('هل أنت متأكد؟ سيتم حذف جميع العناصر في هذا القسم أيضاً.')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    if (data.success) {
      setNewItem({ ...newItem, imagePath: data.imagePath });
    } else {
      alert('فشل رفع الصورة');
    }
    setUploadingImage(false);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.categoryId || !newItem.name || !newItem.price) {
      alert('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newItem,
        price: parseFloat(newItem.price)
      })
    });
    
    setNewItem({ categoryId: '', name: '', description: '', price: '', imagePath: '' });
    fetchData();
  };

  const deleteItem = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر؟')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await res.json();
    if (data.success) {
      setEditingItemData({ ...editingItemData, imagePath: data.imagePath });
    } else {
      alert('فشل رفع الصورة');
    }
    setUploadingImage(false);
  };

  const saveEditItem = async (e) => {
    e.preventDefault();
    await fetch(`/api/items/${editingItemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingItemData,
        price: parseFloat(editingItemData.price)
      })
    });
    setEditingItemId(null);
    setEditingItemData(null);
    fetchData();
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <h2>تسجيل دخول الإدارة</h2>
          <input 
            type="password" 
            placeholder="كلمة المرور (admin123)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>دخول</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>زهرة بلدنا - لوحة التحكم</h1>
        <button onClick={handleLogout} className={styles.button}>تسجيل الخروج</button>
      </div>

      <div className={styles.section}>
        <h2>الأقسام</h2>
        <form onSubmit={addCategory} className={styles.formGroup}>
          <input 
            type="text" 
            placeholder="اسم القسم الجديد" 
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>إضافة قسم</button>
        </form>

        <div className={styles.itemList}>
          {categories.map(cat => (
            <div key={cat.id} className={styles.itemCard}>
              <span>{cat.name}</span>
              <button onClick={() => deleteCategory(cat.id)} className={`${styles.button} ${styles.dangerButton}`}>حذف</button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>عناصر المنيو</h2>
        <form onSubmit={addItem} className={styles.card}>
          <div className={styles.formGroup}>
            <select 
              value={newItem.categoryId} 
              onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
              className={styles.input}
              required
            >
              <option value="">اختر القسم</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="اسم العنصر" 
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className={styles.input}
              required
            />
            <input 
              type="number" 
              step="0.01"
              placeholder="السعر (مثال: 5000)" 
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="الوصف (اختياري)" 
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className={styles.input}
              style={{ flex: 1 }}
            />
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.input}
            />
            {uploadingImage && <span>جاري الرفع...</span>}
          </div>
          <button type="submit" className={styles.button}>إضافة عنصر</button>
        </form>

        {categories.map(cat => {
          const catItems = items.filter(i => i.categoryId === cat.id);
          if (catItems.length === 0) return null;
          
          return (
            <div key={cat.id} className={styles.card}>
              <h3>{cat.name}</h3>
              <div className={styles.itemList}>
                {catItems.map(item => (
                  <div key={item.id} className={styles.itemCard}>
                    {editingItemId === item.id ? (
                      <form onSubmit={saveEditItem} style={{ width: '100%' }}>
                        <div className={styles.formGroup}>
                          <select 
                            value={editingItemData.categoryId} 
                            onChange={(e) => setEditingItemData({ ...editingItemData, categoryId: e.target.value })}
                            className={styles.input}
                            required
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <input 
                            type="text" 
                            value={editingItemData.name}
                            onChange={(e) => setEditingItemData({ ...editingItemData, name: e.target.value })}
                            className={styles.input}
                            required
                          />
                          <input 
                            type="number" 
                            step="0.01"
                            value={editingItemData.price}
                            onChange={(e) => setEditingItemData({ ...editingItemData, price: e.target.value })}
                            className={styles.input}
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <input 
                            type="text" 
                            value={editingItemData.description}
                            onChange={(e) => setEditingItemData({ ...editingItemData, description: e.target.value })}
                            className={styles.input}
                            style={{ flex: 1 }}
                          />
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleEditImageUpload}
                            className={styles.input}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="submit" className={styles.button}>حفظ</button>
                          <button type="button" onClick={() => setEditingItemId(null)} className={`${styles.button} ${styles.dangerButton}`}>إلغاء</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className={styles.itemInfo}>
                          {item.imagePath && <img src={item.imagePath} alt={item.name} className={styles.itemImage} />}
                          <div>
                            <strong>{item.name}</strong> - {item.price.toLocaleString('ar-IQ')} د.ع
                            {item.description && <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#666' }}>{item.description}</p>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => { setEditingItemId(item.id); setEditingItemData(item); }} className={styles.button}>تعديل</button>
                          <button onClick={() => deleteItem(item.id)} className={`${styles.button} ${styles.dangerButton}`}>حذف</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
