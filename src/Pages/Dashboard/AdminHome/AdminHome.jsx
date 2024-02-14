import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingButton from "../../../Components/LoadingButton";

const AdminHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-stats");
      return res.data;
    },
  });
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <div className="max-w-screen-md mx-auto">
      <h2 className="text-3xl text-center text-indigo-600 ">
        <span>Hi Welcome {user.displayName ? user.displayName : ""}</span>
      </h2>

      <div className="mt-20">
        <div className="stats shadow">
          <div className="stat text-center bg-indigo-600 text-white">
            <div className="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current text-pink-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Total Revenue</div>
            <div className="stat-value">$ {stats.revenue}</div>
          </div>

          <div className="stat text-center bg-pink-500 ">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div className="stat-title text-white">Total Users</div>
            <div className="stat-value text-white"> {stats.users}</div>
          </div>

          <div className="stat bg-indigo-600 text-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title text-white">Menu Items</div>
            <div className="stat-value text-white">{stats.menuItems}</div>
          </div>
          <div className="stat bg-pink-500 text-center">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title text-white">Total Orders</div>
            <div className="stat-value text-white">{stats.orders}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
