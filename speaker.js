const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

const keywords = ["help", "solve" /* … */];
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
hints.innerHTML = `Try saying these key words: ${keywordsHTML}.`;

microphone.onclick = () => {
  synth.cancel();
  recognition.start();
  textToSpeech("Ready to receive a command.");
  prompt.value = "";
};

recognition.onresult = (event) => {
  const word = event.results[0][0].transcript;
  prompt.value = word;
  question.innerText = prompt.value;
  console.log(`Confidence: ${event.results[0][0].confidence}`);
};

recognition.onspeechend = () => {
  recognition.stop();
  workspace.focus();
  const statement = question.innerText;
  const result = calculateFromStatement(statement);
  answer.innerText = `Your answer is ${result}`;
  textToSpeech(answer.innerText);
};

// recognition.onnomatch = (event) => {
//   textToSpeech("I didn't recognize that color.");
// };

recognition.onerror = (event) => {
  textToSpeech(`Error occurred in recognition: ${event.error}`);
};
