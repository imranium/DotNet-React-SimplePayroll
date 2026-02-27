import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Employee, employeeService } from "./EmployeeService";

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [skillsText, setSkillsText] = useState("");
  const [formData, setFormData] = useState<Employee>({
    fullName: "",
    nationalId: "",
    contactNumber: "",
    residenceAddress: "",
    dateOfBirth: "",
    dailyRate: 0,
    workingDays: "",
    skillsets: [],
    isArchived: false,
  });

  useEffect(() => {
    if (isEdit) {
      loadEmployee();
    }
  }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await employeeService.getEmployeeById(Number(id));
      const emp = response.data;
      setFormData(emp);
      setSkillsText(emp.skillsets.map(s => s.name).join(", "));
    } catch (error) {
      console.error("Failed to load Employee", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSkillsetsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillsText(value);
    
    const skillsArray = value
      .split(",")
      .map((s) => ({ name: s.trim() }))
      .filter(s => s.name !== "");
      
    setFormData({ ...formData, skillsets: skillsArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await employeeService.updateEmployee(Number(id), formData);
      } else {
        await employeeService.addEmployee(formData);
      }
      navigate("/employees");
    } catch (error) {
      alert("Error saving employee details.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {isEdit ? "Edit Employee Profile" : "Register New Employee"}
        </h2>
        <button
          onClick={() => navigate("/employees")}
          className="text-gray-500 hover:text-gray-700 flex items-center text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identity Info</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">NRIC / National ID</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
              <input
                required
                type="date"
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          {/* Contact & Rate */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payroll & Contact</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
              <input
                required
                type="tel"
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Rate (RM)</label>
              <input
                required
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Working Days</label>
              <input
                required
                type="text"
                placeholder="Mon, Tue, Wed..."
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                value={formData.workingDays}
                onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Full width fields */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Residential Address</label>
            <textarea
              required
              rows={2}
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              value={formData.residenceAddress}
              onChange={(e) => setFormData({ ...formData, residenceAddress: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Skillsets (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. React, .NET, SQL"
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              value={skillsText}
              onChange={handleSkillsetsChange}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="px-6 py-2 rounded text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isEdit ? "Update Changes" : "Save Employee")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
