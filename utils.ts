function setToStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getFromStorage<T>(key: string): T | null {
  const data = window.localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }

  return null;
}

export { setToStorage, getFromStorage };
