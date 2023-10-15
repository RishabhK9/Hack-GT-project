const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

class RoadMapper {
    async processChat(skillTopic, numDays) {  // Accepting arguments here
        const openai = new OpenAI({
            apiKey: "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"
        });

        var prompt = `Give me a plan with resources to learn ${skillTopic} in ${numDays} days in a table format. The table should have four columns. The first column should include the day number (say including the word Day in each row), the second column should include the topic, the third column should include multiple resources with specific links and titles, and the fourth column should include multiple tasks. The second column should only include the topic to be learned. The third column should only include multiple recommended resources to learn that topic. The fourth column should only include the multiple tasks that should be taken to learn the corresponding topic for each day. Give an equal amount of tasks and resources but make sure to give multiple. Please surround strings with double quotes. Please make sure to include and use real links. Set the temperature setting to 0.1.`;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const output = chatCompletion.choices[0].message.content;
        const separatedOutput = output.split("Day ");

        for (let i = 0; i < separatedOutput.length; i++) {
            let result = separatedOutput[i].split("|");
            for (let j = 0; j < result.length; j++) {
                result[j] = result[j].trim();
                if (result[j].trim() === "") {
                    result.splice(j, 1);
                }
            }
            separatedOutput[i] = result;
        }

        separatedOutput.splice(0, 1);
        separatedOutput.shift();

        return separatedOutput;
    }
}

app.post('/', async (req, res) => {
    const { skillTopic, numDays } = req.body;  // Extracting values from POST request body

    const chatProcessor = new RoadMapper();

    try {
        const result = await chatProcessor.processChat(skillTopic, numDays);  // Passing the values as arguments here
        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process chat.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});