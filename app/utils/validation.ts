export const validateUsername = (username: unknown) => {
  if (typeof username !== 'string' || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
  if (username.length > 50) {
    return `Usernames must be less than 50 characters long`;
  }
};

export const validatePassword = (password: unknown) => {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
  if (password.length > 50) {
    return `Passwords must be less than 50 characters long`;
  }
};
