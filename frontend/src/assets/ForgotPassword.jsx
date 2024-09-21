import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("https://goshopper.shop/forgot-password", { email: email })
      .then((response) => {
        const userId = response.data.userId;
        const otp = response.data.otp;
        navigate("/enter-otp", { state: { userId, otp } });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occured");
        }
      });
  };

  return (
    <div className="login-form">
      <h1>Send email</h1>
      <form onSubmit={handleSubmit}>
        {" "}
        <div className="form-group">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(evnt) => setEmail(evnt.target.value)}
          />
        </div>
        <button type="submit">Send email</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default ForgotPassword;
