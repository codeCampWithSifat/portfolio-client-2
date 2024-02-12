import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // raw set the header
  // const token = localStorage.getItem("access-token");
  // const { data: users = [], refetch } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: async () => {
  //     const res = await axiosSecure.get("/users", {
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //       },
  //     });
  //     return res.data;
  //   },
  // });

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${user.name} Make As An Admin`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes,!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: `Make Admin Successfully`,
              text: `${user.email} is Admin Now`,
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleDeleteUser = (user) => {
    console.log(user);
    Swal.fire({
      title: "Are you sure?",
      text: ` Are You Sure You Want To Delete ${user.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes Delete ${user.name}`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: ` ${user.name} Deleted Successfully`,
              icon: "success",
            });
          }
        });
      }
    });
  };

  return (
    <div>
      <Helmet>
        <title>All || Users</title>
      </Helmet>
      <div className="overflow-x-auto max-w-screen-lg mx-auto">
        <div className="text-center mt-10">
          <h2 className="text-indigo-800 text-lg"> AllUsers {users.length}</h2>
        </div>
        <table className="table mt-16 ">
          {/* head */}
          <thead className="bg-indigo-600 text-white text-lg rounded-xl">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  {user.role === "admin" ? (
                    <button className="btn btn-ghost btn-sm text-indigo-800 font-bold">
                      Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeAdmin(user)}
                      className="btn bg-indigo-600 text-white btn-sm hover:bg-indigo-600 hover:text-black"
                    >
                      Make Admin
                    </button>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="btn btn-error btn-sm text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
