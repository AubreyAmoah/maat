const hints = document.getElementById("hints");

const voiceSelect = document.querySelector("select");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

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

window.onload = () => {
  textToSpeech(
    "Hello, welcome my friend. I am your personal voice calculator. My abilities range from solving basic aritmethic like addition, subtraction, multiplications, division and more. I am also able to solve percentages, equations and more."
  );
};

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
