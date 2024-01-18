import "./App.css";
import QuestionButton from "./Components/questionBtn";

function App() {
  const questionTitle = "How many sides does a dodecagon have?";
  const buttonOptions = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
  ];

  const handleToggleSubmit = (selectedOption) => {
    console.log(`Selected option: ${selectedOption}`);
  };

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
