import { makeAutoObservable } from 'mobx';

class DarkModeState {
  isDark = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggle() {
    this.isDark = !this.isDark;
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
