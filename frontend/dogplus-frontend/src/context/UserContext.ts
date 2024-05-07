import { Dispatch, SetStateAction, createContext } from "react";
import { ServiceProviderData, UserData } from "../types/user";

type UserDataType = UserData | ServiceProviderData;
interface UserContextType {
  user: UserDataType | null;
  setUser: Dispatch<SetStateAction<UserDataType | null>>;
}

const initialContextValue: UserContextType = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<UserContextType>(initialContextValue);

export default UserContext;
