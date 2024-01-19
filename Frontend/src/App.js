import "./App.css";
import QuestionButton from "./Components/questionBtn";
import { useState, useEffect } from "react";
import { fetchPollData } from "./contollers/appController";

function App() {
  
  const [pollData, setPollData] = useState([]);


  /**
   * Runs on startup, fetches a random poll from the api
   * Handler for fetch request of a random poll data
   * @returns 
   */
  useEffect(() => {
    const fetchData = async () => {
      const newPollData = await fetchPollData();
      setPollData(newPollData);
    };
    fetchData();
  }, []);
  

  /**
   * Used to handle POST request to add data to the votes api
   * @param {*} selectedOption
   */
  const handleToggleSubmit = (selectedOption) => {
    console.log(`Selected option: ${selectedOption}`);
  };

  const questionTitle = "How many sides does a dodecagon have?";
  const buttonOptions = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
  ];

  return (
    <div className="App">
      <div className="content-container">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: "50%", height: "auto" }}
        />
        <h1>{questionTitle}</h1>
        <QuestionButton
          buttonCount={3}
          buttonOptions={buttonOptions}
          onSubmit={handleToggleSubmit}
        />
      </div>
    </div>
  );
}

export default App;
