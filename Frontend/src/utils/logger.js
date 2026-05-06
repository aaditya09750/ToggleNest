const isDev = process.env.NODE_ENV !== 'production';

export const logError = (...args) => {
  if (isDev) console.error(...args);
};

export const logInfo = (...args) => {
  if (isDev) console.log(...args);
};

export const logWarn = (...args) => {
  if (isDev) console.warn(...args);
};
