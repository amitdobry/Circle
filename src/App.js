import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage";
import TableView from "./components/TableView";
import NamePrompt from "./views/NamePrompt";

function App() {
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
