export default class Camera {
  #currentStream;
  #streaming = false;
 
  #videoElement;
 
  constructor({ video, options = {} }) {
    this.#videoElement = video;
 
    this.#initialListener();
  }
 
  #initialListener() {
    this.#videoElement.oncanplay = () => {
      if (this.#streaming) {
        return;
      }
 
      this.#streaming = true;
    };
  }
 
  async #getStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
        },
      });
 
      return stream;
    } catch (error) {
      console.error('#getStream: error:', error);
      return null;
    }
  }
 
  async launch() {
    this.#currentStream = await this.#getStream();
 
    this.#videoElement.srcObject = this.#currentStream;
    this.#videoElement.play();
  }
 
  stop() {
    if (this.#videoElement) {
      this.#videoElement.srcObject = null;
      this.#streaming = false;
    }
 
    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }
}