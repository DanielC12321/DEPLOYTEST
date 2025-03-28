import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cashier.css";


function Cashier() {
  const [isOpen, setIsOpen] = useState(false);
  const [productNum, setproductNum] = useState(null);
  const navigate = useNavigate();

  const pickProduct = (num) => {
    setproductNum(num);
    setIsOpen(true);
  }

  const logout = () => {
    navigate("/login");
  }

  const checkout = () => {
    navigate("/cashierCheckout");
  }

  return (
        <div id="wrapper">
        <div class="divs" id="div1"><button onClick={logout} id="back">Logout</button></div>
        <div class="divs" id="div2"><h1 id="header">Create Order</h1>
        </div>
        <div class="divs" id="div3"><a>Div</a></div>
        <div class="divs" id="div4"><a>Div</a></div>
        <div class="divs" id="div5">
        {!isOpen &&
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
        {isOpen && (
            <div className="cstmwindow">
              <div className="customize">
                <h2>Customize Item</h2>
                <p>Add More Ice.</p>
                <button onClick={() => setIsOpen(false)} className="order">Add Order</button>
              </div>
            </div>
          )}
        </div>
        <div class="divs" id="div6"><a>Div</a></div>
        <div class="divs" id="div7"><a>Div</a></div>
        <div class="divs" id="div8">Item Selected: Product #{productNum}</div>
        <div class="divs" id="div9"><button onClick={checkout} id="back">Checkout</button></div>
        </div>
  );
}

export default Cashier;