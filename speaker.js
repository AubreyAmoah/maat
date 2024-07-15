const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const keywords = [
  "add",
  "multiply",
  "divide",
  "subtract",
  "percentage" /* … */,
];
const grammar = `#JSGF V1.0; grammar keywords; public <keywords> = ${keywords.join(
  " | "
)};`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let keywordsHTML = "";
keywords.forEach((keyword, i) => {
  keywordsHTML += `<span> ${keyword} </span>`;
});
hints.innerHTML = `Try remember to use keywords like: ${keywordsHTML}. to prevent any umwanted behavior`;

microphone.onclick = () => {
  synth.cancel();
  recognition.start();
  textToSpeech("Ready to receive a command.");
  prompt.value = "";
};

let recognizedText = "";
console.log(recognizedText)

recognition.onresult = (event) => {
  recognizedText = event.results[0][0].transcript;
  prompt.value = recognizedText;
  question.innerText = prompt.value;
  console.log(recognizedText);
  //   console.log(`Confidence: ${event.results[0][0].confidence}`);
};

recognition.onspeechend = () => {
  console.log(recognizedText);
  recognition.stop();
  workspace.focus();
  const statement = recognizedText;

  if (statement.includes("percentage") || statement.includes("%")) {
    const result = calculatePercentage(statement);
    answer.innerText = `Your answer is ${result}`;
  } else {
    const result = calculateFromStatement(statement);
    answer.innerText = `Your answer is ${result}`;
  }
};

// recognition.onnomatch = (event) => {
//   textToSpeech("I didn't recognize that color.");
// };

recognition.onerror = (event) => {
  textToSpeech(`Error occurred in recognition: ${event.error}`);
};
