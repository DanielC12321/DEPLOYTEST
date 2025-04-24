import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./managerEmployee.css"; // Import the new CSS file

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

  const APIURL = process.env.REACT_APP_API_URL;

  // Load data when component mounts
  useEffect(() => {
    // Fetch employee data with all details
    fetchEmployees();
    fetchPerformanceData();
  }, []);

  // Fetch functions to load data from backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${APIURL}/all_cashier_data`);
      const data = await response.json();
      console.log("Employees data:", data);
      setEmployees(data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`${APIURL}/cashier_performances`);
      const data = await response.json();
      console.log("Performance data:", data);
      setEmployeePerformance(data);
    } catch (err) {
      console.error("Failed to fetch performance data", err);
    }
  };

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
      const res = await fetch(`${APIURL}/hire_employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          email,
          phone: phone,
          password
        }),
      });

      if (res.ok) {
        alert(`Employee ${name} has been hired successfully!`);
        setNewEmployee({ name: "", address: "", email: "", phone: "", password: "" });
        setShowAddForm(false);
        
        // Refresh employee list
        fetchEmployees();
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
      const res = await fetch(`${APIURL}/fire_employee`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        alert(`Employee ${name} has been fired.`);
        setSelectedEmployee(null);
        
        // Refresh employee list
        fetchEmployees();
        fetchPerformanceData();
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
    <div className="employee-table-container">
      <h2 className="employee-section-heading">Employees</h2>
      <div className="employee-scroll-box">
        <table className="employee-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.cashierid}>
                <td>{emp.cashierid}</td>
                <td>{emp.name}</td>
                <td>
                  <button 
                    className="employee-btn employee-details-btn"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    Details
                  </button>
                  <button 
                    className="employee-btn employee-fire-btn"
                    onClick={() => fireEmployee(emp.name)}
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
    <div className="employee-table-container">
      <h2 className="employee-section-heading">Performance Metrics</h2>
      <div className="employee-scroll-box">
        <table className="employee-table">
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
                <td>${emp.total_sales || "0.00"}</td>
                <td>${emp.average_order_value || "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const renderDetails = () => {
    if (!selectedEmployee) return null;
    
    // Find performance data for the selected employee
    const perf = employeePerformance.find(e => 
      String(e.cashierid) === String(selectedEmployee.cashierid)
    );

    return (
      <div className="employee-details">
        <h2 className="employee-section-heading">Employee Details</h2>
        <p><strong>Name:</strong> {selectedEmployee.name}</p>
        <p><strong>ID:</strong> {selectedEmployee.cashierid}</p>
        <p><strong>Address:</strong> {selectedEmployee.address || ""}</p>
        <p><strong>Email:</strong> {selectedEmployee.email || ""}</p>
        <p><strong>Phone:</strong> {selectedEmployee.phonenumber || ""}</p>

        {perf && (
          <div className="employee-performance">
            <h3 className="employee-section-heading">Performance</h3>
            <p><strong>Orders Processed:</strong> {perf.orders_processed || 0}</p>
            <p><strong>Total Sales:</strong> ${perf.total_sales || "0.00"}</p>
            <p><strong>Average Order Value:</strong> ${perf.average_order_value || "0.00"}</p>
          </div>
        )}

        <div className="employee-button-group">
          <button 
            className="employee-btn employee-fire-btn"
            onClick={() => fireEmployee(selectedEmployee.name)}
          >
            Fire
          </button>
          <button 
            className="employee-btn employee-close-btn"
            onClick={() => setSelectedEmployee(null)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderAddForm = () => (
    <div>
      <h2 className="employee-section-heading">Hire New Employee</h2>
      {["name", "address", "email", "phone", "password"].map(field => (
        <div key={field} className="employee-form-group">
          <label>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>
          <input 
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            name={field}
            value={newEmployee[field]}
            onChange={handleInputChange}
            className="employee-form-input"
          />
        </div>
      ))}
      <div className="employee-button-group">
        <button 
          className="employee-btn employee-hire-btn"
          onClick={hireEmployee}
        >
          Hire
        </button>
        <button 
          className="employee-btn employee-cancel-btn"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const toManager = () => {
    navigate("/manager");
  }

  return (
      <div className="employee-manager-container">
        <div className="divs" id="div1">
          <button onClick={toManager} id="back">Manager Home</button>
        </div>

        <div className="employee-page-title">
          <h1>Employee Management</h1>
        </div>

        <div className="employee-content-layout">
          <div className="employee-main-content">
            {renderEmployeeTable()}
            {renderPerformanceTable()}
          </div>
          <div className="employee-side-panel">
            {selectedEmployee
                ? renderDetails()
                : showAddForm
                    ? renderAddForm()
                    : (
                        <div>
                          <h2 className="employee-section-heading">Employee Management</h2>
                          <p> .</p>
                          <button
                              className="employee-btn employee-hire-btn"
                              onClick={() => setShowAddForm(true)}
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