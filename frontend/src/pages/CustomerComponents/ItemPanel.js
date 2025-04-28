import React, { useState, useEffect } from 'react';
import './ItemPanel.css';

function ItemPanel({ item, onClick }) {
    const apiUrl = process.env.REACT_APP_API_URL;
    const [nutritionInfo, setNutritionInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getInformation() {
            try {
                if (!item.id) return;
                
                setLoading(true);
                const response = await fetch(`${apiUrl}/users/nutritional-facts?productID=${item.id}`);
                const processed = await response.json();
                processed[0].allergens = processed[0].allergens.replace(", none", "");
                setNutritionInfo(processed[0] || { allergens: 'None', nutrition_concerns: 'None' });
            } catch (error) {
                console.error('Error fetching nutritional info:', error);
                setNutritionInfo({ allergens: 'Not available', nutrition_concerns: 'Not available' });
            } finally {
                setLoading(false);
            }
        }

        getInformation();
    }, [apiUrl, item.id]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); 
            onClick();
        }
    };

    return (
        <div
            className="item-panel"
            onClick={onClick}
            tabIndex="0" 
            role="button" 
            aria-label={`${item.name}, $${item.price}`} 
            onKeyDown={handleKeyDown} 
        >
            <img src={item.image} alt={item.name} className='item-panel-image' />
            <div className='item-panel-information'>
                <h2 className="item-panel-title">{item.name}</h2>
                <p className="item-panel-price">${item.price.toFixed(2)}</p>
                <p className="item-panel-description">{item.description}</p>
                
                {nutritionInfo && (
                    <div className="item-panel-nutrition">
                        <p className="item-panel-allergens">
                            <span className="nutrition-label">Allergens:</span> {nutritionInfo.allergens}
                        </p>
                        {nutritionInfo.nutrition_concerns !== 'None' && (
                            <p className="item-panel-concerns">
                                <span className="nutrition-label">Nutrition:</span> {nutritionInfo.nutrition_concerns}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemPanel;