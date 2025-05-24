import { Button, Form } from "antd";
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

  const removeLastPoint = () => {
    if (points.length > 1) {
      setPoints(points.slice(0, -1));
    }
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
          numeratorParts.push(`(${x} - ${xj})`);
          denominatorParts.push(`(${xi} - ${xj})`);
          Li *= (x - xj) / (xi - xj);
        }
      }

      const termValue = yi * Li;
      sum += termValue;

      formulaParts.push(`${yi} × ${Li?.toFixed()}`);

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

  const handleClear = () => {
    setPoints([{ x: "", y: "" }]);
    setInputX("");
    setResult(null);
    setDetails([]);
    setFormulaString("");
  };

  return (
    <div style={{ height: "100%", overflowY: "scroll" }}>
      <h1>Lagranj Interpolyatsiya Kalkulyatori</h1>
      <form style={{ display: "flex", alignItems: "start" }}>
        <div
          style={{ display: "flex", alignItems: "start", marginTop: "20px" }}
        >
          <div>
            {points.map((point, index) => (
              <div key={index} className="point__wrap">
                <div className="x-input__wrap">
                  <p style={{ fontSize: "16px" }}>
                    X<sub>{index}</sub>
                  </p>
                  <input
                    className="x-input"
                    type="number"
                    placeholder="x"
                    value={point.x}
                    required
                    onChange={(e) =>
                      handleChangePoint(index, "x", e.target.value)
                    }
                  />
                </div>
                <div className="y-input__wrap">
                  <p style={{ fontSize: "16px" }}>
                    Y<sub>{index}</sub>
                  </p>
                  <input
                    className="y-input"
                    type="number"
                    placeholder="y"
                    value={point.y}
                    required
                    onChange={(e) =>
                      handleChangePoint(index, "y", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "11px",
                margin: "10px 0",
              }}
            >
              <p style={{ fontSize: "16px" }}>X</p>
              <input
                type="number"
                placeholder="x ni kiriting"
                value={inputX}
                onChange={(e) => setInputX(e.target.value)}
                style={{
                  width: "110px",
                  padding: "4px",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>
          </div>
          <div className="btns__wrap">
            <Button
              color="primary"
              variant="outlined"
              className="add__btn"
              onClick={addPoint}
            >
              Nuqta qo‘shish
            </Button>
            {points.length > 1 ? (
              <Button
                color="danger"
                variant="outlined"
                className="remove__btn"
                onClick={removeLastPoint}
              >
                Oxirgi nuqtani o'chirish
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            type="button"
            className="calculate__btn"
            onClick={() => handleCalculate()}
          >
            Hisoblash
          </button>
          <button
            type="button"
            className="clear__btn"
            onClick={() => handleClear()}
          >
            Tozalash
          </button>
        </div>
      </form>
      {result !== null && (
        <div>
          <h2 style={{ fontSize: "24px" }}>Natija:</h2>
          <p style={{ fontSize: "18px", marginTop: "6px" }}>
            <strong>
              P({inputX}) ≈ {result?.toFixed()}
            </strong>
          </p>

          <div>
            {details.map((term, index) => (
              <div key={index}>
                <p style={{ marginTop: "14px", fontSize: "18px" }}>
                  <strong>Formula:</strong> ({term.numerator}) / (
                  {term.denominator})
                </p>
                <p style={{ fontSize: "18px" }}>
                  <strong>
                    L<sub>{term.i}</sub>({inputX}):
                  </strong>{" "}
                  {term.Li?.toFixed()}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "14px" }}>
            <h3 style={{ fontSize: "18px" }}>Yakuniy ifoda:</h3>
            <p style={{ fontSize: "18px" }}>
              {formulaString} = <strong>{result?.toFixed()}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
