import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import RideSelection from "@/pages/RideSelection";
import ActiveRide from "@/pages/ActiveRide";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/components/Dashboard";
import Profile from "@/components/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ride-selection" element={<RideSelection />} />
        <Route path="/active-ride" element={<ActiveRide />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
