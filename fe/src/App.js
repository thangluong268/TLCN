import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./component/Home/Home";
import Login from "./component/Login";
import SignIn from "./component/SingIn";

function App() {
  const [isHasToken, setIsHasToken] = React.useState(false);
  React.useEffect(() => {
    setIsHasToken(localStorage.getItem("token") ? true : false);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {isHasToken ? (
            <Route path="/" element={<Home />} />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-in" element={<SignIn />} />
            </>
          )}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
