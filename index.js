import OpenAI from 'openai';
import bodyParser from 'body-parser';
import express from "express";
import cors from "cors";

const openai = new OpenAI({
     apiKey: API_KEY
});

var skillTopic = "Java";
var numDays = 10;
var prompt = "Give me a plan with resources to learn " + skillTopic + " in " + numDays + " days in a table format. The table should have four columns. The first column should include the day number (say including the word Day in each row), the second column should include the topic, the third column should include multiple resources with specific links and titles, and the fourth column should include multiple tasks. The second column should only include the topic to be learned. The third column should only include multiple recommended resources to learn that topic. The fourth column should only include the multiple tasks that should be taken to learn the corresponding topic for each day. Give an equal amount of tasks and resources but make sure to give multiple. Please surround strings with double quotes. Please use real links. Set the temperature setting to 0.1.";

const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": prompt}],
  });

var output = chatCompletion.choices[0].message["content"];
var separatedOutput = output.split("Day ");

console.log(separatedOutput);

for (let i = 0; i < separatedOutput.length; i++) {
  let result = separatedOutput[i].split("|");
  for (let j = 0; j < result.length; j++) {
    result[j] = result[j].trim();
    if (result[j] === "" || result[j] === '') {
      result.splice(j,1);
    }
  }
  separatedOutput[i] = result;
}

separatedOutput.splice(0,1);
separatedOutput.shift();

console.log(separatedOutput);