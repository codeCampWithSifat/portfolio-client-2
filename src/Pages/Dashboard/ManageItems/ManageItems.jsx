import { Link, useLoaderData } from "react-router-dom";
import SectionTitle from "../../../Components/SectionTitle";
// import useMenu from "../../../hooks/useMenu";
import useAuth from "../../../hooks/useAuth";
import LoadingButton from "../../../Components/LoadingButton";
import { Helmet } from "react-helmet-async";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import "./ManageItems.css";
import { useState } from "react";

/*
 * DONE : Get The Total Number of Items
 * DONE : Number of Items per page dynamic
 * DONE : Get the current page number
 */

const ManageItems = () => {
  // const [menu, menuLoading, refetch] = useMenu();
  const axiosPublic = useAxiosPublic();
  const { count } = useLoaderData();

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const numberOfPages = Math.ceil(count / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [...Array(numberOfPages).keys()];

  const {
    data: menu = [],
    isloading: menuLoading,
    refetch,
  } = useQuery({
    queryKey: ["menuPagination", currentPage, itemsPerPage],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/menuPagination?page=${currentPage}&size=${itemsPerPage}`
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
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
          if (res.data.deletedCount > 0) {
            refetch();
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

  const handleItemPerPage = (e) => {
    // console.log(e.target.value);
    const value = Number(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
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

          <div className="text-center pagination my-10">
            <p className="m-4">Current Page : {currentPage + 1}</p>
            <button
              onClick={handlePreviousPage}
              className="btn btn-active btn-ghost btn-sm"
            >
              Prev
            </button>
            {pages.map((page) => (
              <button
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? `btn btn-sm selected text-white`
                    : `btn btn-sm btn-primary`
                }
                key={page}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className="btn btn-active btn-ghost btn-sm"
            >
              Next
            </button>
            <select
              value={itemsPerPage}
              className="select select-success select-sm "
              onChange={handleItemPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageItems;
