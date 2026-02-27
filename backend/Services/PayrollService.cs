using System;
using backend.Models;

namespace backend.Services;

public class PayrollService : IPayrollService
{
    public decimal CalculatePayroll(Employee employee, DateTime start, DateTime end)
    {
        decimal total = 0;
        var workDays = employee.WorkingDays.Split(',').Select(s => s.Trim()).ToList();

        for (DateTime date = start; date <= end; date = date.AddDays(1))
        {
            total += employee.DailyRate;

            string dayName = date.ToString("ddd");
            if (workDays.Contains(dayName))
            {
                total+= employee.DailyRate;
            }

            if (date.Month == employee.DateOfBirth.Month && date.Day == employee.DateOfBirth.Day)
            {
                total+= employee.DailyRate;
            }
        }

        return total;
    }
}
