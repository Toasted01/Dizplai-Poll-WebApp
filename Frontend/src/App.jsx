import "./App.css";
import QuestionButton from "./Components/QuestionBtn";
import ResultPage from "./ResultPage";
import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { fetchRandomPoll, postVote } from "./Controllers/apiController";

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
      try {
        const data = await fetchRandomPoll();

        // Check if data is not null and has the required properties
        if (data && data.pollId && data.question && data.options) {
          setPollId(data.pollId);
          setQuestion(data.question);
          setOptions(data.options);
        } else {
          console.error("Error: Invalid data format from fetchRandomPoll");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  /**
   * Used to handle POST request to add data to the votes api
   * @param {int} selectedId
   */
  const handleToggleSubmit = async (selectedId) => {
    try {
      console.log(`pollId:${pollId}, optionId ${selectedId}`);

      await postVote(pollId, selectedId);

      // Introduced 500 milliseconds delay to ensure the data is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

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
