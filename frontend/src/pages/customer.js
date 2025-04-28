import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryPanel from './CustomerComponents/CategoryPanel';
import styles from './customer.module.css';

import milkTeaBackground from './CustomerComponents/milk-tea-4658495.jpg';
import pureTeaBackground from './CustomerComponents/tea-1869716.jpg';
import fruitTeaBackground from './CustomerComponents/fresh-fruit-tea-7575609.jpg';
import specialtyBackground from './CustomerComponents/coffee-563800.jpg';

function Customer() {
    const navigate = useNavigate();
    localStorage.setItem('userId', '1'); 
    localStorage.setItem('userRole', 'customer');
    return (
      <>
      <div className={styles.accountNav}>
                <button 
                    className={styles.accountButton}
                    onClick={() => navigate('/account')}
                >
                    My Account
                </button>
            </div>
        <div className={styles.container}>
            <CategoryPanel 
        title="Milk Teas" 
        background={milkTeaBackground}
        onClick={() => navigate('/order/milk-teas')}
      />
      <CategoryPanel 
        title="Pure Teas" 
        background={pureTeaBackground}
        onClick={() => navigate('/order/pure-teas')}
      />
      <CategoryPanel 
        title="Fruit Teas" 
        background={fruitTeaBackground}
        onClick={() => navigate('/order/fruit-teas')}
      />
      <CategoryPanel 
        title="Specialty/Coffee" 
        background={specialtyBackground}
        onClick={() => navigate('/order/specialty')}
      />
      </div>
      </>
    );
};

export default Customer;