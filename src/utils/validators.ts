export const validateUsername = (username: string) => {
  const trimmedUsername = username.trim();

  const usernameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!usernameRegex.test(trimmedUsername)) {
    return 'Only alphabets, numbers, hypen (-), and underscore (_) are allowed.';
  } else {
    return '';
  }
};

export const validatePassword = (password: string) => {
  const trimmedPassword = password.trim();

  const criteria: { name: string; regex: RegExp }[] = [
    { name: '8 characters', regex: /^.{8,}$/ },
    { name: 'an uppercase alphabet', regex: /^(?=.*[A-Z])/ },
    { name: 'a lowercase alphabet', regex: /^(?=.*[a-z])/ },
    { name: 'a number', regex: /^(?=.*\d)/ },
    { name: 'a special character', regex: /^(?=.*[@$!%*?&])/ },
  ];

  const missingCriteria = criteria.filter(
    ({ regex }) => !regex.test(trimmedPassword)
  );

  return missingCriteria.length > 0
    ? `Password should contain at least: ${missingCriteria
        .map(({ name }) => name)
        .join(', ')}`
    : '';
};
