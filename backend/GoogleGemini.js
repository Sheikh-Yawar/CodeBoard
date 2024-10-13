const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-exp-0827",
});

async function analyzeImage(imgFile) {
  let prompt =
    "You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them. " +
    "Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction. " +
    "For example: " +
    "Q. 2 + 3 * 4 " +
    "(3 * 4) => 12, 2 + 12 = 14. " +
    "Q. 2 + 3 + 5 * 4 - 8 / 2 " +
    "5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21. " +
    "YOU CAN HAVE FIVE TYPES OF EQUATIONS/EXPRESSIONS IN THIS IMAGE, AND ONLY ONE CASE SHALL APPLY EVERY TIME: " +
    "Following are the cases: " +
    "1. Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.: In this case, solve and return the answer in the format of a LIST OF ONE DICT [{explanation: explain how you solved the problem, 'expr': given expression, 'result': calculated answer}]. " +
    "2. Set of Equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, 5x^2 + 6y + 7 = 12, etc.: In this case, solve for the given variable, and the format should be a COMMA SEPARATED LIST OF DICTS, with dict 1 as {explanation: explain how you solved the problem, 'expr': 'x', 'result': 2, 'assign': True} and dict 2 as {explanation: explain how you solved the problem, 'expr': 'y', 'result': 5, 'assign': True}. This example assumes x was calculated as 2, and y as 5. Include as many dicts as there are variables. " +
    "3. Assigning values to variables like x = 4, y = 5, z = 6, etc.: In this case, assign values to variables and return another key in the dict called {'assign': True}, keeping the variable as 'expr' and the value as 'result' in the original dictionary. RETURN AS A LIST OF DICTS. " +
    "4. Analyzing Graphical Math problems, which are word problems represented in drawing form, such as cars colliding, trigonometric problems, problems on the Pythagorean theorem, adding runs from a cricket wagon wheel, etc. These will have a drawing representing some scenario and accompanying information with the image. PAY CLOSE ATTENTION TO DIFFERENT COLORS FOR THESE PROBLEMS. You need to return the answer in the format of a LIST OF ONE DICT [{explanation: explain how you solved the problem, 'expr': given expression, 'result': calculated answer}]. " +
    "5. Detecting Abstract Concepts that a drawing might show, such as love, hate, jealousy, patriotism, or a historic reference to war, invention, discovery, quote, etc. USE THE SAME FORMAT AS OTHERS TO RETURN THE ANSWER, where 'expr' will be the explanation of the drawing, and 'result' will be the abstract concept. " +
    "Analyze the equation or expression in this image and return the answer according to the given rules: " +
    "Make sure to use extra backslashes for escape characters like \\f -> \\\\f, \\n -> \\\\n, etc. " +
    "DO NOT USE BACKTICKS OR MARKDOWN FORMATTING. " +
    "PROPERLY QUOTE THE KEYS AND VALUES IN THE DICTIONARY FOR EASIER PARSING WITH Python's ast.literal_eval.";

  // const fileData = {
  //   inlineData: {
  //     data: Buffer.from(fs.readFileSync("./canvas_image.png")).toString(
  //       "base64"
  //     ),
  //     mimeType: "image/png",
  //   },
  // };
  const fileData = {
    inlineData: {
      data: imgFile.data.toString("base64"), // Convert Buffer to base64 string
      mimeType: imgFile.mimetype,
    },
  };
  const result = await model.generateContent([prompt, fileData]);
  return result.response.text();
}

async function generateContent(userInstructions) {
  let prompt =
    "You have been given a request to generate code, debug code, or create content (such as stories, poems, or other creative text). " +
    "Your task is to analyze the request carefully and return the necessary information in a structured format. " +
    "Note: You should strictly follow these instructions to ensure clarity and accuracy in your response. " +
    "1. If the request involves generating or writing code, return the following information: " +
    "   - An explanation of what the code does or how it solves the user's problem. The explanation should be clear and concise, written in simple language that the user can easily understand. " +
    "   - The code itself, properly formatted and ready to use. Ensure the code is free of syntax errors and logical mistakes. " +
    "   - Include best practices where applicable, such as proper naming conventions, error handling, and optimization tips if relevant. " +
    "   Example (for a request asking for a function that calculates factorial): " +
    "   [{'explanation': 'This function calculates the factorial of a given number using recursion. Factorial is the product of all positive integers up to a given number.', " +
    "'code': 'function factorial(n) { if (n === 0) return 1; return n * factorial(n - 1); }', 'content': ''}]. " +
    "2. If the request involves debugging code, return the following information: " +
    "   - An explanation of the problem identified in the code, detailing what went wrong (e.g., syntax errors, logic errors, performance bottlenecks). " +
    "   - The corrected or optimized version of the code, ensuring it is ready to run without errors. " +
    "   - A brief explanation of the changes made and why those changes resolve the issue or improve the code. " +
    "   Example (for debugging a function with a missing return statement): " +
    "   [{'explanation': 'The function was missing a return statement, causing it not to return any value. I added a return statement to fix the issue.', " +
    "'code': 'function add(a, b) { return a + b; }', 'content': ''}]. " +
    "3. If the request involves generating creative content, such as stories, poems, or other writing, return the following information: " +
    "   - An explanation of the content created, giving some context or background about it. For example, describe the genre, style, or inspiration behind a story or poem. " +
    "   - The actual content (story, poem, etc.) formatted appropriately for easy reading. " +
    "   Example (for generating a poem about nature): " +
    "   [{'explanation': 'This is a short poem inspired by the beauty of nature, focusing on the peaceful and serene aspects of the natural world.', " +
    "'code': '', 'content': 'The sun sets low, the sky aglow, \nIn gentle winds the flowers grow, \nThe river hums a quiet tune, \nBeneath the watchful silver moon.'}]. " +
    "4. If the request is unclear or lacks sufficient detail, return an explanation stating that more information is required to fulfill the request. Do not generate content or code unless you're confident of the request's intent. Ask clarifying questions if necessary. " +
    "   Example (for an unclear request): " +
    "   [{'explanation': 'The request was unclear, and I need more details to proceed. Could you please specify what type of content or code you need?', 'code': '', 'content': ''}]. " +
    "IMPORTANT NOTES: " +
    "   - Always return the data in the format of a LIST OF ONE DICT with the following keys: 'explanation', 'code', and 'content'. " +
    "   - If there is no 'code' or 'content' to return (e.g., only explaining or asking for clarification), leave that field as an empty string. " +
    "   - Make sure to properly quote all keys and values in the dictionary for easier parsing. " +
    "   - Do NOT use backticks, markdown formatting, or other non-standard symbols in the response. " +
    "Please follow the above rules and generate responses based on the user’s query." +
    "User Query: " +
    userInstructions;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeImage, generateContent };
