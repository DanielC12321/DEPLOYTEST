import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryPanel from './CustomerComponents/CategoryPanel';
import './customer.css';

import milkTeaBackground from './CustomerComponents/milk-tea-4658495.jpg';
import pureTeaBackground from './CustomerComponents/tea-1869716.jpg';
import fruitTeaBackground from './CustomerComponents/fresh-fruit-tea-7575609.jpg';
import specialtyBackground from './CustomerComponents/coffee-563800.jpg';

function Customer() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            <CategoryPanel 
        title="Milk Teas" 
        background={milkTeaBackground}
        onClick={() => navigate('/milk-teas')}
      />
      <CategoryPanel 
        title="Pure Teas" 
        background={pureTeaBackground}
        onClick={() => navigate('/pure-teas')}
      />
      <CategoryPanel 
        title="Fruit Teas" 
        background={fruitTeaBackground}
        onClick={() => navigate('/fruit-teas')}
      />
      <CategoryPanel 
        title="Specialty/Coffee" 
        background={specialtyBackground}
        onClick={() => navigate('/specialty')}
      />
      </div>
    );
};

export default Customer;