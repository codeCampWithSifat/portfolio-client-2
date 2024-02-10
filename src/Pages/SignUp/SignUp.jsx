import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useState } from "react";
import SocialLogin from "../Shared/SocialLogin/SocialLogin";

const SignUp = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserProfile } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const onSubmit = (data) => {
    // console.log(data);
    createUser(data.email, data.password)
      .then(() => {
        updateUserProfile(data.name)
          .then(() => {
            const userInfo = {
              name: data.name,
              email: data.email,
            };

            axiosPublic.post(`/users`, userInfo).then((res) => {
              if (res.data.insertedId) {
                //
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: `${data.name} Sign Up Successfully`,
                  showConfirmButton: false,
                  timer: 3000,
                });

                reset();
                navigate("/");
              }
            });
          })
          .catch(() => {
            setError("");
          });
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };
  return (
    <>
      <Helmet>
        <title>SignUp</title>
      </Helmet>
      <div className=" flex justify-center items-center">
        <div className="w-96 p-4 mt-28 mb-10">
          <h2 className="text-3xl text-center">Please Register </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text text-md mt-2"> Your Name</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full "
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-red-800 mt-2">Name is required</span>
              )}
            </div>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text text-md"> Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full "
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-800 mt-2">Email is required</span>
              )}
            </div>
            <div className="form-control w-full ">
              <label className="label">
                <span className="label-text text-md">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full "
                {...register("password", {
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
              />
              {errors.password && (
                <span className="text-red-800 mt-2">
                  Password Minimun 5 Character Or Maximum 20 Character
                </span>
              )}
            </div>
            <input
              type="submit"
              className="input input-bordered w-full bg-primary text-white my-4"
              value="Register"
            />
          </form>
          {error && (
            <span className="text-red-800 mt-2 text-center">
              You Have An Account.... Please Login
            </span>
          )}
          <p>
            Already Have An Account{" "}
            <Link to="/login" className="text-red-500">
              Please Login
            </Link>
          </p>
          <div className="divider">OR</div>
          <SocialLogin />
        </div>
      </div>
    </>
  );
};

export default SignUp;
