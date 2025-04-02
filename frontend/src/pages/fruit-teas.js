import React from 'react';
import { useNavigate } from 'react-router-dom';
import ItemPanel from './CustomerComponents/ItemPanel';
import styles from './customer.module.css';
import backgroundImage from './CustomerComponents/milk-tea-4658495.jpg';

function FruitTea(){



    const navigate = useNavigate();


    return (
        <div className={styles.ShareTeabackground} style={{ backgroundImage: `url(${backgroundImage})` }}>

        
        <div className={styles.ShareTeaHeader}>
            <div className={styles.ShareTeaHeaderTitle}>
                <h1>Share Tea</h1>
            </div>
            <div className={styles.ShareTeaLogo}>
                <img src = "https://www.sharetea.com.tw/images/logo.png" alt = "Share Tea Logo" />
            </div>
        </div>

        <div className={styles.menuContainer}>
            <h1 className={styles.menuTitle}>Fruit Teas</h1>
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
            </div>


        </div>

        </div>
    );
}

export default FruitTea;