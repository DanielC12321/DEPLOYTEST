import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cashier.css";


function Cashier() {
  const [Open, setOpen] = useState(false);
  const [productNum, setproductNum] = useState(null);
  const [sugar, setSugar] = useState('standard');
  const [size, setSize] = useState('medium');
  const [pearls, setPearls] = useState('standard');
  const [custom, setCustom] = useState('standard');
  const [orderItems, setOrderItems] = useState([]);


  const Customize = (ingredient, amount) => {
    if (ingredient === 'sugar') setSugar(amount);
    if (ingredient === 'size') setSize(amount);
    if (ingredient === 'pearls') setPearls(amount);
    if (ingredient === 'custom') setCustom(amount);
  };

  const ConfirmCustom = () => {
    
    //submit product to order summary
    //have object that keep track of this and sends it to checkout
    //use the productNum to link with products in database
    const newItem = {
      id: Date.now(),
      product: `Product #${productNum}`,
      size: size,
      sugar: sugar,
      pearls: pearls
    };
    setOrderItems([...orderItems, newItem]);

    setOpen(false);
    alert(`You selected: Size: ${size}, Sugar: ${sugar}, and Pearls: ${pearls}`);
  };

  const removeItem = (itemId) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  
  const navigate = useNavigate();

  const pickProduct = (num) => {
    setproductNum(num);
    setOpen(true);
  };

  const logout = () => {
    navigate("/login");
  };

  const checkout = () => {
    if (orderItems.length > 0) {
      navigate("/cashierCheckout", { 
        state: { 
          orderItems: orderItems.map(item => ({
            productNum: parseInt(item.product.split('#')[1]),
            size: item.size,
            sugar: item.sugar,
            pearls: item.pearls
          }))
        } 
      });
    } else {
      alert("Please add items to your order first.");
    }
  
  };

  return (
        <div id="wrapper">
        <div class="divs" id="div1"><button onClick={logout} id="back">Logout</button></div>
        <div class="divs" id="div2"><h1 id="header">Create Order</h1>
        </div>
        <div class="divs" id="div3"><a>DIVVV</a></div>
        <div class="divs" id="div4"> Div</div>
        <div class="divs" id="div5">
        {!Open &&
        <div class="menutable">
        <div class="menu">
          <button onClick={() => pickProduct(0)}>Milk Tea #0</button>
          <button onClick={() => pickProduct(4)}>Iced Tea #4</button>
          <button onClick={() => pickProduct(8)}>Bubble Tea #8</button>
          <button onClick={() => pickProduct(12)}>Melon Tea #12</button>
          <button onClick={() => pickProduct(16)}>Berry Tea #16</button>
        </div>
        <div class="menu">
          <button onClick={() => pickProduct(1)}>Tea #1</button>
          <button onClick={() => pickProduct(5)}>Tea #5</button>
          <button onClick={() => pickProduct(9)}>Tea #9</button>
          <button onClick={() => pickProduct(13)}>Tea #13</button>
          <button onClick={() => pickProduct(17)}>Tea #17</button>
        </div>
        <div class="menu">
          <button onClick={() => pickProduct(2)}>Tea #2</button>
          <button onClick={() => pickProduct(6)}>Tea #6</button>
          <button onClick={() => pickProduct(10)}>Tea #10</button>
          <button onClick={() => pickProduct(14)}>Tea #14</button>
          <button onClick={() => pickProduct(18)}>Tea #18</button>
        </div>
        <div class="menu">
          <button onClick={() => pickProduct(3)}>Tea #3</button>
          <button onClick={() => pickProduct(7)}>Tea #7</button>
          <button onClick={() => pickProduct(11)}>Tea #11</button>
          <button onClick={() => pickProduct(15)}>Tea #15</button>
          <button onClick={() => pickProduct(19)}>Tea #19</button>
        </div>
        </div>
        }
        {Open && (
            <div className="cstmwindow">
              <div className="customize">
                <h2>Customize Item</h2>
                <h4>Size</h4>

                <div class="customButtons">
                <button class={size === 'small' ? 'selected' : ''} onClick={() => Customize('size', 'small')}>Small</button>
                <button class={size === 'medium' ? 'selected' : ''} onClick={() => Customize('size', 'medium')}>Medium</button>
                <button class={size === 'large' ? 'selected' : ''} onClick={() => Customize('size', 'large')}>Large</button>
                </div>

                <h4>Sugar</h4>

                <div class="customButtons">
                <button class={sugar === 'less' ? 'selected' : ''} onClick={() => Customize('sugar', 'less')}>Less</button>
                <button class={sugar === 'standard' ? 'selected' : ''} onClick={() => Customize('sugar', 'standard')}>Standard</button>
                <button class={sugar === 'extra' ? 'selected' : ''} onClick={() => Customize('sugar', 'extra')}>Extra</button>
                </div>

                <h4>Pearls</h4>

                <div class="customButtons">
                <button class={pearls === 'less' ? 'selected' : ''} onClick={() => Customize('pearls', 'less')}>Less</button>
                <button class={pearls === 'standard' ? 'selected' : ''} onClick={() => Customize('pearls', 'standard')}>Standard</button>
                <button class={pearls === 'extra' ? 'selected' : ''} onClick={() => Customize('pearls', 'extra')}>Extra</button>
                </div>


                <button onClick={() => ConfirmCustom()} className="order">Add Order</button>
              </div>
            </div>
          )}
        </div>
        <div class="divs" id="div6">
          <div className="order-list">
              <h3>Order List</h3>
              {orderItems.length === 0 ? (
                <p>No items in order</p>
              ) : (
                orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-header">
                      <span>{item.product}</span>
                      <button onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                    <div className="order-details">
                      Size: {item.size}, Sugar: {item.sugar}, Pearls: {item.pearls}
                    </div>
                  </div>
                ))
              )}
            </div>
        </div>
        <div class="divs" id="div7"><a>Diva</a></div>
        <div class="divs" id="div8">Item Selected: Product #{productNum}</div>
        <div class="divs" id="div9"><button onClick={checkout} id="back">Checkout</button></div>
        </div>
  );
}

export default Cashier;