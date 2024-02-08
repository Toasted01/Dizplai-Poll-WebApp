const readline = require('readline');
const pollController = require("../controllers/pollController");

// Readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function promptForNewPoll() {
    rl.question('Enter poll name: ', (pollName) => {
        rl.question('Enter poll question: ', (question) => {
            const options = [];
            promptForOption(options);
            function promptForOption(options) {
                rl.question('Enter option text (or type "done" to finish adding options): ', (optionText) => {
                    if (optionText.toLowerCase() === 'done') {
                        // If user is done adding options, create new poll object and add it
                        const newPoll = {
                            pollName,
                            question,
                            options
                        };
                        pollController.addNewPoll(newPoll);
                        rl.close();
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