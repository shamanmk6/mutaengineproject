import { useState ,useRef} from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha'
import "./Login.css";
const SITE_KEY = import.meta.env.VITE_GOOGLE_RECAPTCHA_KEY;
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaValue,setRecaptchaValue]=useState('')
  const captchaRef=useRef()
  let handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://52.66.113.235/",
        { email, password,recaptchaValue},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )

      .then((response) => { 
        const user = response.data.user;
        setErrorMessage("");
        navigate("/home", { replace: true, state: { user } });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occured");
        }
        console.log(error);
        setEmail("");
        setPassword("");
      });
  };
  const onChange=(value)=>{
    setRecaptchaValue(value);
  }
  const handleGoogleLogin = () => {
    window.location.href = "https://52.66.113.235/auth/google";
  };
  const handleForgotPassword = () => {
    console.log("forgot password");
    navigate("/forgot-password");
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
            type="password"
            value={password}
            onChange={(evnt) => setPassword(evnt.target.value)}
          />
        </div>
        <div className="">
          <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} ref={captchaRef}/>
        </div>
        <button type="submit">Login</button>
        <button
          className="google-button"
          type="button"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="signup-route">
        <p onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
          Forgot Password?
        </p>
        <p>Don't have an account?</p>
        <Link className="signup-button" to="/register">
          Signup
        </Link>
      </div>
    </div>
  );
}
export default Login;
