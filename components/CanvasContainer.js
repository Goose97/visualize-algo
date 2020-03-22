const CanvasContainer = ({ children }) => {
  return (
    <svg className='canvas' viewBox='0 0 1000 1000' preserveAspectRatio='slice'>
      {children}
    </svg>
  );
};

export default CanvasContainer;
