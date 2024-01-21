import React, { useState } from "react";

const percentageChoiceBar = ({ initialPercentage = 0 }) => {
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <div className="button-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
      <button className="button">Click me</button>
    </div>
  );
};

export default percentageChoiceBar;
