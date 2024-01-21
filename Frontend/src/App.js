import "./App.css";
import QuestionButton from "./Components/questionBtn";
import ResultPage from './ResultPage';
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { fetchRandomPoll, postVote } from "./contollers/apiController";

function App() {
  
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
   * @param {*} selectedOption
   */
  const handleToggleSubmit = (selectedId) => {
    console.log(`pollId:${pollId}, optionId ${selectedId}`);
    postVote(pollId, selectedId);
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact>
            <div className="content-container">
              <img src="/logo.png" alt="Logo" style={{ width: '50%', height: 'auto' }} />
              <h1>{question}</h1>
              <QuestionButton
                buttonCount={options.length}
                buttonOptions={options}
                onSubmit={handleToggleSubmit}
              />
            </div>
          </Route>
          <Route path="/result/:pollId" exact component={ResultPage} />
          <Redirect from="/result" to="/" />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
