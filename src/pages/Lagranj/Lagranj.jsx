import React, { useState } from "react";

export default function LagrangeInterpolation() {
  const [points, setPoints] = useState([{ x: "", y: "" }]);
  const [inputX, setInputX] = useState("");
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState([]);
  const [formulaString, setFormulaString] = useState("");

  const handleChangePoint = (index, key, value) => {
    const newPoints = [...points];
    newPoints[index][key] = value;
    setPoints(newPoints);
  };

  const addPoint = () => {
    setPoints([...points, { x: "", y: "" }]);
  };

  const calculateLagrange = (x, points) => {
    const n = points.length;
    let sum = 0;
    const terms = [];
    const formulaParts = [];

    for (let i = 0; i < n; i++) {
      let xi = parseFloat(points[i].x);
      let yi = parseFloat(points[i].y);

      let Li = 1;
      let numeratorParts = [];
      let denominatorParts = [];

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          const xj = parseFloat(points[j].x);
          numeratorParts.push(`(x - ${xj})`);
          denominatorParts.push(`(${xi} - ${xj})`);
          Li *= (x - xj) / (xi - xj);
        }
      }

      const termValue = yi * Li;
      sum += termValue;

      formulaParts.push(`${yi} × ${Li.toFixed()}`);

      terms.push({
        i,
        xi,
        yi,
        Li,
        termValue,
        numerator: numeratorParts.join(" · "),
        denominator: denominatorParts.join(" · "),
      });
    }

    return {
      result: sum,
      terms,
      formulaStr: `P(x) = ${formulaParts.join(" + ")}`,
    };
  };

  const handleCalculate = () => {
    const numericPoints = points.map((p) => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
    }));
    const xVal = parseFloat(inputX);

    const { result, terms, formulaStr } = calculateLagrange(
      xVal,
      numericPoints
    );
    setResult(result);
    setDetails(terms);
    setFormulaString(formulaStr);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Lagranj Interpolyatsiya Kalkulyatori
      </h1>

      {points.map((point, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="x"
            className="border p-1 w-1/2"
            value={point.x}
            onChange={(e) => handleChangePoint(index, "x", e.target.value)}
          />
          <input
            type="number"
            placeholder="y"
            className="border p-1 w-1/2"
            value={point.y}
            onChange={(e) => handleChangePoint(index, "y", e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={addPoint}
        className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
      >
        Nuqta qo‘shish
      </button>

      <div className="mb-4">
        <input
          type="number"
          placeholder="x qiymatini kiriting"
          className="border p-1 w-full"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
        />
      </div>

      <button
        onClick={handleCalculate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Hisoblash
      </button>

      {result !== null && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Natija:</h2>
          <p className="bg-yellow-100 border border-yellow-300 p-3 rounded mb-4">
            <strong>
              P({inputX}) ≈ {result.toFixed()}
            </strong>
          </p>

          <div className="space-y-4">
            {details.map((term, index) => (
              <div key={index} className="border p-3 rounded bg-gray-100">
                <h3 className="font-semibold mb-1">
                  L<sub>{term.i}</sub>(x):
                </h3>
                <p>
                  <strong>Formula:</strong> ({term.numerator}) / (
                  {term.denominator})
                </p>
                <p>
                  <strong>
                    L<sub>{term.i}</sub>({inputX}):
                  </strong>{" "}
                  {term.Li.toFixed()}
                </p>
                <p>
                  <strong>
                    {term.yi} × L<sub>{term.i}</sub>:
                  </strong>{" "}
                  {term.termValue.toFixed()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold">Yakuniy ifoda:</h3>
            <p className="mt-2 bg-blue-100 border border-blue-300 p-3 rounded">
              {formulaString} = <strong>{result.toFixed()}</strong>
              <br />
              {formulaString} = <strong>{result.toFixed()}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
