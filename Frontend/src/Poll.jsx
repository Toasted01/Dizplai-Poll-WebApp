import "./App.css";
import QuestionButton from "./Components/QuestionBtn";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPollById, postVote } from "./Controllers/apiController";

function App() {
  let navigate = useNavigate();
  const { pollId } = useParams();
  const [isNull, setIsNull] = useState(false);
  const [thisPollId, setPollId] = useState(null);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);

  /**
   * Runs on startup, fetches a random poll from the api
   * @returns
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPollById(pollId);

        // Check if data is not null and has the required properties
        if (data && data.pollId && data.question && data.options) {
          setPollId(data.pollId);
          setQuestion(data.question);
          setOptions(data.options);
        } else {
          console.error("Error: Invalid data format from fetchRandomPoll");
          setIsNull(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pollId]);

  /**
   * Used to handle POST request to add data to the votes api
   * @param {int} selectedId
   */
  const handleToggleSubmit = async (selectedId) => {
    try {
      console.log(`pollId:${thisPollId}, optionId ${selectedId}`);

      await postVote(thisPollId, selectedId);

      // Introduced 500 milliseconds delay to ensure the data is updated
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate(`/result/${thisPollId}`);
    } catch (error) {
      console.error("Error during handleToggleSubmit:", error.message);
    }
  };

  return (
    <div className="App">
      <div className="content-container">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "50%", height: "auto" }}
        />
        {isNull ? (
          <h1>Invalid poll id</h1>
        ) : (
          <>
            <h1>{question}</h1>
            <QuestionButton
              buttonCount={options.length}
              buttonOptions={options}
              onSubmit={handleToggleSubmit}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
