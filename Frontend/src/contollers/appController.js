/**
 * Handler to fetch a count of all available polls
 * Used in fetchPollData to calculate a random poll id
 * @returns
 */
const fetchPollCount = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/polls/count");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { count } = await response.json();
    return count;
  } catch (error) {
    console.error("Error fetching poll count:", error.message);
    return 0; // Default to 0 if there's an error
  }
};

/**
 * Handler for fetch request of a random poll data
 * Uses a random pollid to find a poll
 * @returns
 */
const fetchPollData = async () => {
  const maxPollId = await fetchPollCount();

  //if no polls available log and return
  if (maxPollId === 0) {
    console.log("No polls available");
    return;
  }

  const randomPollId = Math.floor(Math.random() * maxPollId) + 1;

  const pollResponse = await fetch(
    `http://localhost:3001/api/polls/${randomPollId}`
  );

  //if fetch request fails error and return
  if (!pollResponse.ok) {
    console.error(`Error fetching random poll. Status: ${pollResponse.status}`);
    return;
  }

  return await pollResponse.json();
};

export { fetchPollData };
