import { useState } from "react";

const ToggleButtons = ({ buttonCount, buttonOptions, onSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const handleButtonClick = (option, index) => {
    setSelectedOption(option);
    setSelectedOptionId(index);
  };

  const handleSubmit = () => {
    if (selectedOption !== null) {
      onSubmit(selectedOptionId);
    } else {
      console.log("Please select an option before submitting.");
    }
  };

  return (
    <div className="button-container">
      {Object.values(buttonOptions)
        .slice(0, buttonCount)
        .map((option, index) => (
          <button
            key={index}
            onClick={() =>
              handleButtonClick(option.optionText, option.optionId)
            }
            className={
              selectedOption === option.optionText ? "activeBtn" : "inactiveBtn"
            }
          >
            {option.optionText}
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
