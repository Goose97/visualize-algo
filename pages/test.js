import React, { Component } from "react";

import { LinkedList, CanvasContainer } from "components";
import "styles/main.scss";

export class Test extends Component {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  render() {
    return (
      <CanvasContainer height={800}>
        <LinkedList x={100} y={100} />
      </CanvasContainer>
    );
  }
}

export default Test;
