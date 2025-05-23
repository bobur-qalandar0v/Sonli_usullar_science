import React, { useState } from "react";

export default function NewtonInterpolation() {
  const [points, setPoints] = useState([{ x: "", y: "" }]);
  const [inputX, setInputX] = useState("");
  const [result, setResult] = useState(null);
  const [formula, setFormula] = useState("");
  const [details, setDetails] = useState([]);

  const handleChangePoint = (index, key, value) => {
    const newPoints = [...points];
    newPoints[index][key] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: "", y: "" }]);
  };

  const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

  const forwardDifferences = (yValues) => {
    const n = yValues.length;
    const table = [yValues];
    for (let i = 1; i < n; i++) {
      const prev = table[i - 1];
      const current = [];
      for (let j = 0; j < prev.length - 1; j++) {
        current.push(prev[j + 1] - prev[j]);
      }
      table.push(current);
    }
    return table;
  };

  const calculateNewton = (x, points) => {
    const n = points.length;
    const sortedPoints = [...points].sort((a, b) => a.x - b.x);
    const x0 = parseFloat(sortedPoints[0].x);
    const h = parseFloat(sortedPoints[1].x) - x0;

    const yValues = sortedPoints.map((p) => parseFloat(p.y));
    const delta = forwardDifferences(yValues);

    let t = (x - x0) / h;
    let sum = yValues[0];
    let tProduct = 1;
    const terms = [`y₀ = ${yValues[0]}`];

    for (let i = 1; i < n; i++) {
      tProduct *= t - (i - 1);
      const term = (delta[i][0] * tProduct) / factorial(i);
      terms.push(
        `Δ⁽${i}⁾y₀ × ${tProduct.toFixed(4)} / ${i}! = ${term.toFixed(6)}`
      );
      sum += term;
    }

    return {
      result: sum,
      steps: terms,
      formula: `P(x) = y₀ + Δy₀·t + Δ²y₀·t(t-1)/2! + ...`,
    };
  };

  const handleCalculate = () => {
    const numericPoints = points.map((p) => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
    }));
    const xVal = parseFloat(inputX);

    if (numericPoints.length < 2) {
      alert("Kamida 2 ta nuqta kerak");
      return;
    }

    const h = numericPoints[1].x - numericPoints[0].x;
    const isEquallySpaced = numericPoints.every(
      (p, i) => i === 0 || p.x - numericPoints[i - 1].x === h
    );
    if (!isEquallySpaced) {
      alert(
        "x qiymatlar orasidagi farq (h) bir xil bo‘lishi kerak (equally spaced points)."
      );
      return;
    }

    const { result, steps, formula } = calculateNewton(xVal, numericPoints);
    setResult(result);
    setDetails(steps);
    setFormula(formula);
  };

  return (
    <div>
      <h1>Nyuton (birinchi) interpolyatsiyasi</h1>

      {points.map((point, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="x"
            value={point.x}
            onChange={(e) => handleChangePoint(index, "x", e.target.value)}
          />
          <input
            type="number"
            placeholder="y"
            value={point.y}
            onChange={(e) => handleChangePoint(index, "y", e.target.value)}
          />
        </div>
      ))}

      <button onClick={addPoint}>Nuqta qo‘shish</button>

      <div>
        <input
          type="number"
          placeholder="x qiymatini kiriting"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
        />
      </div>

      <button onClick={handleCalculate}>Hisoblash</button>

      {result !== null && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Natija:</h2>
          <p className="bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
            <strong>
              P({inputX}) ≈ {result.toFixed(6)}
            </strong>
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold mb-1">Qadamlar:</h3>
            {details.map((step, i) => (
              <p key={i} className="bg-gray-100 border p-2 rounded">
                {step}
              </p>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Umumiy formula:</h3>
            <p className="bg-blue-100 border border-blue-300 p-3 rounded">
              {formula}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
