import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./managerInventory.css";



function ManagerInventory() {
  
  const navigate = useNavigate();

  const toManager = () => {
    navigate("/ManagerInterface");
  }

  

  return (
        <div id="wrapper">
        <div class="divs" id="div1"><button onClick={toManager} id="back">Manager Home</button></div>
        <div class="divs" id="div2"><h1 id="header">Inventory</h1></div>
        <div class="divs" id="div3">Div</div>
        <div class="divs" id="div4">Div</div>
        <div class="divs" id="div5">Div</div>
        <div class="divs" id="div6">Div</div>
        <div class="divs" id="div7">Div</div>
        <div class="divs" id="div8">Div</div>
        <div class="divs" id="div9">Div</div>
        </div>
  );
}

export default ManagerInventory;