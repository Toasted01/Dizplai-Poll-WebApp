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
 * @param {*} userPollId Enter a specific poll id starting at 1
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

export { fetchPollById, fetchRandomPoll };
