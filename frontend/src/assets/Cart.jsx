import React, { useState } from "react";
import axios from "axios";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = (user) => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: 1,
    name: "Fashion Frok",
    price: 50.0,
    quantity: 1,
    image: "Ha304dccd4cb047b28e9550820fe7b0a2B.jpg_720x720q50.webp",
  });
  const increaseQuantity = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      quantity: prevProduct.quantity + 1,
    }));
  };
  const decreaseQuantity = () => {
    if (product.quantity > 1) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        quantity: prevProduct.quantity - 1,
      }));
    }
  };
  const totalPrice = product.price * product.quantity;
  const handlePayNow = () => {
    axios
      .post("http://localhost:3000/generateRazorpay", {
        totalPrice: totalPrice,
      })
      .then((response) => {
        console.log(response);
        const order = response.data.order;
        razorpayPayment(order);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const razorpayPayment = (order) => {
    const options = {
      key: "rzp_test_pwhvE482E5y8F4",
      amount: order.amount,
      currency: "INR",
      name: "E-Shopper",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: function (response) {
        verifyPayment(response, order);
      },
      prefill: {
        name: "Shaman",
        email: "user@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "User Address",
      },
      theme: {
        color: "#ed9b9b",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const verifyPayment = (payment, order) => {
    axios
      .post("http://localhost:3000/verify-payment", { payment, order })
      .then((response) => {
        if (response.data.success) {
          navigate("/invoice", { state: { user } });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="cart-container">
      <h1>Cart</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Image</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{product.name}</td>
            <td>
              <img src={product.image} alt={product.name} />
            </td>
            <td>${product.price}</td>
            <td>
              <div className="quantity-controls">
                <button onClick={decreaseQuantity}>-</button>
                <span>{product.quantity}</span>
                <button onClick={increaseQuantity}>+</button>
              </div>
            </td>
            <td>${totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <button className="pay-now-button" onClick={handlePayNow}>
        Pay Now
      </button>
    </div>
  );
};

export default Cart;
