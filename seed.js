const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(process.cwd(), 'menu-db.json');

const catSauces = crypto.randomUUID();
const catDesserts = crypto.randomUUID();
const catBaking = crypto.randomUUID();

const db = {
  categories: [
    { id: catSauces, name: 'صلصات وخل', displayOrder: 1 },
    { id: catDesserts, name: 'حلويات', displayOrder: 2 },
    { id: catBaking, name: 'مستلزمات الخبز والطبخ', displayOrder: 3 }
  ],
  items: []
};

const itemsData = [
  { img: 'IMG_1868.PNG', name: 'كاتشب بارد كبير', cat: catSauces },
  { img: 'IMG_1869.PNG', name: 'كاتشب حار كبير', cat: catSauces },
  { img: 'IMG_1870.PNG', name: 'كاتشب بارد صغير', cat: catSauces },
  { img: 'IMG_1872.PNG', name: 'صلصة العمبة الكبير', cat: catSauces },
  { img: 'IMG_1875.PNG', name: 'دبس الرمان الكبير', cat: catSauces },
  { img: 'IMG_1877.PNG', name: 'صلصة العمبة الصغير', cat: catSauces },
  { img: 'IMG_1876.PNG', name: 'دبس الرمان الصغير', cat: catSauces },
  { img: 'IMG_1879.PNG', name: 'صاص صغير', cat: catSauces },
  
  { img: 'IMG_1860.PNG', name: 'كاستر فراولة', cat: catDesserts },
  { img: 'IMG_1861.PNG', name: 'كاستر فانيلا', cat: catDesserts },
  { img: 'IMG_1862.PNG', name: 'كاستر برتقال', cat: catDesserts },
  { img: 'IMG_1859.PNG', name: 'كاستر كاكاو', cat: catDesserts },
  { img: 'IMG_1858.PNG', name: 'كاستر موز', cat: catDesserts },
  { img: 'IMG_1856.PNG', name: 'كريم شانتي موز', cat: catDesserts },
  { img: 'IMG_1853.PNG', name: 'كريم شانتي سادة', cat: catDesserts },
  { img: 'IMG_1855.PNG', name: 'كريم شانتي برتقال', cat: catDesserts },
  { img: 'IMG_1854.PNG', name: 'كريم شانتي كاكاو', cat: catDesserts },
  { img: 'IMG_1857.PNG', name: 'كريم شانتي فراولة', cat: catDesserts },
  { img: 'IMG_1865.PNG', name: 'جلي مشمش', cat: catDesserts },
  { img: 'IMG_1864.PNG', name: 'جلي فواكه', cat: catDesserts },
  { img: 'IMG_1863.PNG', name: 'جلي ليمون', cat: catDesserts },
  { img: 'IMG_1866.PNG', name: 'جلي فراولة', cat: catDesserts },
  { img: 'IMG_1884.PNG', name: 'جلي تفاح', cat: catDesserts },
  // Wait, the user mapped IMG_1884.PNG to both "جلي تفاح" and "جلي كرز". Let's keep one or both. I will keep both but use the same image.
  { img: 'IMG_1884.PNG', name: 'جلي كرز', cat: catDesserts },

  { img: 'IMG_1874.PNG', name: 'خل التفاح', cat: catSauces },
  { img: 'IMG_1873.PNG', name: 'خل التمر', cat: catSauces },
  { img: 'IMG_1886.PNG', name: 'خل ابيض', cat: catSauces },
  
  { img: 'IMG_1878.PNG', name: 'ماء ورد', cat: catBaking },
  { img: 'IMG_1882.PNG', name: 'نشا الذرة', cat: catBaking },
  { img: 'IMG_1889.PNG', name: 'بيكن باودر', cat: catBaking },
  { img: 'IMG_1867.PNG', name: 'فانيلا باودر', cat: catBaking }
];

itemsData.forEach((item, i) => {
  db.items.push({
    id: crypto.randomUUID(),
    categoryId: item.cat,
    name: item.name,
    description: '',
    price: 0, // Placeholder price since it wasn't provided
    imagePath: `/images/${item.img}`,
    displayOrder: i
  });
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Database re-seeded with actual item names in Arabic!');
