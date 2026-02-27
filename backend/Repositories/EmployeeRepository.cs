using System;
using System.Data;
using MySqlConnector;
using Dapper;
using backend.Models;
using System.Runtime.InteropServices;
using System.Data.Common;

namespace backend.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly IConfiguration _configuration;

    public EmployeeRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private DbConnection GetConnection()
    {
        return new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
    }

    public async Task <List<Employee>> GetAllEmployeesAsync(string? search = null, bool showArchived = false)
    {
        using var connection = GetConnection();

        string sql = @"
            SELECT e.*, s.id, s.name
            FROM employees e
            LEFT JOIN employee_skillsets es ON e.Id = es.employee_id
            LEFT JOIN skillsets s ON es.skillset_id = s.id
            WHERE e.is_archived = @ShowArchived";

        if (!string.IsNullOrEmpty(search))
        {
            sql += " AND (e.employee_number LIKE @Search OR e.full_name LIKE @Search)";
        }

        var employeeDictionary = new Dictionary<int, Employee>();

        var list = await connection.QueryAsync<Employee, Skillset, Employee>(
            sql,
            (employee, skillset) => {
                if (!employeeDictionary.TryGetValue(employee.Id, out var currentEmployee))
                {
                    currentEmployee = employee;
                    currentEmployee.Skillsets = new List<Skillset>();
                    employeeDictionary.Add(currentEmployee.Id, currentEmployee);
                }

                if (skillset != null)
                {
                    currentEmployee.Skillsets.Add(skillset);
                }

                return currentEmployee;
            },

            new { Search = $"%{search}%", ShowArchived = showArchived },
            splitOn:"id"
        );

        return employeeDictionary.Values.ToList();

    }
    public async Task <Employee> GetEmployeeById(int id)
    {
        using var connection = GetConnection();
        string sql = @"
            SELECT e.*, s.id, s.name 
            FROM employees e 
            LEFT JOIN employee_skillsets es ON e.id = es.employee_id 
            LEFT JOIN skillsets s ON es.skillset_id = s.id 
            WHERE e.id = @Id";

        Employee result = null;
        
        await connection.QueryAsync<Employee, Skillset, Employee>(
            sql,
            (employee, skillset) => {

                if (result == null)
                {
                result = employee;
                result.Skillsets = new List<Skillset>();
                }

                if (skillset != null && skillset.Id != 0)
                {
                result.Skillsets.Add(skillset);
                }

                return employee;
            },
            new {Id = id},
            splitOn: "id"
        );
        return result;      
    }

    public async Task AddEmployeeAsync(Employee employee)
    {
        string prefix = employee.FullName.Length >= 3
            ? employee.FullName.Substring(0, 3).ToUpper()
            : employee.FullName.ToUpper().PadRight(3, 'X');
          
        string randomPart = Random.Shared.Next(0, 100000).ToString("D5");

        string dob = employee.DateOfBirth.ToString("ddMMMMyyyy").ToUpper();

        employee.EmployeeNumber = $"{prefix}-{randomPart}-{dob}";

        using var connection = GetConnection();
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();

        try {
            // insert employee
            var employeeSql = @"INSERT INTO employees (employee_number, full_name, national_id, contact_number, residence_address, date_of_birth, daily_rate, working_days) 
                                VALUES (@EmployeeNumber, @FullName, @NationalId, @ContactNumber, @ResidenceAddress, @DateOfBirth, @DailyRate, @WorkingDays);
                                SELECT LAST_INSERT_ID();";

            var newId = await connection.QuerySingleAsync<int>(employeeSql, employee, transaction);
            employee.Id = newId;

            // Skillset Handling
            if (employee.Skillsets != null && employee.Skillsets.Any())
            {
                foreach (var skill in employee.Skillsets)
                {
                    // check if skill exists by name
                    var checkSkillSql = @"SELECT * FROM skillsets WHERE name = @Name";
                    var existingSkill = await connection.QueryFirstOrDefaultAsync<Skillset>(checkSkillSql, new { Name = skill.Name }, transaction);

                    int skillId;

                    if (existingSkill == null)
                    {
                        // create new skill if it doesnt exist
                        var insertSkillSql = @"INSERT INTO skillsets (name) VALUES (@Name);
                                               SELECT LAST_INSERT_ID();";
                        skillId = await connection.QuerySingleAsync<int>(insertSkillSql, new { Name = skill.Name }, transaction);
                        
                    }
                    else
                    {
                        skillId = existingSkill.Id;
                    }

                    var pivotSql = "INSERT INTO employee_skillsets(employee_id, skillset_id) VALUES (@EmpId, @SkillId)";
                    await connection.ExecuteAsync(pivotSql, new { EmpId = newId, SkillId = skillId }, transaction);

                }
            }
            await transaction.CommitAsync();
        } catch {
            await transaction.RollbackAsync();
            throw;
        }

    }
    public async Task UpdateEmployeeAsync(Employee employee)
    {
        using var connection = GetConnection();
        await connection.OpenAsync();
        using var transaction = connection.BeginTransaction();

        try 
        {
            // Update employee table
            var updateSql = @"
                            UPDATE employees 
                            SET employee_number = @EmployeeNumber, 
                                    full_name = @FullName, 
                                    national_id = @NationalId, 
                                    contact_number = @ContactNumber, 
                                    residence_address = @ResidenceAddress, 
                                    date_of_birth = @DateOfBirth, 
                                    daily_rate = @DailyRate, 
                                    working_days = @WorkingDays 
                            WHERE Id = @Id";
            await connection.ExecuteAsync(updateSql, employee, transaction);

            // Delete existing entry in employee_skillsets table
            await connection.ExecuteAsync("DELETE FROM employee_skillsets WHERE employee_id = @Id", new { id = employee.Id }, transaction);

            // reinsert skills
            if (employee.Skillsets != null && employee.Skillsets.Any())
            {
                foreach (var skill in employee.Skillsets)
                {
                    // check if skill exists by name
                    var checkSkillSql = @"SELECT id FROM skillsets WHERE name = @Name";
                    var existingSkill = await connection.QueryFirstOrDefaultAsync<Skillset>(checkSkillSql, new { Name = skill.Name }, transaction);

                    int skillId;

                    if (existingSkill == null)
                    {
                        // create new skill if it doesnt exist
                        var insertSkillSql = @"INSERT INTO skillsets (name) VALUES (@Name);
                                               SELECT LAST_INSERT_ID();";
                        skillId = await connection.QuerySingleAsync<int>(insertSkillSql, new { Name = skill.Name }, transaction);
                        
                    }
                    else
                    {
                        skillId = existingSkill.Id;
                    }

                    var pivotSql = "INSERT INTO employee_skillsets(employee_id, skillset_id) VALUES (@EmpId, @SkillId)";
                    await connection.ExecuteAsync(pivotSql, new { EmpId = employee.Id, SkillId = skillId }, transaction);     
                }
            }       

            await transaction.CommitAsync();
        } catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task DeleteEmployeeAsync(int id)
    {
        using var connection = GetConnection();
        await connection.ExecuteAsync("DELETE FROM employees WHERE id = @Id", new { Id = id });
    }
    public async Task ArchiveEmployeeAsync(int id)
    {
        using var connection = GetConnection();
        await connection.ExecuteAsync("UPDATE employees SET is_archived = 1 WHERE id = @Id", new { Id = id });
    }
    public async Task UnarchiveEmployeeAsync(int id)
    {
        using var connection = GetConnection();
        await connection.ExecuteAsync("UPDATE employees SET is_archived = 0 WHERE id = @Id", new { Id = id });
    }

}
