import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PercentageChoiceBar from "./Components/PercentageChoiceBar";
import {
  fetchOptionVotePercentByPollId,
  fetchPollById,
} from "./controllers/apiController";
import "./results.css";
import "./App.css";

const ResultPage = () => {
  const [optionsPercentage, setOptionsPercentage] = useState({});
  const { pollId } = useParams();

  useEffect(() => {
    // Function to fetch option vote percentages by pollId
    const fetchOptionVotePercentages = async () => {
      try {
        // Fetch poll details using fetchPollById
        const pollDetails = await fetchPollById(pollId);

        if (pollDetails) {
          // Extract options data from pollDetails
          const options = pollDetails.options || [];

          // Fetch option vote percentages using fetchOptionVotePercentByPollId
          const result = await fetchOptionVotePercentByPollId(pollId);

          if (result) {
            // Update optionsPercentage state with optionText from pollDetails.options as keys
            const updatedOptionsPercentage = {};
            options.forEach((option) => {
              const optionText = option.optionText;
              updatedOptionsPercentage[optionText] =
                result.percentageVotesPerOption[option.optionId];
            });

            setOptionsPercentage(updatedOptionsPercentage);
          } else {
            console.error("Failed to fetch option vote percentages.");
          }
        } else {
          console.error("Failed to fetch poll details.");
        }
      } catch (error) {
        console.error(
          "Error during fetchOptionVotePercentages:",
          error.message
        );
      }
    };

    // Call the function on useEffect
    fetchOptionVotePercentages();
  }, [pollId]); // re-run when pollId changes

  console.log("optionPercentage", optionsPercentage);

  return (
    <div className="content-container">
      <img
        src="/logo.png"
        alt="Logo"
        style={{ width: "50%", height: "auto" }}
      />
      <h1>Thank you for your response</h1>
      <PercentageChoiceBar optionBarPercentages={optionsPercentage} />
    </div>
  );
};

export default ResultPage;
