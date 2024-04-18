import { ChangeEvent, FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import { UserData, UserRole } from "../types/user";

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

  const handleSubmit = async (event: FormEvent) => {
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
      const userData: UserData = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        isApproved: data.is_approved,
      };

      setUser(userData);
      if (data.role === UserRole.Admin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="bg-white rounded-lg py-5">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
              >
                <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                  Dog Plus
                </h3>
                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-4 text-grey-600">Sign in</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <label
                  htmlFor="username"
                  className="mb-2 text-sm text-start text-grey-900"
                >
                  Username*
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Insert username"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                <label
                  htmlFor="password"
                  className="mb-2 text-sm text-start text-grey-900"
                >
                  Password*
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a password"
                  className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                {errorMessage && (
                  <div className="mb-4 text-sm font-medium text-red-600">
                    {errorMessage}
                  </div>
                )}
                <button
                  className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                  type="submit"
                >
                  Sign In
                </button>
                <p className="text-sm leading-relaxed text-grey-900">
                  Not registered yet?{" "}
                  <NavLink to="/register" className="font-bold text-grey-700">
                    Create an Account
                  </NavLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
