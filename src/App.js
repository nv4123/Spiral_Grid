import React, { useState, useEffect } from "react";

export default function SpiralGridApp() {
  const [gridSize, setGridSize] = useState(0);
  const [grid, setGrid] = useState([]);
  const [spiral, setSpiral] = useState([]);
  const [outerLayerGrid, setOuterLayerGrid] = useState([]);

  const handleGridSizeSubmit = (e) => {
    e.preventDefault();
    const size = parseInt(gridSize);
    if (!isNaN(size) && size > 0) {
      const initialGrid = Array.from({ length: size }, () =>
        Array(size).fill("")
      );
      setGrid(initialGrid);
      setOuterLayerGrid(generateOuterLayerGrid(initialGrid));
    }
  };

  const handleCellChange = (row, col, value) => {
    const updatedGrid = grid.map((r) => [...r]);
    updatedGrid[row][col] = value;
    setGrid(updatedGrid);
    setOuterLayerGrid(generateOuterLayerGrid(updatedGrid));
  };

  const generateOuterLayerGrid = (grid) => {
    const size = grid.length;
    const outer = Array.from({ length: size }, () => Array(size).fill(null));
    for (let i = 0; i < size; i++) {
      outer[0][i] = grid[0][i];
      outer[size - 1][i] = grid[size - 1][i];
      outer[i][0] = grid[i][0];
      outer[i][size - 1] = grid[i][size - 1];
    }
    return outer;
  };

  const shiftOuterLayerLeft = (grid) => {
    const size = grid.length;
    const flat = [];

    for (let i = 0; i < size; i++) flat.push(grid[0][i]);
    for (let i = 1; i < size - 1; i++) flat.push(grid[i][size - 1]);
    for (let i = size - 1; i >= 0; i--) flat.push(grid[size - 1][i]);
    for (let i = size - 2; i > 0; i--) flat.push(grid[i][0]);

    flat.push(flat.shift());

    let idx = 0;
    for (let i = 0; i < size; i++) grid[0][i] = flat[idx++];
    for (let i = 1; i < size - 1; i++) grid[i][size - 1] = flat[idx++];
    for (let i = size - 1; i >= 0; i--) grid[size - 1][i] = flat[idx++];
    for (let i = size - 2; i > 0; i--) grid[i][0] = flat[idx++];

    return grid;
  };

  const shiftOuterLayerRight = (grid) => {
    const size = grid.length;
    const flat = [];

    for (let i = 0; i < size; i++) flat.push(grid[0][i]);
    for (let i = 1; i < size - 1; i++) flat.push(grid[i][size - 1]);
    for (let i = size - 1; i >= 0; i--) flat.push(grid[size - 1][i]);
    for (let i = size - 2; i > 0; i--) flat.push(grid[i][0]);

    flat.unshift(flat.pop());

    let idx = 0;
    for (let i = 0; i < size; i++) grid[0][i] = flat[idx++];
    for (let i = 1; i < size - 1; i++) grid[i][size - 1] = flat[idx++];
    for (let i = size - 1; i >= 0; i--) grid[size - 1][i] = flat[idx++];
    for (let i = size - 2; i > 0; i--) grid[i][0] = flat[idx++];

    return grid;
  };

  const handleLeftShift = () => {
    const newGrid = outerLayerGrid.map((r) => [...r]);
    setOuterLayerGrid(shiftOuterLayerLeft(newGrid));
  };

  const handleRightShift = () => {
    const newGrid = outerLayerGrid.map((r) => [...r]);
    setOuterLayerGrid(shiftOuterLayerRight(newGrid));
  };

  useEffect(() => {
    if (grid.length === 0) return;
    const parsed = grid.map((row) =>
      row.map((val) => (isNaN(Number(val)) || val === "" ? null : Number(val)))
    );
    if (!parsed.flat().includes(null)) {
      setSpiral(computeSpiral(parsed));
    } else {
      setSpiral([]);
    }
  }, [grid]);

  const computeSpiral = (matrix) => {
    const result = [];
    let top = 0,
      bottom = matrix.length - 1,
      left = 0,
      right = matrix[0].length - 1;
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
    <div>
      <h1>Spiral Grid Generator</h1>

      {grid.length === 0 && (
        <form onSubmit={handleGridSizeSubmit}>
          <label>Enter Grid Size (n × n):</label>
          <input
            type="number"
            value={gridSize || ""}
            onChange={(e) => setGridSize(e.target.value)}
            required
          />
          <button type="submit">Create Grid</button>
        </form>
      )}

      {grid.length > 0 && (
        <>
          <h2>Original Grid</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 40px)`,
              gap: "2px",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((val, colIndex) => (
                <input
                  key={`main-${rowIndex}-${colIndex}`}
                  type="number"
                  value={val}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  style={{ width: "40px", height: "40px", textAlign: "center" }}
                />
              ))
            )}
          </div>

          <h2>Outer Layer Grid (with Shift)</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 40px)`,
              gap: "2px",
              marginBottom: "10px",
            }}
          >
            {outerLayerGrid.map((row, rowIndex) =>
              row.map((val, colIndex) => (
                <input
                  key={`outer-${rowIndex}-${colIndex}`}
                  type="text"
                  value={val !== null ? val : ""}
                  disabled
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    backgroundColor: val !== null ? "#e0e0e0" : "#fff",
                  }}
                />
              ))
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <button onClick={handleLeftShift}>Shift Outer Layer Left</button>
            <button onClick={handleRightShift} style={{ marginLeft: "10px" }}>
              Shift Outer Layer Right
            </button>
          </div>

          <div>
            <h2>Spiral Order:</h2>
            <div>
              {spiral.length > 0
                ? spiral.join(", ")
                : "Fill all cells to see spiral output"}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
