import { useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage,setErrorMessage]=useState("")
  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/", { email: email, password: password },{headers:{'Content-Type': 'application/json'}})
      .then((result) => {
        console.log(result);
        setErrorMessage("")
      })
      .catch((error) => {
        if(error.response && error.response.data){
            setErrorMessage(error.response.data.message)
        }else{
            setErrorMessage("An unexpected error occured")
        }
        console.log(error);
        setEmail("")
        setPassword("")
      });
  };

  const handleGoogleLogin = () => {
    // Logic to handle Google login
    console.log("Google Login initiated");
  };

  return (
    <div className="login-form">
      <h1>Login</h1>
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
          <p>Password</p>
          <input
            type="password" value={password}
            onChange={(evnt) => setPassword(evnt.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <button className="google-button" type="button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="signup-route">
        <p>Don't have an account?</p>
        <Link className="signup-button" to="/register">Signup</Link>
      </div>
    </div>
  );
}

export default Login;
