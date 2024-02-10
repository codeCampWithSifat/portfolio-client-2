import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import SocialLogin from "../Shared/SocialLogin/SocialLogin";

const Login = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = (data) => {
    // console.log(data);
    signIn(data.email, data.password)
      .then((result) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${result.user?.displayName} Login Successfully`,
          showConfirmButton: false,
          timer: 1500,
        });
        reset();
        navigate(from, { replace: true });
        setError("");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className=" flex justify-center items-center">
        <div className="w-96 p-4 mt-28 mb-10">
          <h2 className="text-3xl text-center">Please Login</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
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
              value="Login"
            />
          </form>

          {error && (
            <span className="text-red-800 my-4">Email/Pasword Not Matched</span>
          )}
          <p>
            Don Not Have Any Account{" "}
            <Link to="/signup" className="text-red-500">
              Please Register
            </Link>
          </p>
          <div className="divider">OR</div>
          <SocialLogin />
        </div>
      </div>
    </>
  );
};

export default Login;
