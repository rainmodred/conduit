import { User } from './types';

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

export { saveCredentials, getCredentials, deleteCredentials };
