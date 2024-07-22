import { useCallback, useEffect, useRef, useState } from "react";
import TableEmployee from "../../components/TabelEmployee";
import useApi from "../../utils/useApi";
import { Button, Label, TextInput } from "flowbite-react";
import axios from "axios";

const columns = [
  { key: "nip", header: "NIP" },
  { key: "name", header: "Nama" },
  { key: "status", header: "Status" },
  { key: "position", header: "Position" },
];

const initialAddEmployee = {
  nip: "",
  name: "",
  status: "",
  position: "",
};

const Employee = () => {
  const [localEmployee, setLocalEmployee] = useState([]);
  const [newEmployee, setNewEmployee] = useState(initialAddEmployee);
  const [changedEmployees, setChangedEmployees] = useState([]);
  const { data: employees, loading } = useApi(
    "http://localhost:8080/api/employees"
  );

  const timer = useRef(null);

  useEffect(() => {
    if (employees) {
      setLocalEmployee(employees);
    }
  }, [employees]);

  const handleInputChange = (e, id, field) => {
    const newValue = e.target.value;
    const updatedEmployees = localEmployee.map((emp) => {
      if (emp.id === id) {
        return { ...emp, [field]: newValue };
      }
      return emp;
    });
    setLocalEmployee(updatedEmployees);

    setChangedEmployees((prev) => {
      const existingChange = prev.find((emp) => emp.id === id);
      if (existingChange) {
        return prev.map((emp) =>
          emp.id === id ? { ...emp, [field]: newValue } : emp
        );
      } else {
        return [...prev, { id, [field]: newValue }];
      }
    });
  };

  const handleSave = useCallback(async () => {
    try {
      await axios.post("http://localhost:8080/api/employees/bulk", localEmployee);
      const response = await axios.get("http://localhost:8080/api/employees");
      setLocalEmployee(response?.data);
      alert("Data successfully saved");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data");
    }
  }, [localEmployee]);

  useEffect(() => {
    if (changedEmployees.length > 0) {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        handleSave();
        setChangedEmployees([]);
      }, 5000);
    }
  }, [changedEmployees, handleSave]);

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveAddEmployee = async () => {
    if (
      !newEmployee.nip ||
      !newEmployee.name ||
      !newEmployee.status ||
      !newEmployee.position
    ) {
      alert("All fields are required");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/employees",
        newEmployee
      );
      setLocalEmployee([...localEmployee, response?.data]);
      setNewEmployee(initialAddEmployee);
      alert("New employee added successfully");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee");
    }
  };

  return (
    <div className="grid gap-2">
      <h3 className="text-lg text-center font-semibold">Add New Employee</h3>
      <div className="grid gap-4 grid-cols-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="nip" value="Your nip" />
          </div>
          <TextInput
            name="nip"
            placeholder="NIP"
            value={newEmployee?.nip}
            onChange={handleNewEmployeeChange}
            className="mb-2"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name" value="Your name" />
          </div>
          <TextInput
            name="name"
            placeholder="Name"
            value={newEmployee?.name}
            onChange={handleNewEmployeeChange}
            className="mb-2"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="status" value="Your status" />
          </div>
          <TextInput
            name="status"
            placeholder="Status"
            value={newEmployee?.status}
            onChange={handleNewEmployeeChange}
            className="mb-2"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="position" value="Your position" />
          </div>
          <TextInput
            name="position"
            placeholder="Position"
            value={newEmployee?.position}
            onChange={handleNewEmployeeChange}
            className="mb-2"
            required
          />
        </div>
      </div>
      <Button onClick={handleSaveAddEmployee} fullSized>
        Add Employee
      </Button>
      <h3 className="text-lg text-center font-semibold">Table Employee</h3>

      {loading ? (
        <p>loading</p>
      ) : (
        <TableEmployee
          columns={columns}
          data={localEmployee}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default Employee;
