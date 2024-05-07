import { ReactNode, useState, useEffect } from "react";
import UserContext from "./UserContext";
import { UserData } from "../types/user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    // Load the user from localStorage when the component initializes
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Save the user to localStorage whenever it changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user"); // Clear the user from localStorage on logout
    }
  }, [user]); // Dependency array: re-run this effect when `user` changes

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
