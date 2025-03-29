import React from 'react';
import { Link } from 'react-router-dom';

const ManagerInterface: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Manager Interface</h1>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/manager/productusagechart">
                    <button>Product Usage Chart</button>
                </Link>
                <Link to="/manager/salesreport">
                    <button>Sales Report</button>
                </Link>
                <Link to="/manager/xreport">
                    <button>X Report</button>
                </Link>
                <Link to="/manager/zreport">
                    <button>Z Report</button>
                </Link>
            </div>
        </div>
    );
};

export default ManagerInterface;
