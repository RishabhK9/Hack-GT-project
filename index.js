import OpenAI from 'openai';
import bodyParser from 'body-parser';
import express from "express";
import cors from "cors";

const openai = new OpenAI({
     apiKey: API_KEY // This is also the default, can be omitted
});

const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => { 

    const { message } = req.body;

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": "Hello!"}],
        
      })
      res.json ({
            completion: completion.choices[0].message["content"]
      })

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/`);
});

var numDays = 10;
var prompt = "Give me a plan with resources to learn Java in 10 days in a table format. The table should have four columns. The first column should include the day number (say Day # in each row), the second column should include the topic, the third column should include resources with specific links and titles, and the fourth column should include the tasks. The first column should only include the number of the day. The second column should only include the topic to be learned. The third column should only include recommended resources to learn that topic. The fourth column should only include the tasks that should be taken to learn the corresponding topic for each day. Please surround strings with double quotes. Set the temperature setting to 0.1.";

const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": prompt}],
  });

var output = chatCompletion.choices[0].message["content"];
var separatedOutput = output.split("Day ");

for (let i = 0; i < separatedOutput.length; i++) {
  let result = separatedOutput[i].split("|");
  separatedOutput[i] = result;
}



separatedOutput.splice(0,1);
separatedOutput.shift();

console.log(separatedOutput);
console.log(separatedOutput.length);
