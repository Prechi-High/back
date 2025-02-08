import { useState } from "react";
import axios from "axios";

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
    <form onSubmit={handleSignup}>
      <input type="userName" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
}
