using ems_backend.Data;
using ems_backend.Models;
using Microsoft.EntityFrameworkCore;

namespace ems_backend.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;

    public DepartmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Department>> GetAllAsync()
        => await _context.Departments.ToListAsync();

    public async Task<Department?> GetByIdAsync(int id)
        => await _context.Departments.FindAsync(id);

    public async Task<Department> CreateAsync(Department department)
    {
        _context.Departments.Add(department);
        await _context.SaveChangesAsync();
        return department;
    }

    public async Task<Department?> UpdateAsync(int id, Department department)
    {
        var existing = await _context.Departments.FindAsync(id);
        if (existing == null) return null;

        existing.Name = department.Name;
        existing.Description = department.Description;
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return false;

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return true;
    }
}