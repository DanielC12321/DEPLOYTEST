import React, { useEffect } from 'react';
import './GoogleTranslate.css';

function GoogleTranslate() {
  useEffect(() => {
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    };
    
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          layout: window.google.translate.TranslateElement.InlineLayout.DROPDOWN
        },
        'google-translate-element'
      );
    };
    
    if (!document.querySelector('script[src*="translate.google.com/translate_a"]')) {
      addScript();
    } else {
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }
    
    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);
  
  return (
    <div className="translate-container" role = "navigation" aria-label="Language selection">
      <div id="google-translate-element"></div>
    </div>
  );
}

export default GoogleTranslate;