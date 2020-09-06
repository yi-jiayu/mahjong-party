export default class SpeechSynthesisQueue {
  messages: string[];
  playing: boolean;

  constructor() {
    this.messages = [];
    this.playing = false;
  }

  push(text: string) {
    this.messages.push(text);
    if (!this.playing) {
      setTimeout(() => {
        this.play();
      }, 0);
    }
  }

  play() {
    if (this.messages.length === 0) {
      this.playing = false;
      return;
    }
    this.playing = true;
    const message = this.messages.shift();
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => {
      this.play();
    };
  }
}
