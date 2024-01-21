import React, { useState, useEffect } from 'react';
import percentageChoiceBar from './Components/resultsOptions';


const ResultPage = () => {
    const [optionsPercentage, setOptionsPercentage] = useState({});

    


  return (
    <div>
      <h2>Results Page</h2>
      <percentageChoiceBar initialPercentage = {0}/>
    </div>
  );
};

export default ResultPage;