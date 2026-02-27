using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.Repositories;
using backend.Models; 
using backend.Services;  

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IPayrollService _payrollService;

        public EmployeeController(IEmployeeRepository employeeRepository, IPayrollService payrollService)
        {
            _employeeRepository = employeeRepository;
            _payrollService = payrollService;
        }



        [HttpGet]
        public async Task<ActionResult<List<Employee>>> GetAllEmployeesAsync([FromQuery] string? search, [FromQuery] bool showArchived = false)
        {
            var employees = await _employeeRepository.GetAllEmployeesAsync(search, showArchived);
            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployeeById(int id)
        {
            var employee = await _employeeRepository.GetEmployeeById(id);
            return Ok(employee);
        }

        [HttpPost]
        public async Task<ActionResult> AddEmployeeAsync(Employee employee)
        {
            await _employeeRepository.AddEmployeeAsync(employee);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateEmployeeAsync(int id, Employee employee)
        {
            var existingEmployee = await _employeeRepository.GetEmployeeById(employee.Id);
            if (existingEmployee == null)
            {
                return NotFound("No such Employee is found.");
            }
            await _employeeRepository.UpdateEmployeeAsync(employee);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmployeeAsync(int id)
        {
            var existingEmployee = await _employeeRepository.GetEmployeeById(id);
            if (existingEmployee == null)
            {
                return NotFound("No such Employee is found.");
            }
            await _employeeRepository.DeleteEmployeeAsync(id);
            return NoContent();
        }

       [HttpPatch("{id}/archive")]
        public async Task<ActionResult> ArchiveEmployeeAsync(int id)
        {
            var existingGame = await _employeeRepository.GetEmployeeById(id);
            if (existingGame == null) return NotFound();
            await _employeeRepository.ArchiveEmployeeAsync(id);
            return NoContent();
        }
        [HttpPatch("{id}/unarchive")]
        public async Task<ActionResult> UnarchiveEmployeeAsync(int id)
        {
            var existingGame = await _employeeRepository.GetEmployeeById(id);
            if (existingGame == null) return NotFound();
            await _employeeRepository.UnarchiveEmployeeAsync(id);
            return NoContent();
        }

        [HttpGet("{id}/calculate-salary")]
        public async Task<IActionResult> GetSalary(int id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var employee = await _employeeRepository.GetEmployeeById(id);
            if (employee == null) return NotFound();

            decimal totalPay = _payrollService.CalculatePayroll(employee, startDate, endDate);

            return Ok(new
            {
                employeeName = employee.FullName,
                totalPay = totalPay,
                period = $"{startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}"
            });
        }

    }

}
