// src/providers/UserProvider.tsx
import { ReactNode, useState } from "react";
import { UserData } from "../types/user";
import UserContext from "./UserContext";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
