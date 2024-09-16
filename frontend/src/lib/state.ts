import { makeAutoObservable } from 'mobx';

class DarkModeState {
  constructor() {
    makeAutoObservable(this);
  }

  toggle() {
    const { documentElement } = document;
    if (documentElement.classList.contains('dark')) {
      documentElement.classList.remove('dark');
    } else {
      documentElement.classList.add('dark');
    }
  }
}

export const darkModeState = new DarkModeState();
