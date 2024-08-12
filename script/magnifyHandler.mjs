export const handleClickMagnify = (
  element,
  elementText,
  elementIcon,
  isFocused,
  glass
) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    if (element.classList.contains(`${isFocused}`)) {
      element.classList.remove(`${isFocused}`);
      element.classList.remove(`${isFocused}`);
      elementText.classList.remove("hidden");
      elementIcon.classList.remove("toggled");
      glass.classList.add("hidden");
    } else {
      element.classList.add(`${isFocused}`);
      element.classList.add(`${isFocused}`);
      elementText.classList.add("hidden");
      elementIcon.classList.add("toggled");
      glass.classList.remove("hidden");
    }
  });
};
