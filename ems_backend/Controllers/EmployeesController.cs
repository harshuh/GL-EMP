using ems_backend.DTOs;
using ems_backend.Models;
using ems_backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ems_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeRepository _repo;

    public EmployeesController(IEmployeeRepository repo)
    {
        _repo = repo;
    }

    // Map Employee to EmployeeDto
    private static EmployeeDto MapToDto(Employee e) => new EmployeeDto
    {
        EmployeeId = e.EmployeeId,
        FirstName = e.FirstName,
        LastName = e.LastName,
        Email = e.Email,
        Phone = e.Phone,
        DepartmentId = e.DepartmentId,
        DepartmentName = e.Department?.Name,
        Position = e.Position,
        Salary = e.Salary,
        HireDate = e.HireDate,
        Status = e.Status
    };

    // GET /api/employees?pageNumber=1&pageSize=10
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var (employees, total) = await _repo.GetAllAsync(pageNumber, pageSize);
        return Ok(new
        {
            totalCount = total,
            pageNumber,
            pageSize,
            data = employees.Select(MapToDto)
        });
    }

    // GET /api/employees/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var employee = await _repo.GetByIdAsync(id);
        if (employee == null) return NotFound(new { message = "Employee not found" });
        return Ok(MapToDto(employee));
    }

    // POST /api/employees
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            DepartmentId = dto.DepartmentId,
            Position = dto.Position,
            Salary = dto.Salary,
            Status = dto.Status
        };

        var created = await _repo.CreateAsync(employee);
        return CreatedAtAction(nameof(GetById), new { id = created.EmployeeId }, MapToDto(created));
    }

    // PUT /api/employees/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Phone = dto.Phone,
            DepartmentId = dto.DepartmentId,
            Position = dto.Position,
            Salary = dto.Salary,
            Status = dto.Status
        };

        var updated = await _repo.UpdateAsync(id, employee);
        if (updated == null) return NotFound(new { message = "Employee not found" });
        return Ok(MapToDto(updated));
    }

    // DELETE /api/employees/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Employee not found" });
        return Ok(new { message = "Employee deleted successfully" });
    }

    // GET /api/employees/search?name=Ali
    [HttpGet("search")]
    public async Task<IActionResult> SearchByName([FromQuery] string name)
    {
        var employees = await _repo.SearchByNameAsync(name);
        return Ok(employees.Select(MapToDto));
    }

    // GET /api/employees/department/{departmentId}
    [HttpGet("department/{departmentId}")]
    public async Task<IActionResult> GetByDepartment(int departmentId)
    {
        var employees = await _repo.GetByDepartmentAsync(departmentId);
        return Ok(employees.Select(MapToDto));
    }

    // GET /api/employees/status/active
    [HttpGet("status/active")]
    public async Task<IActionResult> GetActive()
    {
        var employees = await _repo.GetActiveEmployeesAsync();
        return Ok(employees.Select(MapToDto));
    }

    // PATCH /api/employees/{id}/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var updated = await _repo.UpdateStatusAsync(id, dto.Status);
        if (updated == null) return NotFound(new { message = "Employee not found" });
        return Ok(MapToDto(updated));
    }

    // GET /api/employees/filter?name=Ali&departmentId=1&status=Active
    [HttpGet("filter")]
    public async Task<IActionResult> Filter([FromQuery] string? name, [FromQuery] int? departmentId, [FromQuery] string? status)
    {
        var employees = await _repo.FilterAsync(name, departmentId, status);
        return Ok(employees.Select(MapToDto));
    }
}