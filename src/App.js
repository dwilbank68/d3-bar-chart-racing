import React, { useState} from 'react';
import RacingBarChart from './RacingBarChart.jsx';
import useInterval from "./useInterval.js";

import './App.css';

const getRandomIdx = array => {
    return Math.floor(array.length * Math.random());
};

function App() {
    const [iteration, setIteration] = useState(0);
    const [start, setStart] = useState(false);
    const [data, setData] = useState([
        { name: "alpha", value: 10, color: "#f4efd3"},
        { name: "beta", value: 15, color: "#cccccc"},
        { name: "charlie", value: 20, color: "#c2b0c9"},
        { name: "delta", value: 25, color: "#9656a1"},
        { name: "echo", value: 30, color: "#fa697c"},
        { name: "foxtrot", value: 35, color: "#fcc169"}
    ]);

    useInterval(() => {
        if (start) {
            const randomIndex = getRandomIdx(data);
            setData(data.map((d, i) => i === randomIndex ? {...d, value: d.value + 10} : d));
            setIteration(iteration + 1);
        }
    }, 500);

    return (
        <React.Fragment>
            <h1>Racing Bar Chart</h1>
            <RacingBarChart data={data}/>
            <button onClick={() => setStart(!start)}>
                {start ? "Stop The Race!" : "Start The Race!"}
            </button>
            <p>Iteration: {iteration}</p>
        </React.Fragment>
    );
}

export default App;
