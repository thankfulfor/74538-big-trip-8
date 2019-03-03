export const getRandomNumber = function (number) {
  return Math.floor(Math.random() * number);
};

export const getRandomBoolean = function () {
  return Math.random() > 0.5;
};
