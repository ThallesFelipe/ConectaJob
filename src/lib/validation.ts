
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validateUsername = (username: string): boolean => {
  return username.trim().length >= 3;
};

export const validateProjectTitle = (title: string): boolean => {
  return title.trim().length >= 5;
};

export const validateProjectDescription = (description: string): boolean => {
  return description.trim().length >= 20;
};

export const validateProjectBudget = (budget: number): boolean => {
  return budget > 0;
};

export const validateProjectDeadline = (deadline: string): boolean => {
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return deadlineDate > today;
};
