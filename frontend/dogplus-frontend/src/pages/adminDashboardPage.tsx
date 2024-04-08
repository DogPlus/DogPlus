import { useEffect, useState } from "react";
import { UserData } from "../types/user";

export const AdminDashboard = () => {
  const [serviceProviders, setServiceProviders] = useState<UserData[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/service-providers/pending/")
      .then((response) => {
        console.log(response);
        return response.json();
      })

      .then((data) => {
        if (Array.isArray(data)) {
          setServiceProviders(data);
        } else {
          console.error("Expected an array, but received:", data);
          setServiceProviders([]);
        }
      });
  }, []);

  const approveServiceProvider = (userId: string) => {
    // Placeholder URL - replace with your actual endpoint
    const url = `http://localhost:8000/api/auth//service-providers/approve/${userId}`;
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
      <ul className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {serviceProviders.map((user: UserData) => (
          <li
            key={user.id}
            className="px-6 py-4 flex justify-between items-center"
          >
            <span className="text-gray-600">{user.username}</span>
            <button
              onClick={() => approveServiceProvider(user.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Approve
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
