document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  if (prompt.value === "") {
    question.innerText = "Any thing you type or say will show up here";
  } else {
    question.innerText = prompt.value;
  }
});

voiceSettingBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (voiceSettingBtn.classList.contains(`${isFocused}`)) {
    voiceSettingBtn.classList.remove(`${isFocused}`);
    voiceSettingBtnText.classList.remove("hidden");
    voiceSettingBtnIcon.classList.remove("toggled");
    setting.classList.add("hidden");
  } else {
    voiceSettingBtn.classList.add(`${isFocused}`);
    voiceSettingBtnText.classList.add("hidden");
    voiceSettingBtnIcon.classList.add("toggled");
    setting.classList.remove("hidden");
  }
});

magnifierBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (magnifierBtn.classList.contains(`${isFocused}`)) {
    magnifierBtn.classList.remove(`${isFocused}`);
    magnifierBtn.classList.remove(`${isFocused}`);
    magnifierBtnText.classList.remove("hidden");
    magnifierBtnIcon.classList.remove("toggled");
  } else {
    magnifierBtn.classList.add(`${isFocused}`);
    magnifierBtn.classList.add(`${isFocused}`);
    magnifierBtnText.classList.add("hidden");
    magnifierBtnIcon.classList.add("toggled");
  }
});

deafModeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (deafModeBtn.classList.contains(`${isFocused}`)) {
    deafModeBtn.classList.remove(`${isFocused}`);
    deafModeBtn.classList.remove(`${isFocused}`);
    deafModeBtnText.classList.remove("hidden");
    deafModeBtnIcon.classList.remove("toggled");

    DeafModeOff = true;

    if (!textInput.classList.contains("hidden")) {
      textInput.classList.add("hidden");
    }

    if (microphone.classList.contains("hidden")) {
      microphone.classList.remove("hidden");
    }
  } else {
    deafModeBtn.classList.add(`${isFocused}`);
    deafModeBtn.classList.add(`${isFocused}`);
    deafModeBtnText.classList.add("hidden");
    deafModeBtnIcon.classList.add("toggled");
    synth.cancel();
    DeafModeOff = false;

    if (!microphone.classList.contains("hidden")) {
      microphone.classList.add("hidden");
    }

    if (textInput.classList.contains("hidden")) {
      textInput.classList.remove("hidden");
    }
  }
});

// prompt.addEventListener("keyup", (e) => {
//   console.log(e);
//   prompt.addEventListener("keydown", (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       workspace.focus();
//     }
//   });

//   if (prompt.value === "") {
//     question.innerText = "Any thing you type or say will show up here";
//   } else {
//     question.innerText = prompt.value;
//   }
// });

prompt.addEventListener("keyup", function (e) {
  // Update the question text based on the prompt value
  if (prompt.value === "") {
    question.innerText = "Any thing you type or say will show up here";
  } else {
    question.innerText = prompt.value;
  }
});

prompt.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    workspace.focus();
    const statement = prompt.value;
    if (statement.includes("percentage") || statement.includes("%")) {
      const result = calculatePercentage(statement);
      answer.innerText = `Your answer is ${result}`;
    } else if (
      statement.includes("equation") ||
      statement.includes("expression") ||
      statement.includes("statement")
    ) {
      const result = solveEquation(statement);
      answer.innerText = `Your answer is ${result}`;
    } else {
      const result = calculateFromStatement(statement);
      answer.innerText = `Your answer is ${result}`;
    }
  }
});
