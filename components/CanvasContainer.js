const CanvasContainer = ({ children, width, height }) => {
  return (
    <svg className="canvas" width={width} height={height}>
      {children}
    </svg>
  );
};

export default CanvasContainer;
