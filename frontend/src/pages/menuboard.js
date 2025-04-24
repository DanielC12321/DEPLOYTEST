import React, { useState, useEffect } from 'react';
import styles from './menuboard.module.css';

function MenuBoard() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/product_table`);
        const data = await response.json();
        console.log(data)
        setMenu(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setLoading(false);
      }
    };

    fetchMenu();

    // Refresh menu every 5 minutes
    const refreshInterval = setInterval(fetchMenu, 5 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, [apiUrl]);

  // Group menu items by category
  const categories = {
    'milk-teas': { title: 'Milk Teas', items: [] },
    'pure-teas': { title: 'Pure Teas', items: [] },
    'fruit-teas': { title: 'Fruit Teas', items: [] },
    'specialty': { title: 'Specialty Drinks', items: [] }
  };

  // Populate categories
  menu.forEach(item => {
    if (categories[item.category]) {
      categories[item.category].items.push(item);
    }
  });

  return (
    <div className={styles.menuBoardContainer}>
      <div className={styles.menuBoardHeader}>
        <div className={styles.logoContainer}>
          <img 
            src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
            alt="ShareTea Logo" 
            className={styles.logo}
          />
          <h1 className={styles.menuTitle}>ShareTea Menu</h1>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p>Loading menu...</p>
        </div>
      ) : (
        <div className={styles.categoriesContainer}>
          {Object.keys(categories).map(categoryKey => (
            <div key={categoryKey} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{categories[categoryKey].title}</h2>
              <div className={styles.itemsGrid}>
                {categories[categoryKey].items.map(item => (
                  <div key={item.product_id} className={styles.menuItem}>
                    <div className={styles.itemImageContainer}>
                      <img 
                        src={item.imgurl || 'https://via.placeholder.com/150x150?text=No+Image'} 
                        alt={item.name} 
                        className={styles.itemImage} 
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>{item.product_cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.menuFooter}>
        <p>Customizations available: Size (S/M/L) · Sugar Level · Toppings</p>
        <p className={styles.storeInfo}>Ask our friendly staff for recommendations!</p>
      </div>
    </div>
  );
}

export default MenuBoard;