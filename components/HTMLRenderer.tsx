import ReactDOM from 'react-dom';

import { PointCoordinate } from 'types';

export default class HTMLRenderer {
  static inject(
    component: React.ReactElement,
    coordinate: PointCoordinate,
    key: string,
  ) {
    const htmlOverlay = document.getElementById('html-overlay');
    if (!htmlOverlay)
      throw new Error("A div with id='html-overlay' must exist");

    let wrapperDiv = HTMLRenderer.createOrUpdateWrapperDiv(
      htmlOverlay,
      coordinate,
      key,
    );
    ReactDOM.render(component, wrapperDiv);
  }

  // Check if the id already exist, if not we should create a new wrapper
  // Also check if we need to change the coordinate
  static createOrUpdateWrapperDiv(
    htmlOverlay: HTMLElement,
    coordinate: PointCoordinate,
    key: string,
  ) {
    const { x, y } = coordinate;
    let wrapperDiv = document.getElementById(key);
    if (wrapperDiv) {
      // Update if necessary
      let currentLeft = parseInt(wrapperDiv.style.left);
      let currentRight = parseInt(wrapperDiv.style.right);
      if (currentLeft !== x) wrapperDiv.style.left = `${x}px`;
      if (currentRight !== y) wrapperDiv.style.top = `${y}px`;
    } else {
      // Create new one
      wrapperDiv = document.createElement('div');
      wrapperDiv.id = key;
      wrapperDiv.style.position = 'absolute';
      wrapperDiv.style.left = `${x}px`;
      wrapperDiv.style.top = `${y}px`;
    }

    htmlOverlay.appendChild(wrapperDiv);
    return wrapperDiv;
  }

  static getHTMLOverlayPosition() {
    const htmlOverlay = document.getElementById('html-overlay');
    if (htmlOverlay) return htmlOverlay.getBoundingClientRect();
    else return null;
  }
}
