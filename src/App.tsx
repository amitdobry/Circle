import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./views/HomePage";
import TableView from "./components/TableView";
import NamePrompt from "./views/NamePrompt";
import ProfileSetup from "./views/ProfileSetup";
import DemoPage from "./views/DemoPage";
import { Buffer } from "buffer";
import process from "process";
import { JSX, useEffect } from "react";
import { authService } from "./services/authService";
import socket from "./socket/index";

// @ts-ignore: Allow Buffer + process polyfills on window
window.Buffer = Buffer;
window.process = process;
window.Buffer = Buffer;
window.process = process;

// App content component that can use useNavigate
function AppContent(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Google OAuth callback
    authService.handleGoogleCallback();

    // Global session end handler for navigation
    const handleSessionEnded = (data: any) => {
      console.log("🏠 App-level session ended, navigating home:", data);
      if (data.message) {
        alert(data.message);
      }
    };

    const handleForceNavigateHome = (data: any) => {
      console.log("🏠 App-level force navigation home:", data);
      navigate("/");
    };

    socket.on("session-ended", handleSessionEnded);
    socket.on("force-navigate-home", handleForceNavigateHome);

    return () => {
      socket.off("session-ended", handleSessionEnded);
      socket.off("force-navigate-home", handleForceNavigateHome);
    };
  }, [navigate]);

  return (
    <>
      {/* 👇 ADD THIS HIDDEN HELPER DIV AT THE TOP */}
      <div className="hidden">
        px-4 py-2 rounded-full text-sm bg-emerald-100 text-emerald-700 border
        border-emerald-300 bg-amber-100 text-amber-700 border border-amber-300
        bg-rose-100 text-rose-700 border border-rose-300 bg-blue-100
        text-blue-700 border border-blue-300 bg-sky-100 text-sky-700 border
        border-sky-300 bg-indigo-100 text-indigo-700 border border-indigo-300
        bg-orange-100 text-orange-700 border border-orange-300 bg-violet-100
        text-violet-700 border border-violet-300 bg-rose-200 text-rose-700
        border border-rose-300 bg-indigo-400 text-white border-indigo-500
        hover:bg-indigo-500 hover:shadow-md hover:scale-105 transition-all
        duration-200 hover:brightness-110 px-6 py-3 rounded-full text-base
        font-semibold border bg-rose-400 text-white border-rose-500
        hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300
        transition-all duration-150 hover:shadow-inner px-6 py-3 rounded-full
        text-base font-semibold border bg-rose-400 text-white border-rose-500
        hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300 shadow-sm
        transition-colors duration-150 px-6 py-3 rounded-full text-base
        font-semibold border bg-gray-100 text-gray-600 border-gray-300
        hover:bg-gray-200 transition px-6 py-3 rounded-full text-base
        font-semibold border bg-emerald-500 text-white border-emerald-600
        hover:bg-emerald-600 transition px-5 py-3 rounded-full text-sm
        font-semibold border transition-all duration-200 bg-green-500 text-white
        border-green-600 hover:bg-green-600 hover:shadow-md hover:scale-105 px-5
        py-3 rounded-full text-sm font-semibold border transition-all
        duration-200 bg-blue-500 text-white border-blue-600 hover:bg-blue-600
        hover:shadow-md hover:scale-105
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/room" element={<TableView />} />
        <Route path="/name" element={<NamePrompt />} />
        <Route path="/profile" element={<ProfileSetup />} />
      </Routes>
    </>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
