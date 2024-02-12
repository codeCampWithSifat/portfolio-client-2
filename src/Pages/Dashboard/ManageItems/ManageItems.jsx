import { Link } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle";
import useMenu from "../../../hooks/useMenu";
import useAuth from "../../../hooks/useAuth";
import LoadingButton from "../../../Components/LoadingButton";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageItems = () => {
  const [menu, menuLoading, refetch] = useMenu();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  if (menuLoading) {
    return <LoadingButton />;
  }

  const handleDeleteItem = (item) => {
    Swal.fire({
      title: `Are you sure? Admin ${user.displayName}`,
      text: "You Want To Delete This Menu Item",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/menu/${item._id}`).then((res) => {
          refetch();
          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Menu Item has been deleted.",
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
        <title>Manage || Items</title>
      </Helmet>
      <SectionTitle
        heading={"Manage All Items"}
        subHeading={"Hurry Up !"}
      ></SectionTitle>
      <div className="text-center font-bold">
        <h2 className="text-indigo-600 text-xl mx-4">{user.displayName}</h2>
      </div>
      <div>
        <div className="overflow-x-auto max-w-screen-lg mx-auto mt-4">
          <div className="flex">
            <h2 className="text-indigo-600 text-xl my-8">
              Total Items : {menu.length}
            </h2>
          </div>
          <table className="table">
            {/* head */}
            <thead className="bg-indigo-600 text-white text-xl">
              <tr>
                <th>#</th>
                <th>Item Image</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {menu.map((item, index) => (
                <tr key={item._id}>
                  <th>{index + 1}</th>
                  <td>
                    <img src={item.image} className="w-20" alt="" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <Link to={`/dashboard/updateItem/${item._id}`}>
                      <button className="btn btn-primary btn-sm">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-error text-white btn-sm"
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
    </div>
  );
};

export default ManageItems;
