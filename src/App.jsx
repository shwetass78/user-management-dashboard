import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import UserForm from "./UserForm/UserForm.jsx";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch users from localStorage or the API
  const fetchUsers = async () => {
    const savedUsers = JSON.parse(localStorage.getItem("users"));
    if (savedUsers) {
      setUsers(savedUsers); // Use saved users if available
    } else {
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data); // Fetch from the API if no local users exist
      } catch (error) {
        alert("Error fetching users");
      }
    }
  };

  // Save users to localStorage
  const saveUsersToLocalStorage = (updatedUsers) => {
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // Get the next ID for new user
  const getNextId = () => {
    const lastUser = users[users.length - 1];
    const lastId = lastUser ? lastUser.id : 0; // Default to 0 if no users exist
    return lastId + 1;
  };

  // Add or Edit a user
  const handleAddEditUser = async (user) => {
    let updatedUsers;
    if (currentUser) {
      // Edit user
      updatedUsers = users.map((u) =>
        u.id === currentUser.id ? { ...u, ...user } : u
      );
      setUsers(updatedUsers);
      alert("User updated successfully");
    } else {
      // Add new user with sequential ID
      const newUser = { ...user, id: getNextId() }; // Generate sequential ID
      updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      alert("User added successfully");
    }

    // Save updated users to localStorage
    saveUsersToLocalStorage(updatedUsers);

    // Reset modal and current user
    setShowModal(false);
    setCurrentUser(null);
  };

  // Open the edit modal with user data
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  // Delete a user
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    saveUsersToLocalStorage(updatedUsers);
    alert("User deleted successfully");
  };

  // Open modal to add a new user
  const handleAddUser = () => {
    setCurrentUser(null); // Ensure no user is selected for editing
    setShowModal(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <h1>User Management</h1>
      <button onClick={handleAddUser}>Add User</button>

      <div>
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.department || "Not Available"}</td>{" "}
                {/* Display department */}
                <td>
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <UserForm
          user={currentUser}
          onSubmit={handleAddEditUser}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default App;
