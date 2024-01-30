import React from "react";

const PercentageChoiceBar = ({ optionBarPercentages }) => {
  // Convert the object to an array of [optionText, percentage] pairs
  const optionBarEntries = Object.entries(optionBarPercentages);

  // Sort the array in descending order based on percentage
  optionBarEntries.sort((a, b) => b[1] - a[1]);

  return (
    <div>
      {optionBarEntries.map(([optionText, percentage], index) => (
        <div key={index} style={{ marginBottom: "10px", position: "relative" }}>
          <div className="custom-button">
            <div
              className="bar"
              style={{
                width: `${isNaN(percentage) ? 0 : percentage}%`,
              }}
            ></div>

            <span className="percent-num">
              {isNaN(percentage) ? 0 : percentage}%
            </span>

            <div className="option-text-wrapper">
              <span className="option-text">{optionText}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PercentageChoiceBar;
