// src/contexts/UserContext.tsx
import { Dispatch, SetStateAction, createContext } from "react";
import { UserData } from "../types/user";

interface UserContextType {
  user: UserData | null;
  setUser: Dispatch<SetStateAction<UserData | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default UserContext;
