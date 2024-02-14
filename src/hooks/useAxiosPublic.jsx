import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://protfolio-server-2.vercel.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
