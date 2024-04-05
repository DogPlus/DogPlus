import { ChangeEvent, FormEvent, useState } from "react";
import { UserData } from "../types/user";
import { useNavigate } from "react-router-dom";
export const RegisterPage = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [registerAsServiceProvider, setRegisterAsServiceProvider] =
    useState<boolean>(false);
  const [serviceProviderKey, setServiceProviderKey] = useState<string>("");
  const navigate = useNavigate();

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleServiceProviderKeyChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setServiceProviderKey(event.target.value);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const passwordStrengthCheck = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check password strength
    if (!passwordStrengthCheck(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase and numbers."
      );
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Reset error state if successful
    setError("");

    const userData: UserData = {
      username,
      email,
      password,
      registerAsServiceProvider,
      serviceProviderKey: registerAsServiceProvider
        ? serviceProviderKey
        : undefined,
    };

    try {
      console.log("Userdata: " + JSON.stringify(userData));
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      navigate("/home");
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl  leading-tight tracking-tight  font-extrabold text-dark-grey-900 md:text-2xl">
            Create an account
          </h1>
          {error && <div className="text-red-500">{error}</div>}

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={registerAsServiceProvider}
                  onChange={() =>
                    setRegisterAsServiceProvider(!registerAsServiceProvider)
                  }
                />
                <span className="ml-2">Register as Service Provider</span>
              </label>
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                placeholder="name@company.com"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                placeholder="Your username"
                required
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 text-sm text-start text-grey-900"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </div>
            {/* Service Provider Key Input */}
            {registerAsServiceProvider && (
              <div>
                <label
                  htmlFor="service-provider-key"
                  className="mb-2 text-sm text-start text-grey-900"
                >
                  Service Provider Key
                </label>
                <input
                  type="text"
                  id="service-provider-key"
                  placeholder="Enter your service provider key"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  required={registerAsServiceProvider}
                  value={serviceProviderKey}
                  onChange={handleServiceProviderKeyChange}
                />
              </div>
            )}
            <button
              className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
              type="submit"
            >
              Register user
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
