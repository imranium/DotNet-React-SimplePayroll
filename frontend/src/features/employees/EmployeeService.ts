import api from "../../api/axiosInstance";

export interface Skillset {
  id?: number;
  name: string;
}

export interface Employee {
  id?: number;
  employeeNumber?: string;
  fullName: string;
  nationalId: string;
  contactNumber: string;
  residenceAddress: string;
  dateOfBirth: string;
  dailyRate: number;
  workingDays: string;
  skillsets: Skillset[];
  isArchived: boolean;
}

export interface PayrollReport {
  employeeName: string;
  totalPay: number;
  period: string;
}

export const employeeService = {
  getAllEmployees: (search?: string, showArchived: boolean = false) =>
    api.get<Employee[]>("/Employee", { params: { search, showArchived } }),
  getEmployeeById: (id: number) => api.get<Employee>(`/Employee/${id}`),
  addEmployee: (emp: Employee) => api.post("/Employee", emp),
  updateEmployee: (id: number, emp: Employee) => api.put(`/Employee/${id}`, emp),
  deleteEmployee: (id: number) => api.delete(`/Employee/${id}`),
  archiveEmployee: (id: number) => api.patch(`/Employee/${id}/archive`),
  unarchiveEmployee: (id: number) => api.patch(`/Employee/${id}/unarchive`),
  calculateSalary: (id: number, startDate: string, endDate: string) => 
    api.get<PayrollReport>(`/Employee/${id}/calculate-salary`, { 
      params: { startDate, endDate } 
    }),
};
