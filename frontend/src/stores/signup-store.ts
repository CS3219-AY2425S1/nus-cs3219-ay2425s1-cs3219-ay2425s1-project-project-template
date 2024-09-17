import { makeAutoObservable } from 'mobx';

class SignUpStore {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  // some error states to use in sign up component

  constructor() {
    makeAutoObservable(this);
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setConfirmPassword(confirmPassword: string) {
    this.confirmPassword = confirmPassword;
  }

  resetForm() {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

  validateFields(): boolean {
    // field validating stuff
    return true;
  }

  submitForm() {
    if (!this.validateFields()) {
      // set errors
    }

    // Logic for submitting the form (e.g., API call)

    console.log('Submitting form', {
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });

    this.resetForm();
  }
}

export const signUpStore = new SignUpStore();
