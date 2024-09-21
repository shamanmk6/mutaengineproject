import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Cart from "./Cart";
import './Home.css';
import Navbar from "./Navbar";

function Home() {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || {});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const username = params.get('username');
    const email = params.get('email');

    if (username && email) {
      setUser({ username, email });
    }
  }, [location.search]);
  return (
    <div className="home">
      <Navbar />
      <h1>Welcome to Home</h1>
      <Cart user={user} />
    </div>
  );
}

export default Home;
