/**
 * Handler for fetch request of a random poll data
 * Uses a random pollid to find a poll
 * @returns
 */
const fetchRandomPoll = async () => {
  try {
    const response = await fetch(`http://localhost:3001/api/polls/random`);

    if (!response.ok) {
      throw new Error(`Failed to fetch random poll. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during fetchRandomPoll: ${error.message}`);
    // Handle error as needed
    return null;
  }
};


/**
 * Handler for fetch request of a specific poll at a pollId
 * Not used in code but provided as alternative
 * @param {*} userPollId int: Enter a specific poll id starting at 1
 * @returns 
 */
const fetchPollById = async (userPollId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/polls/${userPollId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch poll with ID ${userPollId}. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error during fetchPollById: ${error.message}`);
    // Handle error as needed
    return null;
  }
};

/**
 * POST handler for submitting new vote to server
 * @param {*} userPollId int: pollId of the poll currently displayed
 * @param {*} userOption int: optionId of the option the user chose
 */
const postVote = async (pollId, userOptionId) =>{
  const objOptionId = {optionId: userOptionId}
  try{
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objOptionId),
    };
  
    const response = await fetch(`http://localhost:3001/api/votes/${pollId}`, requestOptions)
  
    if(!response.ok){
      const errorMessage = await response.text();
      throw new Error(`Failed to POST vote: ${errorMessage}`);
    }
  
    const responseData = await response.json();
    console.log("Vote recorded successfully: ", responseData);
  }
  catch(error){
    console.error("Error posting vote: ", error.message)
  }
}

const fetchOptionVotePercentByPollId = async (pollId) => {
  try {
    const response = await fetch(`http://localhost:3001/api/votes/${pollId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching option vote percentage:', error.message);
    // Handle error as needed
  }
};

export { fetchPollById, fetchRandomPoll, postVote, fetchOptionVotePercentByPollId };
