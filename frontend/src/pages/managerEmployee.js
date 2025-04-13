import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./managerInventory.css";

function ManagerEmployee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    fetch("http://localhost:8001/employee_names")
      .then(res => res.json())
      .then(setEmployees)
      .catch(err => console.error("Failed to fetch employees", err));

    fetch("http://localhost:8001/cashier_performances")
      .then(res => res.json())
      .then(setEmployeePerformance)
      .catch(err => console.error("Failed to fetch performance", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const hireEmployee = async () => {
    const { name, address, email, phone, password } = newEmployee;
    if (!name || !address || !email || !phone || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8001/hire_employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (res.ok) {
        alert(`Employee ${name} has been hired successfully!`);
        setNewEmployee({ name: "", address: "", email: "", phone: "", password: "" });
        setShowAddForm(false);
        const updated = await fetch("http://localhost:8001/employee_names").then(r => r.json());
        setEmployees(updated);
      } else {
        const err = await res.json();
        alert(`Failed to hire employee: ${err.error}`);
      }
    } catch (err) {
      console.error("Hire error:", err);
      alert("Failed to hire employee. Please try again.");
    }
  };

  const fireEmployee = async (name) => {
    if (!window.confirm(`Are you sure you want to fire ${name}?`)) return;

    try {
      const res = await fetch("http://localhost:8001/fire_employee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        alert(`Employee ${name} has been fired.`);
        setSelectedEmployee(null);
        const updated = await fetch("http://localhost:8001/employee_names").then(r => r.json());
        setEmployees(updated);
      } else {
        const err = await res.json();
        alert(`Failed to fire employee: ${err.error}`);
      }
    } catch (err) {
      console.error("Fire error:", err);
      alert("Failed to fire employee. Please try again.");
    }
  };

  const renderEmployeeTable = () => (
    <div>
      <h2>Employees</h2>
      <div className="scroll-box">
        <table className="full-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.cashierid}>
                <td>{emp.cashierid}</td>
                <td>{emp.name}</td>
                <td>
                  <button onClick={() => setSelectedEmployee(emp)}>Details</button>
                  <button 
                    onClick={() => fireEmployee(emp.name)}
                    style={{ backgroundColor: "#ff4d4d", color: "white", marginLeft: 5 }}
                  >
                    Fire
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPerformanceTable = () => (
    <div>
      <h2>Performance Metrics</h2>
      <div className="scroll-box">
        <table className="full-table">
          <thead>
            <tr>
              <th>Name</th><th>Orders</th><th>Total Sales</th><th>Avg Order</th>
            </tr>
          </thead>
          <tbody>
            {employeePerformance.map(emp => (
              <tr key={emp.cashierid}>
                <td>{emp.name}</td>
                <td>{emp.orders_processed || 0}</td>
                <td>${parseFloat(emp.total_sales || 0).toFixed(2)}</td>
                <td>${parseFloat(emp.average_order_value || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!selectedEmployee) return null;
    const perf = employeePerformance.find(e => e.name === selectedEmployee.name);

    return (
      <div>
        <h2>Employee Details</h2>
        <p><strong>Name:</strong> {selectedEmployee.name}</p>
        <p><strong>ID:</strong> {selectedEmployee.cashierid}</p>

        {perf && (
          <div>
            <h3>Performance</h3>
            <p><strong>Orders Processed:</strong> {perf.orders_processed}</p>
            <p><strong>Total Sales:</strong> ${parseFloat(perf.total_sales || 0).toFixed(2)}</p>
            <p><strong>Average Order Value:</strong> ${parseFloat(perf.average_order_value || 0).toFixed(2)}</p>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <button 
            onClick={() => fireEmployee(selectedEmployee.name)} 
            style={{ backgroundColor: "#ff4d4d", color: "white", marginRight: 10 }}
          >
            Fire
          </button>
          <button onClick={() => setSelectedEmployee(null)}>Close</button>
        </div>
      </div>
    );
  };

  const renderAddForm = () => (
    <div>
      <h2>Hire New Employee</h2>
      {["name", "address", "email", "phone", "password"].map(field => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}: </label>
          <input 
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            name={field}
            value={newEmployee[field]}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          />
        </div>
      ))}
      <button onClick={hireEmployee} style={{ backgroundColor: "#4CAF50", color: "white", marginRight: 10 }}>Hire</button>
      <button onClick={() => setShowAddForm(false)}>Cancel</button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
    <button onClick={() => navigate('/manager')}>Back to Manager</button>
    <button onClick={() => navigate('/manager/productusagechart')}>Product Usage Chart</button>
    <button onClick={() => navigate('/manager/salesreport')}>Sales Report</button>
    <button onClick={() => navigate('/manager/xreport')}>X Report</button>
    <button onClick={() => navigate('/manager/zreport')}>Z Report</button>
    <button onClick={() => navigate('/manager/inventory')}>Inventory</button></div>
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>

        <h1>Employee Management</h1>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 2 }}>
          {renderEmployeeTable()}
          {renderPerformanceTable()}
        </div>
        <div className="side-panel">
          {selectedEmployee 
            ? renderDetails() 
            : showAddForm 
              ? renderAddForm() 
              : (
                <div>
                  <h2>Employee Management</h2>
                  <p>Select an employee or add a new one.</p>
                  <button 
                    onClick={() => setShowAddForm(true)} 
                    style={{ backgroundColor: "#4CAF50", color: "white" }}
                  >
                    + Hire New Employee
                  </button>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}

export default ManagerEmployee;
