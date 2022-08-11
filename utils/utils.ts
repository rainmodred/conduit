import { AuthErrors, User } from './types';

// function setToStorage<T>(key: string, value: T): void {
//   window.localStorage.setItem(key, JSON.stringify(value));
// }

// function getFromStorage(key: string): User | undefined {
//   const data = window.localStorage.getItem(key);
//   if (data) {
//     return JSON.parse(data);
//   }

//   return undefined;
// }

const key = 'auth';

function saveCredentials(value: User): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getCredentials(): User | undefined {
  const data = window.localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return undefined;
}

function deleteCredentials(): void {
  window.localStorage.removeItem(key);
}

function formatDate(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-US', options);
}

function formatAuthErrors(
  authErrors: AuthErrors,
): Record<string, { message: string }> {
  const { errors } = authErrors;
  return Object.keys(errors).reduce((result, key) => {
    const formattedError = {
      [key]: {
        message: `${key} ${errors[key].join()}`,
      },
    };
    return Object.assign(result, formattedError);
  }, {});
}

export {
  saveCredentials,
  getCredentials,
  formatDate,
  deleteCredentials,
  formatAuthErrors,
};
