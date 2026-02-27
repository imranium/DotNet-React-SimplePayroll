using System;
using backend.Models;

namespace backend.Repositories;

public interface IEmployeeRepository
{
    Task <List<Employee>> GetAllEmployeesAsync(string? search = null, bool showArchived = false);
    Task <Employee> GetEmployeeById(int id);
    Task AddEmployeeAsync(Employee employee);
    Task UpdateEmployeeAsync(Employee employee);
    Task DeleteEmployeeAsync(int id);
    Task ArchiveEmployeeAsync(int id);
    Task UnarchiveEmployeeAsync(int id);

}
