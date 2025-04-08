import React, { useState } from 'react';
import './ItemPanel.css';

function ItemPanel({ item, onClick }) {

    return (
        <div
            className="item-panel"
            onClick={onClick}
        >
            
            <img src={item.image} alt={item.name} className='item-panel-image' />
            <div className='item-panel-information'>
            <h2 className="item-panel-title">{item.name}</h2>
            <p className="item-panel-price">${item.price}</p>
            <p className="item-panel-description">{item.description}</p>
        </div>
        </div>
    );
}

export default ItemPanel;