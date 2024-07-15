const synth = window.speechSynthesis;

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

hints.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(hints.textContent);
};

question.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(question.textContent);
};

answer.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(answer.textContent);
};

workspace.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech("This is your workspace. It contains your question and answer.");
};

voiceSettingBtn.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(
    "Settings button. Click here to change my voice or increase and decrease the speed of my voice"
  );
};

magnifierBtn.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(
    "Magnify button. Click here to toggle on or off the magnifying glass"
  );
};

deafModeBtn.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech(
    "Deaf mode button. Click here to enable or disable deaf mode. Remember, deaf mode turns off voice assistant."
  );
};

microphone.onmouseenter = (e) => {
  e.preventDefault();

  textToSpeech("Click here to start speaking");
};

pitch.onchange = () => {
  pitchValue.textContent = pitch.value;
};

rate.onchange = () => {
  rateValue.textContent = rate.value;
};
