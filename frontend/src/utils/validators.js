export const required = (label) => ({
  required: `${label} is required.`
});

export const emailRules = {
  required: 'Email address is required.',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Enter a valid email address.'
  }
};

export const passwordRules = {
  required: 'Password is required.',
  minLength: {
    value: 8,
    message: 'Password must contain at least 8 characters.'
  }
};

export const nameRules = {
  required: 'Full name is required.',
  minLength: {
    value: 2,
    message: 'Full name must contain at least 2 characters.'
  },
  maxLength: {
    value: 60,
    message: 'Full name must be less than 60 characters.'
  }
};
