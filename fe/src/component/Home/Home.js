import React from "react";
import { useSelector } from "react-redux";
function Home() {
  // Get user from redux store
  const user = useSelector((state) => state.home.data);
  const Logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <div>
      <h1>Home</h1>
      {/* Dispaly user infomation */}
      <div>
        <h2>User Info</h2>
        <p>ID: {user._id || ""} </p>
        <p>Name: {user.name || ""} </p>
        <p>Email: {user.email || ""} </p>
        <p>Password: {user.password || ""} </p>
        <p>Role: {user.role || ""} </p>
      </div>

      {/* Log out */}
      <button onClick={(e) => Logout(e)}>Log out</button>
    </div>
  );
}

export default Home;
