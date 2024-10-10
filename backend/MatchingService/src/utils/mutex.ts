export class Mutex {
  private lock = Promise.resolve();

  acquire(): Promise<() => void> {
    let unlockNext: () => void;

    const willLock = new Promise<void>((resolve) => (unlockNext = resolve));
    const willUnlock = this.lock.then(() => unlockNext);

    this.lock = willLock;

    return willUnlock;
  }
}
