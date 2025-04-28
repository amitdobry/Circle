import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import TableView from "./components/TableView";
import NamePrompt from "./views/NamePrompt";
import { Buffer } from "buffer";
import process from "process";
import { JSX } from "react";

// @ts-ignore: Allow Buffer + process polyfills on window
window.Buffer = Buffer;
window.process = process;

function App(): JSX.Element {
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
        border border-rose-300 transition-all duration-200 hover:brightness-110
        hover:shadow-md hover:scale-105
      </div>

      {/* 👇 Your actual App Router */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room" element={<TableView />} />
          <Route path="/name" element={<NamePrompt />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
