import React from 'react';
import './MiniCategoryPanel.css';

function MiniCategoryPanel({title, background, onClick, isActive}) {
    return (
        <div 
            className={`mini-category-panel ${isActive ? 'active' : ''}`}
            onClick={onClick}
            style={{backgroundImage: `url(${background})`}}
            role="button"
            tabIndex="0"
            aria-label={`View ${title} category`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
        >
            <div className="mini-overlay">
                <span className="mini-panel-title">{title}</span>
            </div>
        </div>
    );
};

export default MiniCategoryPanel;