import { useEffect, useState } from "react";
import { UserData } from "../types/user";

export const AdminDashboard = () => {
  const [serviceProviders, setServiceProviders] = useState<UserData[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/service-providers/pending")
      .then((response) => response.json())
      .then(setServiceProviders);
  }, []);

  const approveServiceProvider = (userId: string) => {
    // Placeholder URL - replace with your actual endpoint
    const url = `http://localhost:8000/api/service-providers/approve/${userId}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Include authorization token if needed
      },
    })
      .then(() => {
        // Update the UI accordingly
        // For simplicity, you could refetch the serviceProviders list or update the state directly
        setServiceProviders(
          serviceProviders.filter((user) => user.id !== userId)
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        {serviceProviders.map((user: UserData) => (
          <li key={user.id}>
            {user.username} -{" "}
            <button onClick={() => approveServiceProvider(user.id)}>
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
