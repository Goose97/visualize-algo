import React, { Component } from "react";
import { VisualAlgo } from "layout";
import { CanvasContainer, Array } from "components";

const code = `search(value) {
    let index = 0;
    let current = this.list;
    do {
      // Nếu tìm thấy thì return index
      if (current.val === value) return index;
      current = current.next;
      index++;
    } while (current)
    
    return index;
  } `;
const codeline = 1;

class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <VisualAlgo code={code} highlightline={codeline}>
        <CanvasContainer height={800}>
          <Array></Array>
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test2;
