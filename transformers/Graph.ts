import produce from 'immer';
import { compose } from 'lodash/fp';

import { Graph } from 'types/ds/Graph';

// Nhận vào trạng thái hiện tại của data structure
// và operation tương ứng. Trả về trạng thái mới
const transformGraphModel = (
  currentModel: Graph.Model,
  operation: Graph.Method,
  payload: any[],
): Graph.Model => {
  switch (operation) {
    default:
      return currentModel;
  }
};

export default transformGraphModel;
