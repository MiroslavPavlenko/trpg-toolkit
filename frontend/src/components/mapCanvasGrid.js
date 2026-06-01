export function drawGrid(context, shape, width, height, gridSize, gridOffsetX, gridOffsetY) {
  if (!gridSize || width <= 0 || height <= 0) return;

  const offX = ((gridOffsetX % gridSize) + gridSize) % gridSize;
  const offY = ((gridOffsetY % gridSize) + gridSize) % gridSize;

  context.beginPath();
  for (let x = offX; x <= width; x += gridSize) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = offY; y <= height; y += gridSize) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.strokeShape(shape);
}
