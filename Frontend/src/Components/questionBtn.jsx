import { useState } from "react";

const ToggleButtons = ({ buttonCount, buttonOptions, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOption);
    } else {
      // Handle case where no option is selected
      console.log("Please select an option before submitting.");
    }
  };

  return (
    <div className="button-container">
      {buttonOptions.slice(0, buttonCount).map((option, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(option)}
          className={selectedOption === option ? "activeBtn" : "inactiveBtn"}
        >
          {option}
        </button>
      ))}
      <button
        onClick={handleSubmit}
        disabled={selectedOption === null}
        className="submit"
      >
        Submit
      </button>
    </div>
  );
};

export default ToggleButtons;
