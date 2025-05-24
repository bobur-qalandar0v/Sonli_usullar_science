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

  const handleClear = () => {
    setInterpolateX("");
    setResult(null);
    setPoints([
      { x: "", y: "" },
      { x: "", y: "" },
    ]);
    setDifferenceTable([]);
    setPolynomial("");
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

  const calculateDifferenceTable = (yValues) => {
    const n = yValues.length;
    const table = Array.from({ length: n }, () => []);

    for (let i = 0; i < n; i++) {
      table[i][0] = yValues[i];
    }

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] = table[i + 1][j - 1] - table[i][j - 1];
      }
    }

    return table;
  };

  const calculate = () => {
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

    const numericPoints = validPoints
      .map((p) => ({
        x: parseFloat(p.x),
        y: parseFloat(p.y),
      }))
      .sort((a, b) => a.x - b.x);

    const n = numericPoints.length;
    const xVals = numericPoints.map((p) => p.x);
    const yVals = numericPoints.map((p) => p.y);

    // h (x oralig'i) tekshirish
    const h = xVals[1] - xVals[0];
    for (let i = 1; i < xVals.length - 1; i++) {
      if (Math.abs(xVals[i + 1] - xVals[i] - h) > 1e-6) {
        message.open({
          type: "warning",
          content:
            "x qiymatlar orasidagi farq (h) teng emas. Bu usul faqat teng oraliqlar uchun.",
        });
        return;
      }
    }

    const x = parseFloat(interpolateX);
    const differenceTable = calculateDifferenceTable(yVals);
    setDifferenceTable(differenceTable);

    let result = 0;
    let p,
      formula = "";

    // Agar x boshlanishga yaqin bo‘lsa → Forward
    if (Math.abs(x - xVals[0]) <= Math.abs(x - xVals[n - 1])) {
      p = (x - xVals[0]) / h;
      result = yVals[0];
      formula = `f(x) = ${yVals[0]}`;
      let term = 1;

      for (let i = 1; i < n; i++) {
        term *= p - (i - 1);
        const delta = differenceTable[0][i];
        result += (term * delta) / factorial(i);
        if (delta !== 0) {
          formula += ` + (${delta.toFixed(3)} * P(${p.toFixed(
            3
          )}, ${i}) / ${i}!)`;
        }
      }
    } else {
      // Backward
      p = (x - xVals[n - 1]) / h;
      result = yVals[n - 1];
      formula = `f(x) = ${yVals[n - 1]}`;
      let term = 1;

      for (let i = 1; i < n; i++) {
        term *= p + (i - 1);
        const delta = differenceTable[n - i - 1][i];
        result += (term * delta) / factorial(i);
        if (delta !== 0) {
          formula += ` + (${delta.toFixed(3)} * P(${p.toFixed(
            3
          )}, ${i}) / ${i}!)`;
        }
      }
    }

    setResult(result);
    setPolynomial(formula);
  };

  const factorial = (n) => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  return (
    <div className="newton-interpolation">
      <div className="newton-interpolation__header">
        <h1>Nyutonning Interpolyatsion Ko'phadi</h1>
        <p>Teng bo'lgan oraliqlar uchun interpolyatsiya kalkulyatori</p>
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
              <button
                className="newton-interpolation__clear-btn"
                onClick={() => handleClear()}
              >
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

// import { Button, message } from "antd";
// import React, { useState } from "react";

// export default function NewtonInterpolation() {
//   const [points, setPoints] = useState([{ x: "", y: "" }]);
//   const [inputX, setInputX] = useState("");
//   const [result, setResult] = useState(null);
//   const [formula, setFormula] = useState("");
//   const [details, setDetails] = useState([]);

//   const handleChangePoint = (index, key, value) => {
//     const newPoints = [...points];
//     newPoints[index][key] = value;
//     setPoints(newPoints);
//   };

//   const addPoint = () => {
//     setPoints([...points, { x: "", y: "" }]);
//   };

//   const removeLastPoint = () => {
//     if (points.length > 1) {
//       setPoints(points.slice(0, -1));
//     }
//   };

//   const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

//   const forwardDifferences = (yValues) => {
//     const n = yValues.length;
//     const table = [yValues];
//     for (let i = 1; i < n; i++) {
//       const prev = table[i - 1];
//       const current = [];
//       for (let j = 0; j < prev.length - 1; j++) {
//         current.push(prev[j + 1] - prev[j]);
//       }
//       table.push(current);
//     }
//     return table;
//   };

//   const calculateNewton = (x, points) => {
//     const n = points.length;
//     const sortedPoints = [...points].sort((a, b) => a.x - b.x);
//     const x0 = parseFloat(sortedPoints[0].x);
//     const h = parseFloat(sortedPoints[1].x) - x0;

//     const yValues = sortedPoints.map((p) => parseFloat(p.y));
//     const delta = forwardDifferences(yValues);

//     let t = (x - x0) / h;
//     let sum = yValues[0];
//     let tProduct = 1;
//     const terms = [`y₀ = ${yValues[0]}`];

//     for (let i = 1; i < n; i++) {
//       tProduct *= t - (i - 1);
//       const term = (delta[i][0] * tProduct) / factorial(i);
//       terms.push(
//         `Δ⁽${i}⁾y₀ × ${tProduct?.toFixed(4)} / ${i}! = ${term?.toFixed(4)}`
//       );
//       sum += term;
//     }

//     return {
//       result: sum,
//       steps: terms,
//       formula: `P(x) = y₀ + Δy₀·t + Δ²y₀·t(t-1)/2! + ...`,
//     };
//   };

//   const handleCalculate = () => {
//     const numericPoints = points.map((p) => ({
//       x: parseFloat(p.x),
//       y: parseFloat(p.y),
//     }));
//     const xVal = parseFloat(inputX);

//     if (numericPoints.length < 2) {
//       message.open({
//         type: "warning",
//         content: "Kamida 2 ta nuqta kerak",
//       });
//       return;
//     }

//     const h = numericPoints[1].x - numericPoints[0].x;
//     const isEquallySpaced = numericPoints.every(
//       (p, i) => i === 0 || p.x - numericPoints[i - 1].x === h
//     );
//     if (!isEquallySpaced) {
//       message.open({
//         type: "warning",
//         content:
//           "x qiymatlar orasidagi farq (h) bir xil bo‘lishi kerak (equally spaced points).",
//       });
//       return;
//     }

//     const { result, steps, formula } = calculateNewton(xVal, numericPoints);
//     setResult(result);
//     setDetails(steps);
//     setFormula(formula);
//   };

//   const handleClear = () => {
//     setPoints([{ x: "", y: "" }]);
//     setInputX("");
//     setResult(null);
//     setDetails([]);
//     setFormula("");
//   };

//   return (
//     <div style={{ height: "100%", overflowY: "scroll" }}>
//       <h1>Nyuton (birinchi) interpolyatsiyasi</h1>
//       <form style={{ display: "flex", alignItems: "start" }}>
//         <div
//           style={{ display: "flex", alignItems: "start", marginTop: "20px" }}
//         >
//           <div>
//             {points.map((point, index) => (
//               <div key={index} className="point__wrap">
//                 <div className="x-input__wrap">
//                   <p style={{ fontSize: "16px" }}>
//                     X<sub>{index}</sub>
//                   </p>
//                   <input
//                     className="x-input"
//                     type="number"
//                     placeholder="x"
//                     value={point.x}
//                     onChange={(e) =>
//                       handleChangePoint(index, "x", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="y-input__wrap">
//                   <p style={{ fontSize: "16px" }}>
//                     Y<sub>{index}</sub>
//                   </p>
//                   <input
//                     className="y-input"
//                     type="number"
//                     placeholder="y"
//                     value={point.y}
//                     onChange={(e) =>
//                       handleChangePoint(index, "y", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "11px",
//                 margin: "10px 0",
//               }}
//             >
//               <p style={{ fontSize: "16px" }}>X</p>
//               <input
//                 type="number"
//                 placeholder="x ni kiriting"
//                 value={inputX}
//                 onChange={(e) => setInputX(e.target.value)}
//                 style={{
//                   width: "110px",
//                   padding: "4px",
//                   fontSize: "16px",
//                   outline: "none",
//                 }}
//               />
//             </div>
//           </div>
//           <div className="btns__wrap">
//             <Button
//               color="primary"
//               variant="outlined"
//               className="add__btn"
//               onClick={addPoint}
//             >
//               Nuqta qo‘shish
//             </Button>
//             {points.length > 1 ? (
//               <Button
//                 color="danger"
//                 variant="outlined"
//                 className="remove__btn"
//                 onClick={removeLastPoint}
//               >
//                 Oxirgi nuqtani o'chirish
//               </Button>
//             ) : (
//               <></>
//             )}
//           </div>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column" }}>
//           <button
//             type="button"
//             className="calculate__btn"
//             onClick={() => handleCalculate()}
//           >
//             Hisoblash
//           </button>
//           <button
//             type="button"
//             className="clear__btn"
//             onClick={() => handleClear()}
//           >
//             Tozalash
//           </button>
//         </div>
//       </form>

//       {result !== null && (
//         <div>
//           <h2 style={{ fontSize: "24px" }}>Natija:</h2>
//           <p style={{ fontSize: "18px", marginTop: "6px" }}>
//             <strong>
//               P({inputX}) ≈ {result?.toFixed(4)}
//             </strong>
//           </p>

//           <div style={{ marginTop: "14px" }}>
//             <h3 style={{fontSize: "18px"}}>Qadamlar:</h3>
//             {details.map((step, i) => (
//               <p key={i} style={{ fontSize: "18px" }}>
//                 {step}
//               </p>
//             ))}
//           </div>

//           <div style={{ marginTop: "14px" }}>
//             <h3 style={{ fontSize: "18px" }}>Umumiy formula:</h3>
//             <p style={{ fontSize: "18px" }}>{formula}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
