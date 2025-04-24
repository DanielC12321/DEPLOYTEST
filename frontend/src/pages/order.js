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

function Order() {
    const { categoryType } = useParams();
    console.log(`Loading products for category: ${categoryType}`);
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL;

    const [menu, setMenu] = useState([]);
    // State to track if checkout panel is open
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    
    // Chatbot states
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Hi! How can I help you with your order today?' }
    ]);
    const [chatInput, setChatInput] = useState('');

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
                        // Remove typing indicator or temporary response
                        const filteredMessages = prevMessages.filter(msg => 
                            msg.sender !== 'bot-typing' && msg.sender !== 'bot-temp');
                        
                        // Add the current response
                        return [...filteredMessages, { sender: 'bot-temp', text: botResponse }];
                    });
                }
    
                // Finalize the response
                setChatMessages(prevMessages => {
                    const filteredMessages = prevMessages.filter(msg => 
                        msg.sender !== 'bot-typing' && msg.sender !== 'bot-temp');
                    return [...filteredMessages, { sender: 'bot', text: botResponse }];
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

    return (
        <div className={`${styles.ShareTeabackground} ${isCheckoutOpen ? styles.withCheckoutOpen : ''}`}>
            <div className={styles.ShareTeaHeader}>
                <div className={styles.ShareTeaLogo}>
                    <img 
                        src="https://franchise.sharetea.com.au/wp-content/uploads/2021/08/cropped-Favicon.png" 
                        alt="Share Tea Logo" 
                    />
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
                            description: 'Traditional milk tea with a rich, creamy flavor.',
                            image: product.imgurl
                        }}
                        onClick={() => openCustomization({
                            name: product.name,
                            id: product.product_id,
                            price: parseFloat(product.product_cost.replace(/[^\d.-]/g, '')),
                            description: 'Traditional milk tea with a rich, creamy flavor.',
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
                        <button className={styles.closeChatButton} onClick={toggleChat}>×</button>
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