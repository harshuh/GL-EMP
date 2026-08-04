namespace ems_backend.DTOs;

public class EmployeeDto
{
    public int EmployeeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string? Position { get; set; }
    public decimal Salary { get; set; }
    public DateTime HireDate { get; set; }
    public string Status { get; set; } = string.Empty;
}

public class CreateEmployeeDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int DepartmentId { get; set; }
    public string? Position { get; set; }
    public decimal Salary { get; set; }
    public string Status { get; set; } = "Active";
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}