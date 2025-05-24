import React, { useState } from "react";
import { message } from "antd";

const NewtonInterpolation = () => {
  const [points, setPoints] = useState([
    { x: "", y: "" },
    { x: "", y: "" },
  ]);
  const [interpolateX, setInterpolateX] = useState("");
  const [result, setResult] = useState(null);
  const [differenceTable, setDifferenceTable] = useState([]);
  const [polynomial, setPolynomial] = useState("");

  const addPoint = () => {
    setPoints([...points, { x: "", y: "" }]);
  };

  const removePoint = (index) => {
    if (points.length > 2) {
      const newPoints = points.filter((_, i) => i !== index);
      setPoints(newPoints);
    }
  };

  const updatePoint = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index][field] = value;
    setPoints(newPoints);
  };

  const calculateDifferenceTable = (sortedPoints) => {
    const n = sortedPoints.length;
    const table = [];

    // Initialize first column with y values
    for (let i = 0; i < n; i++) {
      table[i] = [sortedPoints[i].y];
    }

    // Calculate finite differences
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        const diff = table[i + 1][j - 1] - table[i][j - 1];
        if (!table[i][j]) table[i][j] = diff;
      }
    }

    return table;
  };

  const formatPolynomial = (sortedPoints, diffTable) => {
    let poly = `f(x) = ${diffTable[0][0]}`;

    for (let i = 1; i < sortedPoints.length; i++) {
      let term = "";
      let coeff = diffTable[0][i];

      // Calculate factorial
      let factorial = 1;
      for (let k = 1; k <= i; k++) {
        factorial *= k;
      }
      coeff = coeff / factorial;

      if (coeff !== 0) {
        term = coeff > 0 && i > 0 ? " + " : " ";
        if (coeff < 0) term += "-";
        if (Math.abs(coeff) !== 1) term += Math.abs(coeff);

        for (let j = 0; j < i; j++) {
          term += `(x - ${sortedPoints[j].x})`;
        }

        poly += term;
      }
    }

    return poly;
  };

  const calculateNewtonInterpolation = (x, sortedPoints, diffTable) => {
    let result = diffTable[0][0];

    for (let i = 1; i < sortedPoints.length; i++) {
      let term = diffTable[0][i];

      // Calculate factorial
      let factorial = 1;
      for (let k = 1; k <= i; k++) {
        factorial *= k;
      }

      // Calculate product
      let product = 1;
      for (let j = 0; j < i; j++) {
        product *= x - sortedPoints[j].x;
      }

      result += (term / factorial) * product;
    }

    return result;
  };

  const calculate = () => {
    // Validate input
    const validPoints = points.filter((p) => p.x !== "" && p.y !== "");
    if (validPoints.length < 2) {
      message.open({
        type: "warning",
        content: "Kamida 2 ta nuqta kiriting!",
      });
      return;
    }

    if (interpolateX === "") {
      message.open({
        type: "warning",
        content: "Interpolyatsiya qilinadigan x qiymatini kiriting!",
      });
      return;
    }

    // Convert to numbers and sort by x
    const numericPoints = validPoints
      .map((p) => ({
        x: parseFloat(p.x),
        y: parseFloat(p.y),
      }))
      .sort((a, b) => a.x - b.x);

    const x = parseFloat(interpolateX);

    // Calculate difference table
    const diffTable = calculateDifferenceTable(numericPoints);
    setDifferenceTable(diffTable);

    // Calculate interpolated value
    const interpolatedValue = calculateNewtonInterpolation(
      x,
      numericPoints,
      diffTable
    );
    setResult(interpolatedValue);

    // Format polynomial
    const polyString = formatPolynomial(numericPoints, diffTable);
    setPolynomial(polyString);
  };

  return (
    <div className="newton-interpolation">
      <div className="newton-interpolation__header">
        <h1>Nyutonning Interpolyatsion Ko'phadi</h1>
        <p>Teng bo'lmagan oraliqlar uchun interpolyatsiya kalkulyatori</p>
      </div>

      <div className="newton-interpolation__grid">
        {/* Input Section */}
        <div className="newton-interpolation__input-section">
          <div className="newton-interpolation__data-points">
            <h2>Ma'lumotlar nuqtalari</h2>

            {points.map((point, index) => (
              <div
                key={index}
                className="newton-interpolation__data-points-row"
              >
                <span>x{index}:</span>
                <input
                  type="number"
                  value={point.x}
                  onChange={(e) => updatePoint(index, "x", e.target.value)}
                  placeholder="x"
                />
                <span>f(x{index}):</span>
                <input
                  type="number"
                  value={point.y}
                  onChange={(e) => updatePoint(index, "y", e.target.value)}
                  placeholder="y"
                />
                {points.length > 2 && (
                  <button
                    onClick={() => removePoint(index)}
                    className="newton-interpolation__data-points-remove-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addPoint}
              className="newton-interpolation__data-points-add-btn"
            >
              <span>+</span>
              <span>Nuqta qo'shish</span>
            </button>
          </div>

          <div className="newton-interpolation__interpolation">
            <h3>Interpolyatsiya</h3>
            <div className="newton-interpolation__interpolation-row">
              <span>x =</span>
              <input
                type="number"
                value={interpolateX}
                onChange={(e) => setInterpolateX(e.target.value)}
                placeholder="x qiymati"
              />
              <button
                onClick={calculate}
                className="newton-interpolation__interpolation-btn"
              >
                <span>📊</span>
                <span>Hisoblash</span>
              </button>
              <button className="newton-interpolation__clear-btn">
                Tozalash
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="newton-interpolation__results">
          {differenceTable.length > 0 && (
            <div className="newton-interpolation__difference-table">
              <h3>Chekli ayirmalar jadvali</h3>
              <div className="newton-interpolation__difference-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>i</th>
                      <th>f(xi)</th>
                      <th>Δf</th>
                      <th>Δ²f</th>
                      <th>Δ³f</th>
                    </tr>
                  </thead>
                  <tbody>
                    {differenceTable.map((row, i) => (
                      <tr key={i}>
                        <td>{i}</td>
                        {row.map((val, j) => (
                          <td key={j}>
                            {val !== undefined ? val.toFixed(3) : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {polynomial && (
            <div className="newton-interpolation__polynomial">
              <h3>Ko'phad formulasi</h3>
              <div className="newton-interpolation__polynomial-formula">
                {polynomial}
              </div>
            </div>
          )}

          {result !== null && (
            <div className="newton-interpolation__result">
              <h3>Natija</h3>
              <div className="newton-interpolation__result-value">
                f({interpolateX}) ≈ {result.toFixed(6)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formula explanation */}
      <div className="newton-interpolation__explanation">
        <h3>Formula tushuntirishi</h3>
        <p>
          <strong>Nyuton interpolyatsion ko'phadi:</strong>
        </p>
        <div className="newton-interpolation__explanation-formula">
          N(x) = f(x₀) + (x-x₀)Δf(x₀) + (x-x₀)(x-x₁)Δ²f(x₀)/2! + ...
        </div>
        <p>
          <strong>Bu yerda:</strong>
        </p>
        <ul>
          <li>Δf(xᵢ) = f(xᵢ₊₁) - f(xᵢ) - birinchi tartibli ayirma</li>
          <li>Δ²f(xᵢ) = Δf(xᵢ₊₁) - Δf(xᵢ) - ikkinchi tartibli ayirma</li>
          <li>Va hokazo...</li>
        </ul>
      </div>
    </div>
  );
};

export default NewtonInterpolation;
