import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha'
import axios from "axios";
import "./Signup.css";
const SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY;
function Signup() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaValue,setRecaptchaValue]=useState('')
  const captchaRef=useRef()
  let handleSubmit = (e) => {
    e.preventDefault();
    
    captchaRef.current.reset();

    axios
      .post(
        "https://52.66.113.235/register",
        {
          email: email,
          username: username,
          password: password,
          recaptchaValue
        },
        { withCredentials: true }
      )
      .then((response) => {
            navigate('/')
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
  const onChange=(value)=>{
         setRecaptchaValue(value);
  }
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
        <div className="">
          <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} ref={captchaRef}/>
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
