const PaintBlob = ({ color, v = 0 }) => {
  const p = ["M45 5C60 2 80 8 90 20C100 32 98 52 90 65C82 78 65 88 48 90C31 92 12 82 5 68C-2 54 2 35 10 22C18 9 30 8 45 5Z","M50 3C65 1 82 10 92 25C102 40 96 58 85 72C74 86 55 92 40 88C25 84 10 72 4 56C-2 40 5 22 15 12C25 2 35 5 50 3Z","M42 4C58 0 78 6 88 18C98 30 100 50 92 66C84 82 68 92 50 92C32 92 14 80 6 64C-2 48 0 28 8 16C16 4 26 8 42 4Z"];
  return (<svg viewBox="0 0 100 95" style={{ width: "100%", height: "100%" }}><path d={p[v % 3]} fill={color} /></svg>);
};

export default PaintBlob;
