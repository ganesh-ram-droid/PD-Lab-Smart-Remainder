export const getInitials = (nameOrEmail = '') => {
  const value = nameOrEmail.trim();

  if (!value) {
    return 'U';
  }

  const words = value.split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const formatFirebaseError = (message = '') => {
  if (message.includes('auth/invalid-credential')) {
    return 'Invalid email or password.';
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'An account already exists with this email.';
  }

  if (message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }

  return message || 'Something went wrong. Please try again.';
};
