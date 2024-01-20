/**
 * Handler for fetch request of a random poll data
 * Uses a random pollid to find a poll
 * @returns
 */
const fetchRandomPoll = async () => {
  const pollResponse = await fetch(
    `http://localhost:3001/api/polls/random`
  );

  //if fetch request fails error and return
  if (!pollResponse.ok) {
    console.error(`Error fetching random poll. Status: ${pollResponse.status}`);
    return;
  }

  return await pollResponse.json();
};

/**
 * Handler for fetch request of a specific poll at a pollId
 * Not used in code but provided as alternative
 * @param {*} userPollId int: Enter a specific poll id starting at 1
 * @returns 
 */
const fetchPollById = async (userPollId) => {
  const pollResponse = await fetch(
    `http://localhost:3001/api/polls/${userPollId}`
  );

  //if fetch request fails error and return
  if (!pollResponse.ok) {
    console.error(`Error fetching random poll. Status: ${pollResponse.status}`);
    return;
  }

  return await pollResponse.json();
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

export { fetchPollById, fetchRandomPoll, postVote };
