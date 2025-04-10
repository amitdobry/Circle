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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<TableView />} />
        <Route path="/name" element={<NamePrompt />} />
      </Routes>
    </Router>
  );
}

export default App;
