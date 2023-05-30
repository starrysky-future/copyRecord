const { clipboard } = require("electron");

class ClipboardObserver {
  timer;
  clipboardData;
  duration = 500;
  size = 20;

  constructor(options) {
    const { duration, clipboardData, size } = options;
    this.duration = duration;
    this.clipboardData = clipboardData;
    this.size = size;
  }

  start() {
    this.setClipboardData();
    this.setTimer();
  }
  stop() {
    this.clearTimer();
  }
  clearTimer() {
    clearInterval(this.timer);
  }
  setClipboardData(newText) {
    const text = newText || clipboard.readText();
    if (!text) return;
    if (this.clipboardData.length < this.size) {
      this.clipboardData.unshift(text);
    } else {
      this.clipboardData.pop();
      this.clipboardData.unshift(text);
    }
  }
  setTimer() {
    this.timer = setInterval(() => {
      const text = clipboard.readText();
      console.log(text);
      const index = this.clipboardData.indexOf(text);
      if (index >= 0) {
        this.clipboardData.splice(index, 1);
      }
      this.setClipboardData(text);
    }, this.duration);
  }
}

module.exports = { ClipboardObserver };
