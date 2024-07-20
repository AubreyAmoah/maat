import { handleClickDeaf } from "./deafModeHandler.mjs";
import { handleClickMagnify } from "./magnifyHandler.mjs";
import { handleKeyDown, handleKeyUp } from "./promptHandler.mjs";
import { handleClickVoice } from "./voiceSettingHandler.mjs";

const mic = document.getElementById("microphone");
const textInput = document.getElementById("text-input");

const voiceSettingBtn = document.getElementById("voice-setting");
const voiceSettingBtnText = document.getElementById("voice-setting-text");
const voiceSettingBtnIcon = document.getElementById("voice-setting-icon");

const magnifierBtn = document.getElementById("magnifier");
const magnifierBtnText = document.getElementById("magnifier-text");
const magnifierBtnIcon = document.getElementById("magnifier-icon");

const deafModeBtn = document.getElementById("deafmode");
const deafModeBtnText = document.getElementById("deafmode-text");
const deafModeBtnIcon = document.getElementById("deafmode-icon");

const setting = document.getElementById("setting");

const question = document.getElementById("question");
const answer = document.getElementById("answer");
const prompt = document.getElementById("prompt");
const workspace = document.getElementById("workspace");

const hints = document.getElementById("hints");

const voiceSelect = document.querySelector("select");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

const isFocused = "focus";
let DeafModeOff = true;
const user = window.localStorage.getItem("user");
let isBusy = false;

const promptQuestion = prompt.value;

const synth = window.speechSynthesis;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

let listeningForKeyword = false;

const keywords = ["hello", "hi", "hey", "yo", "whats up" /* … */];
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
  keywordsHTML += `<span> ${keyword}, </span>`;
});

let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();

  for (const voice of voices) {
    const option = document.createElement("option");
    option.textContent = `${voice.name} (${voice.lang})`;

    if (voice.default) {
      option.textContent += " — DEFAULT";
    }

    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

const textToSpeech = (element) => {
  const utterThis = new SpeechSynthesisUtterance(element);
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");
  for (const voice of voices) {
    if (voice.name === selectedOption) {
      utterThis.voice = voice;
    }
  }
  utterThis.pitch = pitch.value;
  utterThis.rate = rate.value;
  synth.speak(utterThis);

  utterThis.onpause = (event) => {
    const char = event.utterance.text.charAt(event.charIndex);
    console.log(
      `Speech paused at character ${event.charIndex} of "${event.utterance.text}", which is "${char}".`
    );
  };
};

const regex =
  /\bsum\b|\bsum of\b|\bsumof\b|\bplus\b|\badd\b|\bminus\b|\bsubtract\b|[-]|\baddition\b|\bsubtraction\b|\bnegative\b|\bpositive\b|\bproduct\b|\bproduct of\b|\bproductof\b|[*]|\bmultiply\b|\bmultiplication\b|\btimes\b|\bmultiplied\b|\bdivision\b|\bdivide\b|\bdivided\b|[/]|\bfrom\b|\bremove\b/gi;

const hint =
  (hints.innerHTML = `Try remember to use keywords like: ${keywordsHTML} to initiate chat.`);

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  const loadingScreen = document.getElementById("loading-screen");

  setTimeout(() => {
    loadingScreen.style.display = "none";

    const readHints = () => {
      textToSpeech(hint);
    };

    if (user) {
      textToSpeech(`Welcome, please tell me your name`);
      textToSpeech(`Welcome back ${user}, glad to have you back`);

      isBusy = false;
    } else {
      isBusy = true;

      textToSpeech("Hello, tell me your name please.");
      recognition.start();

      recognition.onresult = (event) => {
        const word = event.results[0][0].transcript;
        window.localStorage.setItem("user", word);
        textToSpeech(`your name is ${user}`);
      };

      recognition.onspeechend = () => {
        recognition.stop();
      };

      recognition.onerror = (event) => {
        textToSpeech(`I cannot undersatnd you. Please give me a valid name`);
      };
    }

    if (isBusy === false) {
      setTimeout(() => {
        readHints;
        setInterval(readHints, 60000); // 60 seconds interval
      }, 2000);
    }

    if (prompt.value === "") {
      question.innerText = "Any thing you type or say will show up here";
    } else {
      question.innerText = prompt.value;
    }

    //prompt handler
    handleKeyUp(prompt, question);
    handleKeyDown(prompt, answer, workspace);

    //voice settings
    handleClickVoice(
      voiceSettingBtn,
      voiceSettingBtnText,
      voiceSettingBtnIcon,
      setting,
      isFocused
    );

    // magnifier
    handleClickMagnify(
      magnifierBtn,
      magnifierBtnText,
      magnifierBtnIcon,
      isFocused
    );

    //deafmode
    handleClickDeaf(
      deafModeBtn,
      deafModeBtnText,
      deafModeBtnIcon,
      mic,
      textInput,
      DeafModeOff,
      isFocused,
      synth
    );

    if (isBusy === true) {
      hints.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(hints.textContent);
        }
      };

      hints.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      question.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(question.textContent);
        }
      };

      question.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      answer.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(answer.textContent);
        }
      };

      answer.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      workspace.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(
            "This is your workspace. It contains your question and answer."
          );
        }
      };

      workspace.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      voiceSettingBtn.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(
            "Settings button. Click here to change my voice or increase and decrease the speed of my voice"
          );
        }
      };

      voiceSettingBtn.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      magnifierBtn.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(
            "Magnify button. Click here to toggle on or off the magnifying glass"
          );
        }
      };

      magnifierBtn.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      deafModeBtn.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech(
            "Deaf mode button. Click here to enable or disable deaf mode. Remember, deaf mode turns off voice assistant."
          );
        }
      };

      deafModeBtn.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      microphone.onmouseenter = (e) => {
        e.preventDefault();
        synth.cancel();
        if (DeafModeOff) {
          textToSpeech("Click here to start speaking");
        }
      };

      microphone.onmouseleave = (e) => {
        e.preventDefault();
        synth.cancel();
      };

      pitch.onchange = () => {
        pitchValue.textContent = pitch.value;
      };

      rate.onchange = () => {
        rateValue.textContent = rate.value;
      };
    }
  }, 5000);
});
