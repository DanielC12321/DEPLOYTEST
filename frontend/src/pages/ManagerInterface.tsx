import * as React from 'react';
import ProductUsageChart from './ProductUsageChart.tsx';
import ManagerInventory from './managerInventory.js';

interface ManagerInterfaceState {
    selectedReport: string;
}

class ManagerInterface extends React.Component<{}, ManagerInterfaceState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selectedReport: '',
        };
    }

    handleReportClick = (reportName: string) => {
        this.setState({ selectedReport: reportName });
    };

    renderReport() {
        const { selectedReport } = this.state;
        switch (selectedReport) {
            case 'productUsage':
                // Make sure the ProductUsageChart component is imported correctly.
                return <ProductUsageChart />;
            case 'salesReport':
                return <div>Sales Report Content (To Be Implemented)</div>;
            case 'xReport':
                return <div>X Report Content (To Be Implemented)</div>;
            case 'zReport':
                return <div>Z Report Content (To Be Implemented)</div>;
            case 'inventory':
                return <ManagerInventory />;
            default:
                return <div>Please select a report to view.</div>;
        }
    }

    render() {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Manager Interface</h1>
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={() => this.handleReportClick('productUsage')}>
                        Product Usage Chart
                    </button>
                    <button onClick={() => this.handleReportClick('salesReport')}>
                        Sales Report
                    </button>
                    <button onClick={() => this.handleReportClick('xReport')}>
                        X Report
                    </button>
                    <button onClick={() => this.handleReportClick('zReport')}>
                        Z Report
                    </button>
                    <button onClick={() => this.handleReportClick('inventory')}>
                        Inventory
                    </button>
                </div>
                <div>{this.renderReport()}</div>
            </div>
        </div>
    );
};

export default ManagerInterface;
