const apiServerIP = import.meta.env.VITE_API_SERVER_IP;

/**
 * Handler for fetch request of a specific poll at a pollId
 * @param {int} userPollId Enter a specific poll id starting at 1
 * @returns
 */
const fetchPollById = async (userPollId) => {
  try {
    const response = await fetch(
      apiServerIP+`api/polls/${userPollId}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch poll with ID ${userPollId}. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during fetchPollById: ${error.message}`);
    return null;
  }
};

/**
 * POST handler for submitting new vote to server
 * @param {int} userPollId pollId of the poll currently displayed
 * @param {int} userOption optionId of the option the user chose
 */
const postVote = async (pollId, userOptionId) => {
  const objOptionId = { optionId: userOptionId };
  try {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objOptionId),
    };

    const response = await fetch(
      apiServerIP+`api/votes/${pollId}`,
      requestOptions
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to POST vote: ${errorMessage}`);
    }

    const responseData = await response.json();
    console.log("Vote recorded successfully: ", responseData);
  } catch (error) {
    console.error("Error posting vote: ", error.message);
  }
};

/**
 * Used to get information on the percentage choice for each option of a specified poll
 * @param {int} pollId pollId of the poll currently displayed
 * @returns 
 */
const fetchOptionVotePercentByPollId = async (pollId) => {
  try {
    const response = await fetch(apiServerIP+`api/votes/${pollId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching option vote percentage:", error.message);
  }
};

export {
  fetchPollById,
  postVote,
  fetchOptionVotePercentByPollId,
};
