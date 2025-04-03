import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import ManagerInventory from './managerInventory.js';

const ManagerInterface = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Manager Interface</h1>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/manager/productusagechart"><button>Product Usage Chart</button></Link>
                <Link to="/manager/salesreport"><button>Sales Report</button></Link>
                <Link to="/manager/xreport"><button>X Report</button></Link>
                <Link to="/manager/zreport"><button>Z Report</button></Link>
                <Link to="/manager/inventory"><button>Inventory</button></Link>
            </div>
        </div>
    );
};

export default ManagerInterface;
