import { makeAutoObservable } from 'mobx';

class DarkModeStore {
  mode = 'light';

  constructor() {
    makeAutoObservable(this);
    this.mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }

  toggle = (value: string) => {
    this.mode = value;
    const { documentElement } = document;

    if (value === 'light') {
      documentElement.classList.remove('dark');
    } else {
      documentElement.classList.add('dark');
    }
  };
}

export const darkModeStore = new DarkModeStore();
