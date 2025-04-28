import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoogleTranslate from './CustomerComponents/GoogleTranslate';
import ItemPanel from './CustomerComponents/ItemPanel';
import CustomizationModal from './CustomerComponents/CustomizationModal'; 
import MiniCategoryPanel from './CustomerComponents/MiniCategoryPanel';
import styles from './customer.module.css';

// Import the same background images you used in customer.js
import milkTeaBackground from './CustomerComponents/milk-tea-4658495.jpg';
import pureTeaBackground from './CustomerComponents/tea-1869716.jpg';
import fruitTeaBackground from './CustomerComponents/fresh-fruit-tea-7575609.jpg';
import specialtyBackground from './CustomerComponents/coffee-563800.jpg';
import sunnyBackground from './backgrounds/sunny.jpg';  
import cloudyBackground from './backgrounds/cloudy.jpg'; 
import rainyBackground from './backgrounds/rainy.jpg';
import stormyBackground from './backgrounds/stormy.jpg';
import snowyBackground from './backgrounds/snowy.jpg';
import defaultBackground from './backgrounds/default.jpg';

function Order() {
    const { categoryType } = useParams();
    console.log(`Loading products for category: ${categoryType}`);
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;
    const recognition = React.useMemo(() => {
        return 'SpeechRecognition' in window 
            ? new window.SpeechRecognition() 
            : 'webkitSpeechRecognition' in window 
                ? new window.webkitSpeechRecognition()
                : null;
    }, []);

    const [menu, setMenu] = useState([]);
    // State to track if checkout panel is open
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Hi! How can I help you with your order today?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [weather, setWeather] = useState(null);
    const [weatherBackground, setWeatherBackground] = useState({});
    const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);


    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(`${apiUrl}/weather`);
                const data = await response.json();
                setWeather(data);
                
                // Set the background based on weather
                if (data.shortForecast) {
                    const forecast = data.shortForecast.toLowerCase();
                    let backgroundStyles = {};
                    
                    // Determine which background to use based on weather condition
                    if (forecast.includes('sunny') || forecast.includes('clear')) {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${sunnyBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    } else if (forecast.includes('cloud')) {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${cloudyBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    } else if (forecast.includes('rain') || forecast.includes('shower')) {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${rainyBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    } else if (forecast.includes('thunder') || forecast.includes('storm')) {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${stormyBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    } else if (forecast.includes('snow')) {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${snowyBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    } else {
                        backgroundStyles = {
                            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${defaultBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                            transition: 'background-image 1s ease-in-out'
                        };
                    }
                    
                    // Add weather message based on conditions and temperature
                    const temp = data.temperature;
                    let weatherMessage = '';
                    
                    const currentWeather = `${temp} • ${data.shortForecast}`;

                    if (temp >= 85) {
                        weatherMessage = `${currentWeather} - Perfect day for a cold, refreshing fruit tea!`;
                    } else if (temp <= 60) {
                        weatherMessage = `${currentWeather} - Warm up with a hot classic milk tea today!`;
                    } else if (forecast.includes('rain')) {
                        weatherMessage = `${currentWeather} - Rainy day? Enjoy a comforting taro milk tea!`;
                    } else {
                        weatherMessage = `${currentWeather} - Great day for your favorite ShareTea drink!`;
                    }
                    
                    // Store both background styles and weather message
                    setWeatherBackground({
                        styles: backgroundStyles,
                        message: weatherMessage
                    });
                }
            } 
            catch (error) {
                console.error('Failed to fetch weather data:', error);
                
                // Fallback background if weather fetch fails
                setWeatherBackground({
                    styles: {
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${defaultBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundAttachment: 'fixed'
                    },
                    message: "Welcome to ShareTea!"
                });
            }
        };
        
        fetchWeather();
    }, [apiUrl]);

    useEffect(() => {
        const fetchMenu = async () => {
          try {
            const response = await fetch(`${apiUrl}/users/product_table`);
            const data = await response.json();
            setMenu(data);
          } catch (error) {
            console.error('Failed to fetch menu:', error);
          }
        };
    
        fetchMenu();
      }, [apiUrl]);

    // Speech Regonition 
    useEffect(() => {
        if (!recognition) {
            console.log("Speech recognition not supported in this browser");
            return;
        }
        
        console.log("Setting up speech recognition");
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            console.log("Speech recognition started");
            setIsListening(true);
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Speech recognized:", transcript);
            setChatInput(transcript);
        };
        
        recognition.onend = () => {
            console.log("Speech recognition ended");
            setIsListening(false);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };
        
        return () => {
            console.log("Cleaning up speech recognition");
            recognition?.abort();
        };
    }, [recognition]);
    // Chatbot Speech function
    let speechInProgress = false;
    const speakMessage = (text) => {
        if (!isSpeechEnabled || isSpeaking || speechInProgress) return;
        
        speechInProgress = true;

        // Clean the message of any HTML tags or markdown
        let cleanText = text
        .replace(/<[^>]*>?/gm, '') 
        .replace(/\*\*(.*?)\*\*/g, '$1') 
        .replace(/\*(.*?)\*/g, '$1') 
        .replace(/^\* /gm, '') 
        .replace(/^\- /gm, '') 
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') 
        .replace(/`([^`]+)`/g, '$1'); 
        
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Optional: Configure voice settings
        utterance.rate = 2.0; // Speech speed (0.1 to 10)
        utterance.pitch = 1.0; // Pitch (0 to 2)
        utterance.volume = 1.0; // Volume (0 to 1)
        
        // Optional: Use a specific voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => voice.lang === 'en-US');
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        // Add event listeners
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
    };

    //Chatbot Listen Function

    const toggleListening = () => {
        if (isListening) {
            console.log("Stopping speech recognition");
            recognition?.stop();
        } else {
            try {
                console.log("Starting speech recognition");
                recognition?.start();
                
                // Add visual feedback
                setChatInput('Listening...');
                
                // Clear the "Listening..." text after recognition starts
                setTimeout(() => {
                    if (chatInput === 'Listening...') {
                        setChatInput('');
                    }
                }, 1000);
            } catch (error) {
                console.error('Speech recognition error:', error);
                setChatInput('');
            }
        }
    };

    // Toggle checkout panel
    const toggleCheckout = () => {
        setIsCheckoutOpen(!isCheckoutOpen);
    };

    const openCustomization = (item) => {
        setSelectedItem(item);
        setIsCustomizationOpen(true);
    };
    
    // Close customization modal
    const closeCustomization = () => {
        setIsCustomizationOpen(false);
        setSelectedItem(null);
    };
    
    // Add item to cart
    const addToCart = (item) => {
        setCartItems([...cartItems, item]);
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.totalPrice, 0).toFixed(2);
    };

    const removeFromCart = (indexToRemove) => {
        setCartItems(cartItems.filter((_, index) => index !== indexToRemove));
    };

    // Chatbot functions
    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const getSystemPrompt = () => {
        return {
        role: "system",
        parts: [{
            text: `You are a helpful assistant for Sharetea, a popular bubble tea chain.
    
    ABOUT SHARETEA:
    - Sharetea specializes in a variety of tea-based beverages including milk teas, fruit teas, and specialty drinks
    - Our signature items include Classic Milk Tea, Taro Milk Tea, and Mango Green Tea
    - We offer customization options for sweetness levels, ice levels, and toppings
    
    MENU CATEGORIES:
    1. Milk Teas: Classic milk tea with black tea base and non-dairy creamer
    2. Fruit Teas: Refreshing teas mixed with real fruit flavors
    3. Pure Teas: Traditional teas without additives
    4. Specialty Drinks: Signature creations exclusive to Sharetea
    
    POPULAR TOPPINGS:
    - Pearls/Boba: Chewy tapioca balls
    - Grass Jelly: Herb-based jelly with a subtle sweet taste
    - Pudding: Smooth, custard-like topping
    - Aloe Vera: Refreshing cubes with a light sweetness
    
    CUSTOMIZATION OPTIONS:
    - Pearls: Less, Standard, Extra
    - Pearls: Less, Standard, Extra
    - Size: Small(8 oz) Medium (16oz), Large (24oz)
    
    When assisting customers:
    - Be friendly and helpful
    - Recommend popular combinations
    - Explain ingredients when asked
    - Provide information about nutrition when requested
    - Help with the ordering process
    - Answer questions about store locations and hours
    
    Focus on providing accurate information about Sharetea products and services. If you don't know something specific about Sharetea, be honest and offer to help with what you do know.`
        }]
        };
    };

    const sendMessage = async () => {
        if (!chatInput.trim()) return;
    
        // Add user message to chat
        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prevMessages => [...prevMessages, userMessage]);
        
        // Clear input field
        const messageSent = chatInput;
        setChatInput('');
    
        try {
            // Filter out temporary messages
            let validMessages = chatMessages.filter(msg => 
                msg.sender !== 'bot-typing' && msg.sender !== 'bot-temp');
            
            // Skip the initial greeting if it exists
            if (validMessages.length > 0 && validMessages[0].sender === 'bot') {
                validMessages = validMessages.slice(1);
            }
            
            // Add the current user message
            validMessages.push(userMessage);
            
            // Prepare the conversation history
            const filteredHistory = [];
            
            // Add a first user message with context instructions
            // This combines what would be a system prompt into the first user message
            const systemInstructions = getSystemPrompt().parts[0].text;
            filteredHistory.push({
                role: 'user',
                parts: [{ text: `Please remember the following context for our conversation: ${systemInstructions}\n\nNow, I'd like to learn about ShareTea.` }]
            });
            
            // Then add the rest of the conversation
            for (let i = 0; i < validMessages.length; i++) {
                filteredHistory.push({
                    role: validMessages[i].sender === 'user' ? 'user' : 'model',
                    parts: [{ text: validMessages[i].text }]
                });
            }
            
            console.log("Sending to API:", JSON.stringify({
                chat: messageSent,
                history: filteredHistory
            }, null, 2));
            
            // Fix the endpoint - remove the duplicate "stream"
            const response = await fetch(`${apiUrl}/api/stream/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat: messageSent,
                    history: filteredHistory
                }),
            });
    
            // Rest of your existing code remains the same...
            if (response.body) {
                // Handle streaming response
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let botResponse = '';
    
                // Show typing indicator
                setChatMessages(prevMessages => [...prevMessages, { sender: 'bot-typing', text: 'Typing...' }]);
    
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    // Decode the chunk and append to the response
                    const chunk = decoder.decode(value, { stream: true });
                    botResponse += chunk;
                    
                    // Update the bot response in real-time
                    setChatMessages(prevMessages => {
                        const filteredMessages = prevMessages.filter(msg => 
                            msg.sender !== 'bot-typing' && msg.sender !== 'bot-temp');
                        return [...filteredMessages, { sender: 'bot-temp', text: botResponse }];
                    });
                }
    
                // Finalize the response
                setChatMessages(prevMessages => {
                    const filteredMessages = prevMessages.filter(msg => 
                        msg.sender !== 'bot-typing' && msg.sender !== 'bot-temp');
                    const finalMessage = { sender: 'bot', text: botResponse };
    
                    // Speak the complete message only once
                    if (isSpeechEnabled) {
                        speakMessage(botResponse);
                    }
                    return [...filteredMessages,  finalMessage];
                });
            } else {
                setChatMessages(prevMessages => [
                    ...prevMessages.filter(msg => msg.sender !== 'bot-typing'),
                    { sender: 'bot', text: 'Sorry, I couldn\'t process your request.' }
                ]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setChatMessages(prevMessages => [
                ...prevMessages.filter(msg => msg.sender !== 'bot-typing'),
                { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const logout = () => {
        // Clear authentication data
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userRole');
        
        // Navigate to login
        navigate("/login");
      };
      
    const goToAccount = () => {
    navigate('/account');
    };

    return (
        <div 
        className={`${styles.ShareTeabackground} ${isCheckoutOpen ? styles.withCheckoutOpen : ''}`}
        style={weatherBackground.styles} // Apply dynamic background based on weather
        >
            <div className={styles.ShareTeaHeader}>
                <div className={styles.ShareTeaLogo}>
                    <img 
                        src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
                        alt="Share Tea Logo" 
                        onClick={() => navigate('/customer')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className={styles.weatherAccountContainer}>
                    {weatherBackground.message && (
                        <div className={styles.weatherMessage}>
                            {weatherBackground.message}
                        </div>
                    )}
                    
                    <div className={styles.accountButtons}>
                        <button 
                            className={styles.accountBtn}
                            onClick={goToAccount}
                        >
                            Account
                        </button>
                        <button 
                            className={styles.logoutBtn}
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
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
                    tabIndex="0"
                    role = "button"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            toggleCheckout();
                        }
                    }}
                    alt="Checkout"
                />
            </div>

            <div className={styles.menuContainer}>
                <div className={styles.menuItems}>
                    {menu.filter(product => product.category === categoryType).map(product => (
                        <ItemPanel
                        key={product.product_id}
                        item={{
                            name: product.name,
                            id: product.product_id,
                            price: parseFloat(product.product_cost.replace(/[^\d.-]/g, '')),
                            description: '',
                            image: product.imgurl
                        }}
                        onClick={() => openCustomization({
                            name: product.name,
                            id: product.product_id,
                            price: parseFloat(product.product_cost.replace(/[^\d.-]/g, '')),
                            description: '',
                            image: product.imgurl
                        })}
                        />
                    ))}
                </div>
            </div>

            <div className={`${styles.orderSummaryPanel} ${isCheckoutOpen ? styles.open : ''}`}>
                <div className={styles.orderSummaryHeader}>
                    <h2>Order Summary</h2>
                    <button onClick={toggleCheckout} className={styles.closeButton}>×</button>
                </div>
                <div className={styles.orderItems}>
                {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>Your cart is empty</div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className={styles.orderItem}>
                                <div className={styles.orderItemDetails}>
                                    <span className={styles.orderItemName}>{item.name}</span>
                                    <div className={styles.orderItemCustomizations}>
                                        <small>Size: {item.customizations.size}</small>
                                        <small>Sugar: {item.customizations.sugar}</small>
                                        <small>Pearls: {item.customizations.pearls}</small>
                                    </div>
                                </div>
                                <div className={styles.orderItemActions}>
                                    <span className={styles.orderItemPrice}>${item.totalPrice.toFixed(2)}</span>
                                        <button 
                                        className={styles.removeItemButton}
                                        onClick={() => removeFromCart(index)}
                                        aria-label="Remove item"
                                        >
                                        ×
                                        </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className={styles.orderTotal}>
                <span>Total:</span>
                <span>${calculateCartTotal()}</span>
                </div>
                <button className={styles.checkoutButton}
                tabIndex="0"
                role = "button" 
                onClick={() => navigate('/checkout', { state: { cartItems, total: calculateCartTotal() } })}>
                    Proceed to Checkout
                </button>
            </div>

            {/* Customization Modal */}
            <CustomizationModal
                isOpen={isCustomizationOpen}
                onClose={closeCustomization}
                item={selectedItem}
                onAddToCart={addToCart}
            />

            {/* Chatbot UI */}
            <div className={styles.chatbotToggle} onClick={toggleChat}>
                <img 
                    src="https://img.icons8.com/color/48/000000/chat--v1.png" 
                    alt="Chat with us"
                />
            </div>
            
            {isChatOpen && (
                <div className={styles.chatbotContainer}>
                    <div className={styles.chatbotHeader}>
                        <h3>ShareTea Assistant</h3>
                        <div className={styles.chatControls}>
                        <button 
                            className={`${styles.voiceControlBtn} ${isSpeechEnabled ? styles.active : ''}`}
                            onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                            aria-label={isSpeechEnabled ? "Disable voice" : "Enable voice"}
                            title={isSpeechEnabled ? "Disable voice" : "Enable voice"}
                        >
                            <img 
                                src={isSpeechEnabled 
                                    ? "https://img.icons8.com/material-rounded/24/000000/speaker.png" 
                                    : "https://img.icons8.com/material-rounded/24/000000/mute.png"
                                } 
                                alt={isSpeechEnabled ? "Voice on" : "Voice off"} 
                            />
                        </button>
                        <button className={styles.closeChatButton} onClick={toggleChat}>×</button>
                    </div>
                    </div>
                    <div className={styles.chatbotMessages}>
                        {chatMessages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`${styles.chatMessage} ${
                                    message.sender === 'user' 
                                        ? styles.userMessage 
                                        : message.sender === 'bot-typing'
                                            ? styles.botTyping
                                            : styles.botMessage
                                }`}
                            >
                                {message.text}
                            </div>
                        ))}
                    </div>
                    <div className={styles.chatbotInputContainer}>
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className={styles.chatbotInput}
                        />
                        {recognition && (
                            <button 
                                className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                                onClick={toggleListening}
                                disabled={isSpeaking}
                                aria-label={isListening ? "Stop listening" : "Start listening"}
                            >
                                <img 
                                    src={isListening 
                                        ? "https://img.icons8.com/material-rounded/24/fa314a/microphone.png" 
                                        : "https://img.icons8.com/material-rounded/24/000000/microphone.png"
                                    } 
                                    alt={isListening ? "Stop listening" : "Start speaking"} 
                                />
                            </button>
                        )}
                        <button 
                            onClick={sendMessage}
                            className={styles.chatbotSendButton}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
            <GoogleTranslate />
        </div>
    );
}

export default Order;