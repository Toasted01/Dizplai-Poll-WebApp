import "./App.css";
import QuestionButton from "./Components/QuestionBtn";
import ResultPage from "./ResultPage";
import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { fetchRandomPoll, postVote } from "./controllers/apiController";

function App() {
  let navigate = useNavigate();
  const [pollId, setPollId] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);

  /**
   * Runs on startup, fetches a random poll from the api
   * @returns
   */
  useEffect(() => {
    const fetchData = async () => {
      const { pollId, question, options } = await fetchRandomPoll();
      setPollId(pollId);
      setQuestion(question);
      setOptions(options);
    };
    fetchData();
  }, []);

  /**
   * Used to handle POST request to add data to the votes api
   * @param {*} selectedId
   */
  const handleToggleSubmit = async (selectedId) => {
    try {
      console.log(`pollId:${pollId}, optionId ${selectedId}`);
      
      await postVote(pollId, selectedId);
  
      // Introduce a delay (e.g., 500 milliseconds) to ensure the data is updated
      await new Promise(resolve => setTimeout(resolve, 500));
  
      navigate(`/result/${pollId}`);
    } catch (error) {
      console.error("Error during handleToggleSubmit:", error.message);
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <div className="content-container">
              <img
                src="/logo.png"
                alt="Logo"
                style={{ width: "50%", height: "auto" }}
              />
              <h1>{question}</h1>
              <QuestionButton
                buttonCount={options.length}
                buttonOptions={options}
                onSubmit={handleToggleSubmit}
              />
            </div>
          }
        />
        <Route path="/result/:pollId" element={<ResultPage />} />
        <Route path="/result" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
