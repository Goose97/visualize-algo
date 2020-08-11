import React, { Component } from "react";
import MemoryBlock from "components/MemoryBlock";
import withSwap from "hocs/withSwap";

class MemoryBlockWithSwap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <MemoryBlock {...this.props} />;
  }
}

export default withSwap(MemoryBlockWithSwap);
