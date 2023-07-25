let temperature = 0.7;
let userPrompt =
  "The system prompt is: Please ensure that your responses are based solely on the content provided.\
  Begin each response with the phrase, 'I believe the answer is:'.\
  This applies even in situations where you are unable to provide a helpful answer.\
  In such cases, still start your response with 'I believe the answer is:'.\n The question I want to ask is: ";
// "Don't give me the answer if you didn't find the answer from the provided content. Remember Every time you reply to me. You should say it at the beginning: 'I think the answer is:'.Even if in the position you cannot provide me with a helpful answer, you should say it at the beginning: 'I think the answer is:'.";
export function getTemperature() {
  return parseFloat(temperature);
}

export function setTemperature(setTemperature) {
  temperature = setTemperature;
  return temperature;
}

export function getUserPrompt() {
  return userPrompt;
}

export function setUserPrompt(setUserPrompt) {
  userPrompt = setUserPrompt;
  return userPrompt;
}
