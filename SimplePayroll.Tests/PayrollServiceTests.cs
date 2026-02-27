using Xunit;
using backend.Models;
using backend.Services;

public class PayrollServiceTests
{
    private readonly IPayrollService _payrollService;

    public PayrollServiceTests()
    {
        _payrollService = new PayrollService();
    }

    [Fact]
    public void CalculatePayroll_RazakSample_ShouldReturn1050()
    {
        var employee = new Employee { 
            DailyRate = 150, 
            WorkingDays = "Tue, Wed, Fri", 
            DateOfBirth = new DateTime(1994, 1, 10) 
        };
        var start = new DateTime(2025, 5, 13); // Tue
        var end = new DateTime(2025, 5, 16);   // Fri (Tue, Wed, Thu, Fri = 4 days total)

        var result = _payrollService.CalculatePayroll(employee, start, end);

        // Assert
        // Base: 4 days * 150 = 600
        // Work Bonus: 3 days (Tue, Wed, Fri) * 150 = 450
        // Total = 1050
        Assert.Equal(1050, result);
    }

    [Fact]
    public void CalculatePayroll_BirthdayBonus_WhenNotWorkingDay_ShouldAddDailyRate()
    {
        var employee = new Employee { 
            DailyRate = 100, 
            WorkingDays = "Mon", 
            DateOfBirth = new DateTime(2001, 10, 14) 
        };
        var start = new DateTime(2026, 10, 14); // Oct 14 is Wed
        var end = new DateTime(2026, 10, 14);

        var result = _payrollService.CalculatePayroll(employee, start, end);

        // Assert
        // Base: 1 day * 100 = 100
        // Work Bonus: 0 (It's Wed) = 0
        // Bday Bonus: 1 day * 100 = 100
        // Total = 200
        Assert.Equal(200, result);
    }

    [Fact]
    public void CalculatePayroll_BirthdayOnWorkingDay_ShouldReturnTriplePay()
    {
        var employee = new Employee { 
            DailyRate = 100, 
            WorkingDays = "Mon", 
            DateOfBirth = new DateTime(1995, 3, 2) 
        };
        var start = new DateTime(2026, 3, 2); // March 2, 2026 is Monday
        var end = new DateTime(2026, 3, 2);

        var result = _payrollService.CalculatePayroll(employee, start, end);

        // Assert
        // Base: 100 + Work Bonus: 100 + Bday Bonus: 100 = 300
        Assert.Equal(300, result);
    }
}