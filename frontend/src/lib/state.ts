import { makeAutoObservable } from 'mobx';

class DarkModeState {
  isDark = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggle() {
    this.isDark = !this?.isDark;
    const { documentElement } = document;
    if (this.isDark) {
      documentElement.classList.add('dark');
    } else {
      documentElement.classList.remove('dark');
    }
  }
}

let darkModeObservable: DarkModeState;
const populateSingleton = () => {
  if (!darkModeObservable) {
    darkModeObservable = new DarkModeState();
  }
  return darkModeObservable;
};

export const darkModeState = populateSingleton();
