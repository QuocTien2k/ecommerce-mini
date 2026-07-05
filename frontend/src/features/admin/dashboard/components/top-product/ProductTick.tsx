const ProductTick = ({ x, y, payload }: any) => {
  const text = payload.value;

  return (
    <g transform={`translate(${x},${y})`}>
      <title>{text}</title>

      <text x={0} y={0} dy={4} textAnchor="end" fill="currentColor">
        {text.length > 22 ? `${text.slice(0, 22)}...` : text}
      </text>
    </g>
  );
};

export default ProductTick;
