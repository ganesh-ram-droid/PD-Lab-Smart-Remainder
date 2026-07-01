const listeners = new Set();

export const showToast = (payload) => {
  listeners.forEach((listener) => listener(payload));
};

export const subscribeToast = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export default {
  showToast,
  subscribeToast
};
