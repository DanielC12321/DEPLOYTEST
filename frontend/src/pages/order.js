import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemPanel from './CustomerComponents/ItemPanel';
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
    
    // State to track if checkout panel is open
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    
    // Toggle checkout panel
    const toggleCheckout = () => {
        setIsCheckoutOpen(!isCheckoutOpen);
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
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                    <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />     
                                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />     
                                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />     
                                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />     
                                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />
                <ItemPanel
                    item={{
                        name: 'Mango Green Tea',
                        price: 4.99,
                        description: 'Refreshing green tea with mango flavor.',
                        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFFKFKxj7Ap16FcdJcha3WMx28uPdiCY7UQ&s'
                    }}
                    onClick={() => navigate('/fruit-teas/mango-green-tea')}
                />                                       
            </div>


        </div>
        <div className={`${styles.orderSummaryPanel} ${isCheckoutOpen ? styles.open : ''}`}>
                <div className={styles.orderSummaryHeader}>
                    <h2>Order Summary</h2>
                    <button onClick={toggleCheckout} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.orderItems}>
                    {/* Here you would map through cart items */}
                    <div className={styles.orderItem}>
                        <span>Mango Green Tea</span>
                        <span>$4.99</span>
                    </div>
                    {/* Add more sample items or real cart items */}
                </div>
                <div className={styles.orderTotal}>
                    <span>Total:</span>
                    <span>$4.99</span>
                </div>
                <button className={styles.checkoutButton}>Proceed to Checkout</button>
            </div>

        </div>
    );
}

export default Order;