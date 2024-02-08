import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./Styles/App.css";
import Poll from "./Pages/Poll";
import ResultPage from "./Pages/ResultPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/poll/1" />} />
        <Route path="/poll/:pollId" element={<Poll />} />
        <Route path="/result/:pollId" element={<ResultPage />} />
        <Route path="/result" element={<Navigate to="/" />} />
        <Route path="/poll" element={<Navigate to="/" />} />
      </Routes>
    </div>
  </BrowserRouter>
);
