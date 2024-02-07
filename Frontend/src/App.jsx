import "./App.css";
import Poll from "./Poll";
import ResultPage from "./ResultPage";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/poll/1" />} />
        <Route path="/poll/:pollId" element={<Poll />} />
        <Route path="/result/:pollId" element={<ResultPage />} />
        <Route path="/result" element={<Navigate to="/" />} />
        <Route path="/poll" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
