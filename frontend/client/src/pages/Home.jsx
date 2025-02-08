import { Link } from "react-router-dom";


export default function Home() {
  return (
    <div className="cover">
    <div className="homepage">

      <div className="grid-background"></div>
      <div className="content">
        <h1>Welcome to Courier Tracking</h1>
        <h3>Login or signup to track your package!</h3>
        <div className="auth-links">
          <Link to="/signup" className="button2">Sign Up</Link>
          <Link to="/login" className="button">Login</Link>
        </div>
        <section className="success-stories">
         
          <div className="customer-images">
            <img src="customer1.jpg" alt="Customer 1" className="customer-image" />
            <img src="customer2.jpg" alt="Customer 2" className="customer-image" />
            <img src="customer3.jpg" alt="Customer 3" className="customer-image" />
            <span>Over 2000+ Successful Shippings</span>
          </div>
        </section>
       
      </div>
    </div>
    </div>
  );
}
