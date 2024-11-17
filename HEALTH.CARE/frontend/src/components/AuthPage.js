import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <h2 className="text-center text-2xl font-bold mb-4">{isLogin ? "Login" : "Register"}</h2>
      {isLogin ? <Login /> : <Register />}
      <div className="text-center mt-4">
        <button
          onClick={toggleForm}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
