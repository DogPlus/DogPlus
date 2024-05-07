import { toast } from "react-hot-toast";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/auth";
  return true;
}
  
