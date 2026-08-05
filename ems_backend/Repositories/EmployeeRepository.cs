
using ems_backend.Data;
using ems_backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace ems_backend.Repositories;

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _context;

    public EmployeeRepository(AppDbContext context)
    {
        _context = context;
    }

    // GET ALL with pagination
    public async Task<(IEnumerable<Employee> Employees, int TotalCount)> GetAllAsync(int pageNumber, int pageSize)
    {
        var query = _context.Employees.Include(e => e.Department);
        var total = await query.CountAsync();
        var employees = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
        return (employees, total);
    }

    // GET BY ID
    public async Task<Employee?> GetByIdAsync(int id)
        => await _context.Employees.Include(e => e.Department).FirstOrDefaultAsync(e => e.EmployeeId == id);

    // CREATE
    public async Task<Employee> CreateAsync(Employee employee)
    {
        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();
        return employee;
    }

    // UPDATE
    public async Task<Employee?> UpdateAsync(int id, Employee employee)
    {
        var existing = await _context.Employees.FindAsync(id);
        if (existing == null) return null;

        existing.FirstName = employee.FirstName;
        existing.LastName = employee.LastName;
        existing.Email = employee.Email;
        existing.Phone = employee.Phone;
        existing.DepartmentId = employee.DepartmentId;
        existing.Position = employee.Position;
        existing.Salary = employee.Salary;
        existing.Status = employee.Status;

        await _context.SaveChangesAsync();
        return existing;
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return false;

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return true;
    }

    // SEARCH BY NAME
    public async Task<IEnumerable<Employee>> SearchByNameAsync(string name)
        => await _context.Employees
            .Include(e => e.Department)
            .Where(e => e.FirstName.Contains(name) || e.LastName.Contains(name))
            .ToListAsync();

    // GET BY DEPARTMENT (uses stored procedure)
    public async Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId)
        => await _context.Employees
            .Include(e => e.Department)
            .Where(e => e.DepartmentId == departmentId)
            .ToListAsync();

    // GET ACTIVE EMPLOYEES (uses stored procedure)
    public async Task<IEnumerable<Employee>> GetActiveEmployeesAsync()
        => await _context.Employees
            .Include(e => e.Department)
            .Where(e => e.Status == "Active")
            .ToListAsync();

    // UPDATE STATUS
    public async Task<Employee?> UpdateStatusAsync(int id, string status)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null) return null;

        employee.Status = status;
        await _context.SaveChangesAsync();
        return employee;
    }

    // FILTER
    public async Task<IEnumerable<Employee>> FilterAsync(string? name, int? departmentId, string? status)
    {
        var query = _context.Employees.Include(e => e.Department).AsQueryable();

        if (!string.IsNullOrEmpty(name))
            query = query.Where(e => e.FirstName.Contains(name) || e.LastName.Contains(name));

        if (departmentId.HasValue)
            query = query.Where(e => e.DepartmentId == departmentId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(e => e.Status == status);

        return await query.ToListAsync();
    }
}