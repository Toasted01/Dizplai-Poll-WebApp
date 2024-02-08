const readline = require('readline');
const pollController = require("../controllers/pollController");

// Readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptForNewPoll() {
    rl.question('Enter poll name: ', (pollName) => {
        if (!pollName.trim()) {
            console.log('Poll name cannot be empty.');
            promptForNewPoll(); // Reprompt for poll name
            return;
        }

        rl.question('Enter poll question: ', (question) => {
            if (!question.trim()) {
                console.log('Poll question cannot be empty.');
                promptForNewPoll(); // Reprompt for poll question
                return;
            }

            const options = [];
            promptForOption(options);

            function promptForOption(options) {
                if (options.length >= 5) {
                    // If the maximum number of options is reached, proceed with creating the poll
                    const newPoll = {
                        pollName,
                        question,
                        options
                    };
                    pollController.addNewPoll(newPoll);
                    rl.close();
                    return;
                }

                rl.question('Enter option text (or type "done" to finish adding options): ', (optionText) => {
                    if (!optionText.trim()) {
                        console.log('Option text cannot be empty.');
                        promptForOption(options); // Reprompt for option text
                        return;
                    }

                    if (optionText.toLowerCase() === 'done') {
                        if (options.length < 2) {
                            console.log('A poll must have at least 2 options.');
                            promptForOption(options);
                        } else {
                            // If user is done adding options, create new poll object and add it
                            const newPoll = {
                                pollName,
                                question,
                                options
                            };
                            pollController.addNewPoll(newPoll);
                            rl.close();
                        }
                    } else {
                        // Add option to options array and continue prompting for more options
                        const optionId = options.length + 1;
                        options.push({ optionId, optionText });
                        promptForOption(options);
                    }
                });
            }
        });
    });
}

promptForNewPoll();
