export class Looper {
  private readonly interval: number; // In milliseconds
  private readonly callback: () => void; // Function to call every interval
  private running: boolean = false;

  constructor(interval: number, callback: () => void) {
    this.interval = interval;
    this.callback = callback;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  }

  private loop() {
    if (!this.running) {
      return;
    }
    this.callback();
    setTimeout(this.loop, this.interval);
  }

  stop() {
    this.running = false;
  }
}
