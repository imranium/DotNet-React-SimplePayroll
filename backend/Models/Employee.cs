using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Employee
{
    [Key]
    public int Id { get; set; }
    public string? EmployeeNumber { get; set; }

    public string FullName { get; set; }
    public string NationalId { get; set; }
    public string ContactNumber { get; set; }
    public string ResidenceAddress { get; set; }
    public DateTime DateOfBirth { get; set; }
    public decimal DailyRate { get; set; }
    public string WorkingDays { get; set; }
    public bool IsArchived { get; set; }
    public List<Skillset> Skillsets { get; set; } = new List<Skillset>();

}
