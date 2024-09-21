import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "http://localhost:3000/register",
        {
          email: email,
          username: username,
          password: password,
        },
        { withCredentials: true }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occured");
        }
        console.log(error);
      });
  };
  return (
    <div className="signup-form">
      <h1>Signup</h1>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(evnt) => setEmail(evnt.target.value)}
          />
        </div>
        <div className="form-group">
          <p>Username</p>
          <input
            type="text"
            value={username}
            onChange={(evnt) => setUsername(evnt.target.value)}
          />
        </div>
        <div className="form-group">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(evnt) => setPassword(evnt.target.value)}
          />
        </div>
        <button type="submit">Signup</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="login-route">
        <p>Already have an account?</p>
        <Link className="login-button" to="/">
          Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
