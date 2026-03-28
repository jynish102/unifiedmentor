import axios from "axios";

export const getDashboardData = async () => {
  const res = await axios.get("http://localhost:5000/api/dashboard/admin");
  return res.data;
};
