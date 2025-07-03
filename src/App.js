import React, { useState, useEffect } from "react";

export default function SpiralGridApp() {
  const [gridSize, setGridSize] = useState(0);
  const [grid, setGrid] = useState([]);
  const [spiral, setSpiral] = useState([]);

  const handleGridSizeSubmit = (e) => {
    e.preventDefault();
    const size = parseInt(gridSize);
    if (!isNaN(size) && size > 0) {
      const initialGrid = Array.from({ length: size }, () =>
        Array(size).fill(""),
      );
      setGrid(initialGrid);
    }
  };

  const handleCellChange = (row, col, value) => {
    const updatedGrid = grid.map((r) => [...r]);
    updatedGrid[row][col] = value;
    setGrid(updatedGrid);
  };

  useEffect(() => {
    if (grid.length === 0) return;

    const parsedGrid = grid.map((row) =>
      row.map((val) => (isNaN(Number(val)) || val === "" ? null : Number(val))),
    );

    if (!parsedGrid.flat().includes(null)) {
      setSpiral(computeSpiral(parsedGrid));
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 40px)`,
              gap: "2px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((val, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="number"
                  value={val}
                  onChange={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.value)
                  }
                  style={{ width: "40px", height: "40px", textAlign: "center" }}
                />
              )),
            )}
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
