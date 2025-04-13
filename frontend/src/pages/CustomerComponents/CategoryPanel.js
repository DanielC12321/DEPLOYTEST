import React, { useState } from 'react';
import './CategoryPanel.css';

function CategoryPanel ({title, background, onClick})
{
    return (
        <div className="category-panel"
        onClick={onClick}
        style={{backgroundImage: `url(${background})`}}
        role="button"
        tabIndex="0"
        aria-label={`View ${title} category`}
        onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}>
        <div className="overlay">
            <h2 className="panel-title">{title}</h2>
        </div>
        </div>


    );
};

export default CategoryPanel;