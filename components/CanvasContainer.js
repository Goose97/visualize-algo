const CanvasContainer = ({ children }) => {
  return (
    <svg
      className='canvas vw-100 vh-50'
      viewBox='0 0 1200 1200'
      preserveAspectRatio='xMinYMin slice'
    >
      {children}
    </svg>
  );
};

export default CanvasContainer;
