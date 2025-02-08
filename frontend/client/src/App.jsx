import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Track from "./pages/Track";
import AdminPage from "./pages/AdminPage";
import Signup from "./pages/SIgnup";
import Home from "./pages/Home";
import AdminTrackingDashboard from "./pages/AdminTrackingDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";

const isAuthenticated = () => localStorage.getItem("token"); 
const isAdmin = () => localStorage.getItem("isAdmin") === "true";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  return isAuthenticated() && isAdmin() ? children : <Navigate to="/track" />;
};

function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/track" element={<Track />} />
        <Route path="/trackDashboard" element={<AdminTrackingDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      
    </Routes>
  );
}

export default App;
