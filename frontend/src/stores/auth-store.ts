import { makeAutoObservable } from 'mobx';

import { checkIsAuthed } from '@/services/user-service';

class AuthStore {
  state = 'pending';
  isAuthed = false;
  constructor() {
    makeAutoObservable(this);
  }
  async check() {
    const controller = new AbortController();
    let isAuthed: boolean;
    try {
      isAuthed = await checkIsAuthed({ signal: controller.signal });
      this.isAuthed = isAuthed;
    } catch (error) {
      console.error('Request failed');
      this.isAuthed = false;
    }
    this.state = 'loaded';
  }
}

export type IAuthStore = AuthStore;

export const authStore = new AuthStore();
