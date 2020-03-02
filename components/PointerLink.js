const PointerLink = props => {
  const {
    start: { x: xStart, y: yStart },
    finish: { x: xFinish, y: yFinish }
  } = props;

  const constructPath = () => {
    return `M ${xStart + 50} ${yStart + 25} H ${xFinish}`;
  };

  return <path d={constructPath()} className="pointer-link" />;
};

export default PointerLink;
