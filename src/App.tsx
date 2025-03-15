
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Registration from "@/pages/Registration";
import RideSelection from "@/pages/RideSelection";
import ActiveRide from "@/pages/ActiveRide";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/ride-selection" element={<RideSelection />} />
        <Route path="/active-ride" element={<ActiveRide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
