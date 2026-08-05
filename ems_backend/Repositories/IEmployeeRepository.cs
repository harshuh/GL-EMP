using ems_backend.Models;

namespace ems_backend.Repositories;

public interface IEmployeeRepository
{
    Task<(IEnumerable<Employee> Employees, int TotalCount)> GetAllAsync(int pageNumber, int pageSize);
    Task<Employee?> GetByIdAsync(int id);
    Task<Employee> CreateAsync(Employee employee);
    Task<Employee?> UpdateAsync(int id, Employee employee);
    Task<bool> DeleteAsync(int id);
    Task<IEnumerable<Employee>> SearchByNameAsync(string name);
    Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId);
    Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
    Task<Employee?> UpdateStatusAsync(int id, string status);
    Task<IEnumerable<Employee>> FilterAsync(string? name, int? departmentId, string? status);
}