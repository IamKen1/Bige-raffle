import spinningSound from '../assets/sounds/spinning.mp3';
import winSound from '../assets/sounds/win.mp3';

class SoundManager {
  constructor() {
    // Preload other sounds
    this.spinning = new Audio(spinningSound);
    this.win = new Audio(winSound);

    // Configure sounds
    this.spinning.loop = true;
    this.spinning.volume = 0.5;
    this.win.volume = 0.7;

    // Preload all sounds
    this.preloadSounds();
  }

  preloadSounds() {
    this.spinning.load();
    this.win.load();
  }

  playSpinning() {
    this.spinning.currentTime = 0;
    this.spinning.play();
  }

  stopSpinning() {
    this.spinning.pause();
    this.spinning.currentTime = 0;
  }

  playWin() {
    this.win.currentTime = 0;
    this.win.play();
  }
}

export default new SoundManager();