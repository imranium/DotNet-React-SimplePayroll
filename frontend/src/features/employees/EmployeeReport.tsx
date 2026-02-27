import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calculator, 
  ArrowLeft, 
  Loader2, 
  FileText
} from "lucide-react";
import { Employee, employeeService, PayrollReport } from "./EmployeeService";

const EmployeeReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [report, setReport] = useState<PayrollReport | null>(null);
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await employeeService.getEmployeeById(Number(id));
      setEmployee(response.data);
    } catch (error) {
      console.error("Failed to load employee", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const response = await employeeService.calculateSalary(Number(id), startDate, endDate);
      setReport(response.data);
    } catch (error) {
      alert("Error calculating salary.");
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!employee) return <div className="text-center py-10 font-bold">Employee not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Calculator className="text-green-600" size={24} />
          Payroll Calculator
        </h2>
        <button
          onClick={() => navigate("/employees")}
          className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Basic Info*/}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Employee</h3>
            <div className="font-bold text-lg">{employee.fullName}</div>
            <div className="text-sm text-blue-600 mb-4">{employee.employeeNumber}</div>
            <div className="space-y-2 text-sm text-gray-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Daily Rate:</span>
                <span className="font-bold">RM {employee.dailyRate}</span>
              </div>
              <div className="flex justify-between">
                <span>Work Days:</span>
                <span className="font-bold">{employee.workingDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">Select Pay Period</h3>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border rounded text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                disabled={calculating}
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700 transition disabled:opacity-50"
              >
                {calculating ? "Calculating..." : "Calculate Total Pay"}
              </button>
            </form>
          </div>

          {/* Results */}
          {report && (
            <div className="bg-white rounded border border-gray-200 shadow-md overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              
              <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Statement</span>
                <FileText size={16} className="text-gray-400" />
              </div>

              <div className="p-10 text-center">
                <div className="text-gray-500 text-xs font-bold uppercase mb-2">Total Amount Payable</div>
                <div className="text-4xl font-black text-gray-900">
                  <span className="text-xl font-bold text-gray-300 mr-2">RM</span>
                  {report.totalPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="mt-4 text-xs font-medium text-gray-400 px-3 py-1 bg-gray-50 rounded-full inline-block">
                  Period: {report.period}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeReport;
