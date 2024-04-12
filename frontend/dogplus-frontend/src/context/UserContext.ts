// src/contexts/UserContext.tsx
import { Dispatch, SetStateAction, createContext } from "react";
import { UserData } from "../types/user";

interface UserContextType {
  user: UserData | null;
  setUser: Dispatch<SetStateAction<UserData | null>>;
}

const initialContextValue: UserContextType = {
  user: null,
  setUser: () => {}, // Provide a dummy function for setUser
};

const UserContext = createContext<UserContextType>(initialContextValue);

export default UserContext;
