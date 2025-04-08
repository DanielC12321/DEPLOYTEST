import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemPanel from './CustomerComponents/ItemPanel';
import CustomizationModal from './CustomerComponents/CustomizationModal'; // Import the new component
import MiniCategoryPanel from './CustomerComponents/MiniCategoryPanel';
import styles from './customer.module.css';

// Import the same background images you used in customer.js
import milkTeaBackground from './CustomerComponents/milk-tea-4658495.jpg';
import pureTeaBackground from './CustomerComponents/tea-1869716.jpg';
import fruitTeaBackground from './CustomerComponents/fresh-fruit-tea-7575609.jpg';
import specialtyBackground from './CustomerComponents/coffee-563800.jpg';

function Order() {
    const { categoryType } = useParams();
    console.log(`Loading products for category: ${categoryType}`);
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    const [menu, setMenu] = useState([]);
    useEffect(() => {
        const fetchMenu = async () => {
          try {
            const response = await fetch(`${apiUrl}/users/product_table`);
            const data = await response.json();
            setMenu(data);
          } catch (error) {
            console.error('Failed to fetch menu:', error);
          }
        };
    
        fetchMenu();
      }, []);

    // State to track if checkout panel is open
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    // Toggle checkout panel
    const toggleCheckout = () => {
        setIsCheckoutOpen(!isCheckoutOpen);
    };

    const openCustomization = (item) => {
        setSelectedItem(item);
        setIsCustomizationOpen(true);
    };
    
    // Close customization modal
    const closeCustomization = () => {
        setIsCustomizationOpen(false);
        setSelectedItem(null);
    };
    
    // Add item to cart
    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
    };

    const removeFromCart = (indexToRemove) => {
        setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className={`${styles.ShareTeabackground} ${isCheckoutOpen ? styles.withCheckoutOpen : ''}`}>
            <div className={styles.ShareTeaHeader}>
                <div className={styles.ShareTeaLogo}>
                    <img 
                        src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
                        alt="Share Tea Logo" 
                    />
                </div>
                
                {/* Only show mini categories when checkout is not open */}
                {!isCheckoutOpen && (
                    <div className={styles.miniCategoriesContainer}>
                        <MiniCategoryPanel 
                            title="Milk Teas" 
                            background={milkTeaBackground}
                            onClick={() => navigate('/order/milk-teas')}
                            isActive={categoryType === 'milk-teas'}
                        />
                        <MiniCategoryPanel 
                            title="Pure Teas" 
                            background={pureTeaBackground}
                            onClick={() => navigate('/order/pure-teas')}
                            isActive={categoryType === 'pure-teas'}
                        />
                        <MiniCategoryPanel 
                            title="Fruit Teas" 
                            background={fruitTeaBackground}
                            onClick={() => navigate('/order/fruit-teas')}
                            isActive={categoryType === 'fruit-teas'}
                        />
                        <MiniCategoryPanel 
                            title="Specialty" 
                            background={specialtyBackground}
                            onClick={() => navigate('/order/specialty')}
                            isActive={categoryType === 'specialty'}
                        />
                    </div>
                )}
                
                {/* When checkout is open, add a title to show the current category */}
                {isCheckoutOpen && (
                    <div className={styles.checkoutTitle}>
                        <h2>{categoryType?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Menu'}</h2>
                    </div>
                )}
                
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/1413/1413908.png" 
                    className={styles.ShareTeaCheckout} 
                    onClick={toggleCheckout}
                    alt="Checkout"
                />
            </div>

        <div className={styles.menuContainer}>

            <div className={styles.menuItems}>
                {/*<ItemPanel
                        item={{
                            name: 'Mango Green Tea',
                            price: 4.99,
                            description: 'Refreshing green tea with mango flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        }}
                        onClick={() => openCustomization({
                            name: 'Mango Green Tea',
                            price: 4.99,
                            description: 'Refreshing green tea with mango flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        })}
                    />
                    <ItemPanel
                        item={{
                            name: 'Classic Milk Tea',
                            price: 4.49,
                            description: 'Traditional milk tea with a rich, creamy flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        }}
                        onClick={() => openCustomization({
                            name: 'Classic Milk Tea',
                            price: 4.49,
                            description: 'Traditional milk tea with a rich, creamy flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        })}
                    />}*/}
                    {menu.filter(product => product.category === categoryType).map(product => (
                        <ItemPanel
                        item={{
                            name: product.name,
                            price: parseFloat(product.product_cost.replace(/[^\d.-]/g, '')),
                            description: 'Traditional milk tea with a rich, creamy flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        }}
                        onClick={() => openCustomization({
                            name: product.name,
                            price: parseFloat(product.product_cost.replace(/[^\d.-]/g, '')),
                            description: 'Traditional milk tea with a rich, creamy flavor.',
                            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                        })}
                        />
                    ))}
                                    
            </div>


        </div>
        <div className={`${styles.orderSummaryPanel} ${isCheckoutOpen ? styles.open : ''}`}>
                <div className={styles.orderSummaryHeader}>
                    <h2>Order Summary</h2>
                    <button onClick={toggleCheckout} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.orderItems}>
                {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>Your cart is empty</div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <div className={styles.orderItemDetails}>
                                    <span className={styles.orderItemName}>{item.name}</span>
                                    <div className={styles.orderItemCustomizations}>
                                        <small>Size: {item.customizations.size}</small>
                                        <small>Sugar: {item.customizations.sugar}</small>
                                        <small>Pearls: {item.customizations.pearls}</small>
                                    </div>
                                </div>
                                <div className={styles.orderItemActions}>
                                    <span className={styles.orderItemPrice}>${item.totalPrice.toFixed(2)}</span>
                                        <button 
                                        className={styles.removeItemButton}
                                        onClick={() => removeFromCart(index)}
                                        aria-label="Remove item"
                                        >
                                        ×
                                        </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className={styles.orderTotal}>
                <span>Total:</span>
                <span>${calculateCartTotal()}</span>
                </div>
                <button className={styles.checkoutButton} 
                onClick={() => navigate('/checkout', { state: { cartItems, total: calculateCartTotal() } })}>
                    Proceed to Checkout
                </button>
            </div>
                    {/* Customization*/}
            <CustomizationModal
                isOpen={isCustomizationOpen}
                onClose={closeCustomization}
                item={selectedItem}
                onAddToCart={addToCart}
            />
        </div>
    );
}

export default Order;