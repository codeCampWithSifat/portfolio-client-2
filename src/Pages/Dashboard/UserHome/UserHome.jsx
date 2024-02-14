import useAuth from "../../../hooks/useAuth";

const UserHome = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-3xl text-center text-indigo-600 ">
        <span>Hi Welcome {user.displayName ? user.displayName : ""}</span>
      </h2>
    </div>
  );
};

export default UserHome;
