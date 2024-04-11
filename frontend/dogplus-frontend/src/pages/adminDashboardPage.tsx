import { useEffect, useState } from "react";
import { ServiceProviderData } from "../types/user";

export const AdminDashboard = () => {
  const [serviceProviders, setServiceProviders] = useState<
    ServiceProviderData[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      `${process.env.REACT_APP_BACKEND_HOST}/api/auth/service-providers/pending/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setServiceProviders(data.map((item) => ({ ...item, id: item.uuid })));
        } else {
          setServiceProviders([]);
        }
      });
  }, []);

  const approveServiceProvider = (userId: string) => {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/auth/service-providers/approve/${userId}`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
        setServiceProviders(
          serviceProviders.filter((user) => user.id !== userId)
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  const rejectServiceProvider = (userId: string) => {
    const token = localStorage.getItem("token");
    const url = `${process.env.REACT_APP_BACKEND_HOST}/api/auth/service-providers/delete/${userId}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
        setServiceProviders(
          serviceProviders.filter((user) => user.id !== userId)
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark-grey-900 mb-4">
        Admin Dashboard
      </h1>
      <ul className="bg-white shadow rounded-lg divide-y divide-grey-500">
        {serviceProviders.map((user) => (
          <li
            key={user.id}
            className="flex flex-col sm:flex-row justify-between items-center p-4"
          >
            <div className="flex flex-col sm:flex-row justify-start items-center mb-4 sm:mb-0">
              <span className="text-grey-900 font-medium">{user.username}</span>
              {user.serviceProviderKey && (
                <span className="ml-4 text-grey-600">
                  Authentication Key: {user.serviceProviderKey}
                </span>
              )}
            </div>
            <div className="flex flex-row justify-center items-center">
              <button
                onClick={() => approveServiceProvider(user.id)}
                className="px-4 py-2 text-sm font-medium leading-none text-white transition duration-300 rounded-md hover:bg-purple-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-blue-100 bg-purple-blue-500 mr-2"
              >
                Approve
              </button>
              <button
                onClick={() => rejectServiceProvider(user.id)}
                className="px-4 py-2 text-sm font-medium leading-none text-white transition duration-300 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-100 bg-red-500"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
