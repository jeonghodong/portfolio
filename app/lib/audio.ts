import { Howl } from 'howler';

export class AudioManager {
  private sound: Howl | null = null;
  private currentUrl: string | null = null;

  play(url: string, onEnd?: () => void) {
    // Stop current sound if playing
    if (this.sound) {
      this.sound.stop();
    }

    // Create new sound
    this.sound = new Howl({
      src: [url],
      html5: true,
      onend: onEnd,
      onloaderror: (id, error) => {
        console.error('Audio load error:', error);
      },
      onplayerror: (id, error) => {
        console.error('Audio play error:', error);
      },
    });

    this.currentUrl = url;
    this.sound.play();
  }

  pause() {
    if (this.sound) {
      this.sound.pause();
    }
  }

  resume() {
    if (this.sound) {
      this.sound.play();
    }
  }

  stop() {
    if (this.sound) {
      this.sound.stop();
      this.sound = null;
      this.currentUrl = null;
    }
  }

  isPlaying(): boolean {
    return this.sound?.playing() ?? false;
  }

  getCurrentUrl(): string | null {
    return this.currentUrl;
  }

  getDuration(): number {
    return this.sound?.duration() ?? 0;
  }

  getPosition(): number {
    return this.sound?.seek() as number ?? 0;
  }

  setPosition(position: number) {
    if (this.sound) {
      this.sound.seek(position);
    }
  }

  setVolume(volume: number) {
    if (this.sound) {
      this.sound.volume(volume);
    }
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();
