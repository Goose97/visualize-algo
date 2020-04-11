const HeadPointer = props => {
  const { headBlock } = props;
  if (headBlock) {
    const { x, y } = headBlock;
    const start = {
      x: x + LINKED_LIST_BLOCK_WIDTH / 2,
      y: y + LINKED_LIST_BLOCK_HEIGHT * 3,
    };
    const finish = {
      x: x + LINKED_LIST_BLOCK_WIDTH / 2,
      y: y + LINKED_LIST_BLOCK_HEIGHT,
    };

    return (
      <g>
        <text
          x={x + LINKED_LIST_BLOCK_WIDTH / 2}
          y={y + LINKED_LIST_BLOCK_HEIGHT * 3}
          dominantBaseline='middle'
          textAnchor='middle'
        >
          HEAD
        </text>
        <path
          d={`M ${start.x} ${start.y - 15} L ${finish.x} ${finish.y + 10}`}
          className='default-stroke'
        />
        <path
          d={`M ${finish.x} ${finish.y + 15} l -5 2 l 5 -12 l 5 12 l -5 -2`}
          className='default-stroke'
        />
      </g>
    );
  } else return null;
};

export default HeadPointer;
