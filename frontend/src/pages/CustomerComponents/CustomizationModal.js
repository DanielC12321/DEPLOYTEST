import { useEffect } from 'react';
import React, { useState } from 'react';
import './CustomizationModal.css';

function CustomizationModal({ isOpen, onClose, item, onAddToCart }) {
    // Move useState to the top level, before any conditions or returns
    const [customizations, setCustomizations] = useState({
        size: 'Medium',
        sugar: 'Standard',
        pearls: 'Standard'
    });
    const [showToast, setShowToast] = useState(false);
    useEffect(() => {
        setCustomizations({
          size: 'Medium',
          sugar: 'Standard',
          pearls: 'Standard'
        });
      }, [item]);
    // Skip rendering if not open or no item - AFTER the hooks are called
    if (!isOpen || !item) return null;
    
    // Define pricing for different sizes
    const sizePricing = {
        'Small': 0,
        'Medium': 0.50,
        'Large': 1.00
    };
    
    // Calculate total price
    const calculateTotal = () => {
        let total = item.price;
        // Add size upcharge
        total += sizePricing[customizations.size];
        return total.toFixed(2);
    };
    
    // Handle option selection
    const handleOptionChange = (category, value) => {
        setCustomizations(prev => ({
            ...prev,
            [category]: value
        }));
    };
    
    // Handle adding to cart
    const handleAddToCart = () => {
        const customizedItem = {
            ...item,
            customizations: customizations,
            totalPrice: parseFloat(calculateTotal())
        };
        onAddToCart(customizedItem);
        setShowToast(true);
        
        setTimeout(() => {
            setShowToast(false);
            onClose();
        }, 800);
    };
    
    return (
        <div className="customization-overlay" onClick={onClose}>
        <div className="customization-overlay" onClick={onClose}>
            <div className="customization-modal" onClick={e => e.stopPropagation()}>
                <div className="customization-header">
                    <h2>Customize Your Drink</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="customization-content">
                    {/* Item details section */}
                    <div className="item-details">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                            <h3>{item.name}</h3>
                            <p className="item-description">{item.description}</p>
                            <p className="base-price">Base Price: ${item.price.toFixed(2)}</p>
                        </div>
                    </div>
                
                    {/* Size selection */}
                    <div className="customization-section">
                        <h4>Size</h4>
                        <div className="option-group">
                            <button 
                                className={customizations.size === 'Small' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('size', 'Small')}
                            >
                                Small
                            </button>
                            <button 
                                className={customizations.size === 'Medium' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('size', 'Medium')}
                            >
                                Medium (+$0.50)
                            </button>
                            <button 
                                className={customizations.size === 'Large' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('size', 'Large')}
                            >
                                Large (+$1.00)
                            </button>
                        </div>
                    </div>
                    
                    {/* Sugar level selection */}
                    <div className="customization-section">
                        <h4>Sugar Level</h4>
                        <div className="option-group">
                            <button 
                                className={customizations.sugar === 'Less' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('sugar', 'Less')}
                            >
                                Less
                            </button>
                            <button 
                                className={customizations.sugar === 'Standard' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('sugar', 'Standard')}
                            >
                                Standard
                            </button>
                            <button 
                                className={customizations.sugar === 'Extra' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('sugar', 'Extra')}
                            >
                                Extra
                            </button>
                        </div>
                    </div>
                    
                    {/* Pearls selection */}
                    <div className="customization-section">
                        <h4>Pearls</h4>
                        <div className="option-group">
                            <button 
                                className={customizations.pearls === 'Less' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('pearls', 'Less')}
                            >
                                Less
                            </button>
                            <button 
                                className={customizations.pearls === 'Standard' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('pearls', 'Standard')}
                            >
                                Standard
                            </button>
                            <button 
                                className={customizations.pearls === 'Extra' ? 'option-button selected' : 'option-button'}
                                onClick={() => handleOptionChange('pearls', 'Extra')}
                            >
                                Extra
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="customization-footer">
                    <div className="price-total">
                        <span>Total:</span>
                        <span>${calculateTotal()}</span>
                    </div>
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
        {showToast && (
    <div className={`add-to-cart-toast ${showToast ? 'shake' : ''}`} aria-live="polite">
        <span>✓</span> Added to cart!
    </div>
)}
        </div>
    );
}

export default CustomizationModal;