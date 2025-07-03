import React, { useState } from "react";

export default function SpiralGridApp() {
  const [gridSize, setGridSize] = useState(0);
  const [inputStep, setInputStep] = useState(1);
  const [cellInputs, setCellInputs] = useState("");
  const [grid, setGrid] = useState([]);
  const [spiral, setSpiral] = useState([]);

  const handleGridSizeSubmit = (e) => {
    e.preventDefault();
    const size = parseInt(gridSize);
    if (!isNaN(size) && size > 0) {
      setInputStep(2);
    }
  };

  const handleCellInputSubmit = (e) => {
    e.preventDefault();
    const values = cellInputs.split(",").map((v) => v.trim());
    const expected = gridSize * gridSize;
    if (values.length !== expected) {
      alert(`Expected ${expected} values but got ${values.length}`);
      return;
    }
    const newGrid = Array.from({ length: gridSize }, (_, i) =>
      values.slice(i * gridSize, (i + 1) * gridSize),
    );
    setGrid(newGrid);
    setInputStep(3);
    setSpiral(computeSpiral(newGrid));
  };

  const computeSpiral = (matrix) => {
    const result = [];
    let top = 0;
    let bottom = matrix.length - 1;
    let left = 0;
    let right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
      for (let i = left; i <= right; i++) result.push(matrix[top][i]);
      top++;

      for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
      right--;

      if (top <= bottom) {
        for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
        bottom--;
      }

      if (left <= right) {
        for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
        left++;
      }
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Spiral Grid Generator
        </h1>

        {inputStep === 1 && (
          <form onSubmit={handleGridSizeSubmit} className="mb-6">
            <label className="block mb-2 text-gray-600">
              Enter Grid Size (n for n x n grid):
            </label>
            <input
              type="number"
              value={gridSize || ""}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Generate Grid Inputs
            </button>
          </form>
        )}

        {inputStep === 2 && (
          <form onSubmit={handleCellInputSubmit} className="mb-6">
            <label className="block mb-2 text-gray-600">
              Enter {gridSize * gridSize} values separated by commas:
            </label>
            <textarea
              value={cellInputs}
              onChange={(e) => setCellInputs(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full h-32 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Grid
            </button>
          </form>
        )}

        {inputStep === 3 && (
          <>
            <div
              className="grid mb-6 mx-auto"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: "300px",
                height: "300px",
                border: "2px solid #333",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {grid.flat().map((val, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#f9f9f9",
                    aspectRatio: "1 / 1",
                  }}
                >
                  {val}
                </div>
              ))}
            </div>
            <div className="mb-2 text-lg font-semibold text-gray-700">
              Spiral Order:
            </div>
            <div className="text-sm text-gray-600 whitespace-pre-wrap break-words">
              {spiral.join(", ")}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
