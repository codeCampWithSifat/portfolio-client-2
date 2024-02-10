import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const { user } = useAuth();
  const axisoSecure = useAxiosSecure();
  const {
    data: cart = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["carts", user?.email],
    queryFn: async () => {
      const res = await axisoSecure.get(`/carts?email=${user.email}`);
      return res.data;
    },
  });
  return [cart, refetch, isLoading];
};

export default useCart;
