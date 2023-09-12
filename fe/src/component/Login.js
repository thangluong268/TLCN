import React from "react";
import userApi from "../api/userApi";
import { login } from "./Home/HomeSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function Login() {
  const [user, setUser] = React.useState({ email: "", password: "" });
  const dispach = useDispatch();
  const navigate = useNavigate();
  const Login = async (e) => {
    e.preventDefault();
    try {
      const response = await userApi.login(user);
      localStorage.setItem("token", response.token);
      dispach(login(response.user));
      navigate("/");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => Login(e)}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
