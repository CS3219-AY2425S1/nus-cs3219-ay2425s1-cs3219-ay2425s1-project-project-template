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

export const darkModeObservable = new DarkModeState();
