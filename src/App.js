import React, { useEffect, useState } from "react";
import "./App.css";
import range from "ramda/src/range";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import styled from "styled-components";

const StyledToggleWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin-right: 5rem;
  position: absolute;
  top: 0;
  right: 0;
`;

const StyledHeader = styled.header`
  background-color: ${(props) => (props.darkMode ? "#282c34" : "#fff")};
`;

const App = () => {
  const [darkThemeOn, setDarkThemeOn] = useState(true);
  const X_MAX = 400;
  const Y_MAX = 400;

  function* iterateThroughSomeDragons() {
    yield "funny dragon";
    yield "ice dragon";
    yield "cute dragon";
  }

  useEffect(() => {
    const iterator = iterateThroughSomeDragons();
    iterator.next();
    iterator.next();
    iterator.next();
    iterator.next();
  }, []);

  // useEffect(() => {
  //   setDarkThemeOn(localStorage.getItem("darkThemeOn"));
  // }, []);

  const setDarkTheme = () => {
    localStorage.setItem("darkThemeOn", !darkThemeOn);
    setDarkThemeOn(!darkThemeOn);
  };

  const rand = (high, low) => Math.random() * (high - low) + low;

  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateRandomPoints = (num) => {
    return range(0, num).map((_) => {
      return {
        x: rand(0, X_MAX),
        y: rand(0, Y_MAX),
      };
    });
  };

  const randomPoints = generateRandomPoints(200);

  // we will have team 1 and team -1
  const team = (point) => (point.x > point.y ? 1 : -1);

  const guess = (weights, point) => {
    const sum = point.x * weights.x + point.y * weights.y;

    const team = sum >= 0 ? 1 : -1;
    return team;
  };

  const randomWeights = {
    x: rand(-1, 1),
    y: rand(-1, 1),
  };

  // const testGuess = guess(randomWeights, { x: 300, y: 400 });

  const train = (weights, point, team) => {
    const guessResult = guess(weights, point);
    const error = team - guessResult;
    const learningRate = 0.1;
    // console.log("Error", error);
    return {
      x: weights.x + point.x * error * learningRate,
      y: weights.y + point.y * error * learningRate,
    };
  };

  // const testTrain = () => {
  //   const point = { x: 200, y: 400 };
  //   return train(randomWeights, point, team(point));
  // };

  // const trainWeights = async function* () {
  //   const examples = generateRandomPoints(100).map(point => ({
  //     point,
  //     team: team(point)
  //   }));

  //   console.log("Examples", examples);
  //   let currentWeights = randomWeights;

  //   for (const example of examples) {
  //     currentWeights = train(currentWeights, example.point, example.team);
  //     await sleep(1000);
  //     yield currentWeights;
  //   }

  //   return currentWeights;
  // };

  const trainWeights = () => {
    const examples = generateRandomPoints(100000).map((point) => ({
      point,
      team: team(point),
    }));

    let currentWeights = randomWeights;

    for (const example of examples) {
      currentWeights = train(currentWeights, example.point, example.team);
    }

    return currentWeights;
  };

  const trainedWeights = trainWeights();
  // testTrain();

  const getPointFillColor = (point) => {
    const team = guess(trainedWeights, point) === -1;

    if (team) {
      return "#81ecec";
    } else {
      return darkThemeOn ? "#fff" : "#ef5777";
    }
  };

  return (
    <div className="App">
      <StyledToggleWrapper>
        <label>
          <Toggle
            defaultChecked={darkThemeOn}
            icons={false}
            onChange={setDarkTheme}
          />
        </label>
      </StyledToggleWrapper>
      <StyledHeader className="App-header" darkMode={darkThemeOn}>
        <svg width={X_MAX} height={Y_MAX}>
          {randomPoints.map((point) => (
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill={getPointFillColor(point)}
            />
          ))}
          <line x1="0" x2={X_MAX} y1="0" y2={Y_MAX} stroke="#fd79a8" />
        </svg>
      </StyledHeader>
    </div>
  );
};

export default App;
