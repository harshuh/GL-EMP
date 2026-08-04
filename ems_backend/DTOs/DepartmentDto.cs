namespace ems_backend.DTOs;

public class DepartmentDto
{
	public int DepartmentId { get; set; }
	public string Name { get; set; } = string.Empty;
	public string? Description { get; set; }
}

public class CreateDepartmentDto
{
	public string Name { get; set; } = string.Empty;
	public string? Description { get; set; }
}