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

    let wrapperDiv = document.getElementById(key);
    if (!wrapperDiv)
      wrapperDiv = HTMLRenderer.createWrapperDiv(htmlOverlay, coordinate, key);
    ReactDOM.render(component, wrapperDiv);
  }

  static createWrapperDiv(
    htmlOverlay: HTMLElement,
    coordinate: PointCoordinate,
    key: string,
  ) {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.id = key;
    wrapperDiv.style.position = 'absolute';
    wrapperDiv.style.left = `${coordinate.x}px`;
    wrapperDiv.style.top = `${coordinate.y}px`;
    htmlOverlay.appendChild(wrapperDiv);
    return wrapperDiv;
  }

  static getHTMLOverlayPosition() {
    const htmlOverlay = document.getElementById('html-overlay');
    if (htmlOverlay) return htmlOverlay.getBoundingClientRect();
    else return null;
  }
}
