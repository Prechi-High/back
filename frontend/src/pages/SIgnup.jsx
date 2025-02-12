import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:5000/auth/signup", { email, password });
      alert("User registered successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Signup Error:", error);
      alert(error.response?.data?.message || "An error occurred. Check console for details.");
    }
  };
  return (
   


<div className="cover">
<div className="homepage">
  <div className="content">
  <form onSubmit={handleSignup}>
  <h1>Sign up</h1>
      <input type="userName" onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="input" /><br/>
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input"/><br/>
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input" /><br/>
      <button type="submit" className="subbtn">Sign Up</button>

      <div className="auth-links">
           <p>have an account? <Link to="/login" className="but"> Login</Link> instead</p>
        </div>
    </form>

  
  </div>
</div>
</div>

  );
}
