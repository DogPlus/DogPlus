import { ChangeEvent, FormEvent, useState } from "react";
import {
  ServiceProviderData,
  UserCreationData,
  UserData,
  UserRole,
} from "../types/user";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

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

  const { setUser } = useUser();

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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordStrengthCheck(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, and numbers."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    const userData: UserCreationData = {
      username,
      email,
      password,
      role: registerAsServiceProvider
        ? UserRole.ServiceProvider
        : UserRole.User,
      registerAsServiceProvider,
      serviceProviderKey: registerAsServiceProvider
        ? serviceProviderKey
        : undefined,
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_HOST}/api/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(`Registration failed: ${errorMsg}`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.id);

      // Set up new user data including service information for service providers
      const newUser: UserData | ServiceProviderData = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        isApproved: data.is_approved,
        profile_image: data.profile_image,
        ...(data.role === UserRole.ServiceProvider && {
          serviceProviderKey: serviceProviderKey,
        }),
      };

      setUser(newUser);

      if (data.role === UserRole.Admin) {
        navigate("/admin");
      } else if (data.role === UserRole.ServiceProvider) {
        navigate("/serviceprovider/create-service");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl  leading-tight tracking-tight  font-extrabold text-textcolor-0 md:text-2xl">
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
                <span className="text-textcolor-0 ml-2">Register as Service Provider</span>
              </label>
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-textcolor-900"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                placeholder="name@company.com"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="mb-2 text-sm text-start text-textcolor-900"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                placeholder="Your username"
                required
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-textcolor-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-2 text-sm text-start text-textcolor-900"
              >
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
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
                  className="mb-2 text-sm text-start text-textcolor-900"
                >
                  Service Provider Key
                </label>
                <input
                  type="text"
                  id="service-provider-key"
                  placeholder="Enter your service provider key"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-textcolor-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  required={registerAsServiceProvider}
                  value={serviceProviderKey}
                  onChange={handleServiceProviderKeyChange}
                />
              </div>
            )}
            <button
              className="bg-accent w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
              type="submit"
            >
              Register user
            </button>
          </form>
        </div>
    </div>
  );
};
