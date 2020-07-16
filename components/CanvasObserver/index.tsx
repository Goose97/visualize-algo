import { debounce } from 'lodash';

class CanvasObserver {
  private regisiteredCallback: Function[];
  constructor() {
    this.regisiteredCallback = [];
  }

  register(callback: () => void) {
    this.regisiteredCallback.push(callback);
  }

  initiate() {
    if (typeof document === 'undefined') return;
    const canvasNode = document.querySelector('.canvas-container > svg');
    if (!canvasNode) return;

    const config = { attributes: true, childList: true, subtree: true };

    const callback: MutationCallback = mutationsList => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'viewBox'
        ) {
          this.triggerRegisteredCallbacks();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(canvasNode, config);
  }

  triggerRegisteredCallbacks = debounce(() => {
    this.regisiteredCallback.forEach(callback => callback());
  }, 300);
}

const singletonCanvasObserver = new CanvasObserver();
export default singletonCanvasObserver;
