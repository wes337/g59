export default class Game {
  static playMusic(music, volume) {}

  static stopMusic() {}

  static playSoundEffect(sound, volume) {
    return new Promise((resolve) => {
      try {
        const url = `/sounds/${sound}`;
        const audio = new Audio(url);
        audio.volume = volume || 0.75;

        audio.onended = () => {
          audio.remove();
          resolve();
        };

        const playPromise = audio.play().catch(() => resolve());

        if (playPromise !== undefined) {
          audio.play().catch(() => resolve());
        }
      } catch {
        // Do nothing
        resolve();
      }
    });
  }
}
