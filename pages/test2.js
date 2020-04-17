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
const explanation = [
  "Khởi tạo giá trị node hiện tại là head của linked list và giá trị index bằng 0",
  "So sánh giá trị của node hiện tại với giá trị đang tìm kiếm",
  "Nếu khớp thì trả về giá trị index",
  "Nếu không thì đặt node tiếp theo (node.next) là node hiện tại và tăng index lên 1",
  "Lặp lại bước 2",
];

const stepDescription = [
  {
    state: {
      data: [1, 2, 3, 4, 5],
      currentNode: 0,
      codeLine: "2-3",
      explanationStep: 1,
    },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 1, codeLine: "7-8", explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 2, codeLine: "7-8", explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { explanationStep: 3 },
  },
];

const animationDescription = [
  {
    state: { currentNode: 0, codeLine: "2-3", explanationStep: 1 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 1, codeLine: "7-8", explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { currentNode: 2, codeLine: "7-8", explanationStep: 4 },
  },
  {
    state: { explanationStep: 5 },
  },
  {
    state: { codeLine: 6, explanationStep: 2 },
  },
  {
    state: { explanationStep: 3 },
  },
];

class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 3, 4, 5],
      ...animationDescription[0].state,
      focusNode: [1, 2],
      swapNode: [],
      swapDistance: 0,
    };
    this.ref = React.createRef();
  }

  focusNode(nodeIndexs) {
    this.setState({ focusNode: nodeIndexs });
  }

  swapNode(nodeIndexs) {
    this.setState({ swapNode: nodeIndexs });
  }

  swap = (nodeIndexs) => () => {
    this.focusNode(nodeIndexs);
    this.swapNode(nodeIndexs);
    const distance = Math.abs(nodeIndexs[1] - nodeIndexs[0]);
    this.setState({
      swapDistance: distance
    })
  };

  render() {
    const { data, explanationStep, focusNode, swapNode, swapDistance } = this.state;
    return (
      <VisualAlgo
        code={code}
        highlightline={codeline}
        explanation={explanation}
        stepDescription={stepDescription}
        explanationStep={explanationStep}
      >
        <button onClick={this.swap([1,4])}>SWAP</button>
        <CanvasContainer>
          <Array 
            x={100} 
            y={100} 
            data={data} 
            focusNode={focusNode}
            swapNode={swapNode}
            swapDistance={swapDistance}
          />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test2;
