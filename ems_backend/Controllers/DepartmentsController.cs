
using ems_backend.DTOs;
using ems_backend.Models;
using ems_backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace ems_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentRepository _repo;

    public DepartmentsController(IDepartmentRepository repo)
    {
        _repo = repo;
    }

    // GET /api/departments
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var departments = await _repo.GetAllAsync();
        var result = departments.Select(d => new DepartmentDto
        {
            DepartmentId = d.DepartmentId,
            Name = d.Name,
            Description = d.Description
        });
        return Ok(result);
    }

    // GET /api/departments/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var department = await _repo.GetByIdAsync(id);
        if (department == null) return NotFound(new { message = "Department not found" });

        return Ok(new DepartmentDto
        {
            DepartmentId = department.DepartmentId,
            Name = department.Name,
            Description = department.Description
        });
    }

    // POST /api/departments
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
    {
        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description
        };

        var created = await _repo.CreateAsync(department);
        return CreatedAtAction(nameof(GetById), new { id = created.DepartmentId }, new DepartmentDto
        {
            DepartmentId = created.DepartmentId,
            Name = created.Name,
            Description = created.Description
        });
    }

    // PUT /api/departments/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateDepartmentDto dto)
    {
        var department = new Department
        {
            Name = dto.Name,
            Description = dto.Description
        };

        var updated = await _repo.UpdateAsync(id, department);
        if (updated == null) return NotFound(new { message = "Department not found" });

        return Ok(new DepartmentDto
        {
            DepartmentId = updated.DepartmentId,
            Name = updated.Name,
            Description = updated.Description
        });
    }

    // DELETE /api/departments/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _repo.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = "Department not found" });

        return Ok(new { message = "Department deleted successfully" });
    }
}