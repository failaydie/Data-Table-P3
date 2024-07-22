package com.example.manage_employee.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.manage_employee.models.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}
