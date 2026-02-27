using System;
using backend.Models;
namespace backend.Services;

public interface IPayrollService
{
    decimal CalculatePayroll(Employee employee, DateTime start, DateTime end);
}
