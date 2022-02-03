const sortByKey = (key, order) => (a, b) => order ? a[key] - b[key] : b[key] - a[key];

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const setCapitalizeText = (string) => string && string[0].toUpperCase() + string.slice(1);

export { sortByKey, isEscEvent, setCapitalizeText };
