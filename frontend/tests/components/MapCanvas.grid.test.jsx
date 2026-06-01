import { describe, expect, it, vi } from "vitest";
import { drawGrid } from "@/components/mapCanvasGrid";

function makeContext() {
  return {
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    strokeShape: vi.fn(),
  };
}

describe("drawGrid", () => {
  it("draws the entire grid as one stroked path", () => {
    const context = makeContext();
    const shape = {};

    drawGrid(context, shape, 100, 50, 25, 0, 0);

    expect(context.beginPath).toHaveBeenCalledTimes(1);
    expect(context.moveTo).toHaveBeenCalledTimes(8);
    expect(context.lineTo).toHaveBeenCalledTimes(8);
    expect(context.strokeShape).toHaveBeenCalledTimes(1);
    expect(context.strokeShape).toHaveBeenCalledWith(shape);
  });

  it("normalizes negative offsets without drawing outside the map", () => {
    const context = makeContext();

    drawGrid(context, {}, 100, 50, 25, -5, -10);

    expect(context.moveTo).toHaveBeenNthCalledWith(1, 20, 0);
    expect(context.moveTo).toHaveBeenNthCalledWith(5, 0, 15);
  });

  it("skips drawing when the grid has no usable size", () => {
    const context = makeContext();

    drawGrid(context, {}, 100, 50, 0, 0, 0);

    expect(context.beginPath).not.toHaveBeenCalled();
    expect(context.strokeShape).not.toHaveBeenCalled();
  });
});
