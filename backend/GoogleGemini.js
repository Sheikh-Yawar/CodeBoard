const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDcRgyNNA62ADocxKPfssV-YFfl53xENRs");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-exp-0827",
});

const prompt = "Write a story about a magic backpack.";

async function solveCodingProblem() {
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

solveCodingProblem();
