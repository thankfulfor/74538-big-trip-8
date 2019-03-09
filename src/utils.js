export const getRandomNumber = function (number) {
  return Math.floor(Math.random() * number);
};

export const getRandomBoolean = function () {
  return Math.random() > 0.5;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
