import { makeAutoObservable } from 'mobx';

class LoginStore {
  email = '';
  password = '';

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.email = email;
    console.log(this.password);
  }

  setPassword(password: string) {
    this.password = password;
    console.log(this.email);
  }

  resetForm() {
    this.email = '';
    this.password = '';
  }

  submitForm() {
    //api call
    console.log('Submitting form', { email: this.email, password: this.password });
    this.resetForm();
  }
}

export const loginStore = new LoginStore();
