import ReactDOM from 'react-dom';

import { PointCoordinate } from 'types';

export default class HTMLRenderer {
  static inject(component: React.ReactElement, coordinate: PointCoordinate) {
    const htmlOverlay = document.getElementById('html-overlay');
    if (!htmlOverlay)
      throw new Error("A div with id='html-overlay' must exist");

    const wrapperDiv = HTMLRenderer.createWrapperDiv(htmlOverlay, coordinate);
    ReactDOM.render(component, wrapperDiv);
  }

  static createWrapperDiv(
    htmlOverlay: HTMLElement,
    coordinate: PointCoordinate,
  ) {
    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.position = 'absolute';
    wrapperDiv.style.left = `${coordinate.x}px`;
    wrapperDiv.style.top = `${coordinate.y}px`;
    htmlOverlay.appendChild(wrapperDiv);
    return wrapperDiv;
  }
}
