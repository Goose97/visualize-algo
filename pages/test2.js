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
    state: { currentNode: 1, data: [1, 2, 3, 4, 5, 7] },
  },
  {
    state: { currentNode: 2 },
  },
  {
    state: { data: [1, 2, 7, 3, 4, 5] },
  },
];

class Test2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 3, 4, 5],
    };
    this.ref = React.createRef();
  }


  render() {
    const { data } = this.state;
    return (
      <VisualAlgo
        code={code}
        highlightline={codeline}
        explanation={explanation}
        stepDescription={stepDescription}
      >
        <CanvasContainer>
          <Array 
            x={100} 
            y={100} 
            data={data} 
          />
        </CanvasContainer>
      </VisualAlgo>
    );
  }
}

export default Test2;
