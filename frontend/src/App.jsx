import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import EmployeeList from "./features/employees/EmployeeList";
import EmployeeForm from "./features/employees/EmployeeForm";
import EmployeeReport from "./features/employees/EmployeeReport";
import { Users } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">

        {/* Navbar */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">

              <Link to="/" className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600"/>
                <span className="text-xl font-bold tracking-tight">Complete Developer Network Payroll System</span>
              </Link>

              <nav className="flex items-center space-x-6">
                <Link to="/employees" className="text-sm font-medium hover:text-blue-600 transition">
                  Employees
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-grow container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/employees" replace />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/employees/add" element={<EmployeeForm />} />
            <Route path="/employees/edit/:id" element={<EmployeeForm />} />
            <Route path="/employees/report/:id" element={<EmployeeReport />} />
            <Route path="*" element={<Navigate to="/employees" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
            &copy; 2026 Muhammad Syafi Imran for Complete Developer Network (CDN) - Simple Payroll System
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
