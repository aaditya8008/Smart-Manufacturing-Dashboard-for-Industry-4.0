import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Predictive from "./pages/Predictive";
import SupplyChain from "./pages/SupplyChain";
import Trends from "./pages/Trends";

export default function App(){
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="p-6 space-y-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/predictive" element={<Predictive />} />
          <Route path="/supply" element={<SupplyChain />} />
          <Route path="/trends" element={<Trends />} />
        </Routes>
      </div>
    </div>
  );
}
