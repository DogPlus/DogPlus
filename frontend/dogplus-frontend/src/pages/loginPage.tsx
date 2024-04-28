import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { ServiceProviderData, UserData, UserRole } from "../types/user";

export const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.id);

      let userData: UserData | ServiceProviderData = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        isApproved: data.is_approved,
      };

      if (data.role === UserRole.ServiceProvider) {
        userData = {
          ...userData,
          ...(data.service && { service: data.service }),
        };
      }

      setUser(userData);

      switch (data.role) {
        case UserRole.Admin:
          navigate("/admin");
          break;
        case UserRole.ServiceProvider:
          navigate("/serviceprovider/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your username and password.");
    }
  };

  return (
      <div className="container flex flex-col mx-auto rounded-lg pt-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full pb-6 text-center rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-textcolor-0">
                  Dog+
                </h3>
                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-4 text-textcolor-600">Sign in</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <label
                  htmlFor="username"
                  className="mb-2 text-sm text-start text-textcolor-900"
                >
                  Username*
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Insert username"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                <label
                  htmlFor="password"
                  className="mb-2 text-sm text-start text-textcolor-900"
                >
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a password"
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                {errorMessage && (
                  <div className="mb-4 text-sm font-medium text-red-600">
                    {errorMessage}
                  </div>
                )}
                <button
                  className="w-full bg-accent-0 px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-accent-400 focus:ring-4 focus:ring-accent-100"
                  type="submit"
                >
                  Sign In
                </button>
                <p className="text-sm leading-relaxed text-textcolor-900">
                  Not registered yet?{" "}
                  <NavLink to="/register" className="font-bold text-textcolor-700">
                    Create an Account
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
};
