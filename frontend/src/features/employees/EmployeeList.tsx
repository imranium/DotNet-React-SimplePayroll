import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Employee, employeeService } from "./EmployeeService";
import {
  Archive,
  ArchiveRestore,
  Edit,
  Loader2,
  Plus,
  Trash2,
  Search,
  Calculator,
  UserCircle,
} from "lucide-react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadEmployees(searchTerm, showArchived);
  }, [showArchived]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadEmployees(searchTerm, showArchived);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  },[searchTerm]);

  const loadEmployees = async (search?: string, archived: boolean = false) => {
    try {
      const response = await employeeService.getAllEmployees(search, archived);
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) return;
    if (!window.confirm("Delete this employee?")) return;

    try {
      await employeeService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      alert("Error deleting employee.");
    }
  };

  const handleArchive = async (id: number | undefined) => {
    if (id === undefined) return;
    if (!window.confirm("Archive this employee?")) return;

    try {
      await employeeService.archiveEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Archive failed", error);
    }
  };

  const handleUnarchive = async (id: number | undefined) => {
    if (id === undefined) return;
    try {
      await employeeService.unarchiveEmployee(id);
      loadEmployees(searchTerm, showArchived);
    } catch (error) {
      console.error("Unarchive failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold">Manage Employees</h2>
          <Link
            to="/employees/add"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={18} className="mr-2" /> Add New
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or employee number..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:ring-2 focus:ring-blue-600 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center shrink-0">
            <input
              type="checkbox"
              id="archived"
              className="h-4 w-4 text-blue-600 rounded"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            <label
              htmlFor="archived"
              className="ml-2 text-sm text-gray-700 font-medium"
            >
              Archived Only
            </label>
          </div>
        </div>
      </div>

      {/* Employees Table*/}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">

          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-medium">
            <tr>
              <th className="px-6 py-4 font-semibold">Employee Details</th>
              <th className="px-6 py-4 font-semibold">Contacts</th>
              <th className="px-6 py-4 font-semibold">Skillsets</th>
              <th className="px-6 py-4 font-semibold">Payroll</th>
              <th className="px-6 py-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 transition">

                    {/* Employee Details */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {employee.fullName}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      {employee.employeeNumber}
                    </div>
                  </td>

                    {/* Contacts */}
                  <td className="px-6 py-4 text-gray-600">
                    <div>{employee.contactNumber}</div>
                    <div className="text-xs truncate max-w-[150px]">
                      {employee.residenceAddress}
                    </div>
                  </td>

                    {/* Skillsets */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.skillsets?.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </td>

                    {/* Payroll */}
                  <td className="px-6 py-4">
                    <div className="font-semibold">RM {employee.dailyRate}</div>
                    <div className="text-[10px] text-gray-500 uppercase">
                      {employee.workingDays}
                    </div>
                  </td>

                    {/* Actions */}   
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-3">
                      <Link
                        to={`/employees/edit/${employee.id}`}
                        className="text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>

                      <Link
                        to={`/employees/report/${employee.id}`}
                        className="text-gray-400 hover:text-green-600"
                        title="Calculate"
                      >
                        <Calculator size={18} />
                      </Link>

                      {employee.isArchived ? (
                        <button
                          onClick={() => handleUnarchive(employee.id!)}
                          className="text-gray-400 hover:text-orange-600"
                          title="Restore"
                        >
                          <ArchiveRestore size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleArchive(employee.id!)}
                          className="text-gray-400 hover:text-orange-600"
                          title="Archive"
                        >
                          <Archive size={18} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(employee.id!)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info*/}
      <div className="bg-gray-50 px-6 py-4 text-[11px] text-gray-700 border-t border-gray-100 italic">
        * Calculation logic:1x daily rate for non working days, 2x daily rate for workdays, +1x daily rate bonus
        for birthdays.
      </div>
    </div>
  );
};

export default EmployeeList;
