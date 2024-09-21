import Navbar from "./Navbar";
import "./Invoice.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useState } from "react";
function Invoice() {
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const { user } = location.state || {};
  const handleDownload = () => {
    setSuccessMessage("");
    axios
      .post(
        "http://localhost:3000/download-invoice",
        {},
        { responseType: "blob" }
      )
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log("error in downloading invoice: ", error);
      });
  };
  const handleEmail = () => {
    axios
      .post("http://localhost:3000/mail-invoice", { user: user })
      .then((response) => {
        console.log("Invoice sent via  mail!", response.data);
        setSuccessMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <Navbar />
      <div className="order">
        <h1>Order Successfull</h1>
        <button onClick={handleDownload}>Download Invoice</button>
        <button onClick={handleEmail}>Email Invoice</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
}
export default Invoice;
