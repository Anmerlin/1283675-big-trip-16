const getRandomIntegerRangeInclusive = (fromValue = 0, toValue = 1) => {
  const randomValue = fromValue + Math.random() * (toValue - fromValue + 1);
  return Math.floor(randomValue);
};

const getArrayRandomLengthFromValues = (arr, length) => {
  const randomLength = getRandomIntegerRangeInclusive(1, length);
  const currentArray = arr.slice();
  const result = [];

  while (currentArray.length > 0) {
    const randomIndex = getRandomIntegerRangeInclusive(0, currentArray.length - 1);
    const element = currentArray.splice(randomIndex, 1)[0];
    result.push(element);
  }

  return result.slice(0, randomLength);
};

const getRandomValueFromArray = (arr) => {
  const randomIndex = getRandomIntegerRangeInclusive(0, arr.length - 1);
  return arr[randomIndex];
};

const showTwoDigits = (number) => (
  number.toString().padStart(2, '0')
);

const sortByKey = (key, order) => (a, b) => order ? a[key] - b[key] : b[key] - a[key];

const getBoolean = () => Boolean(getRandomIntegerRangeInclusive(0, 1));

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { showTwoDigits, sortByKey, getBoolean, getRandomIntegerRangeInclusive, getArrayRandomLengthFromValues, getRandomValueFromArray, isEscEvent };
