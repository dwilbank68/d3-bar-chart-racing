import React, { useRef, useEffect, useState } from "react";
import { select, scaleBand, scaleLinear, max } from "d3";
// scaleBand for ordinal data like 1,2,3,4,5, scaleLinear for continuous data like 6.37, 1.333, etc
import useResizeObserver from "./useResizeObserver.js";
// polyfill necessary until edge and safari support it native

// const useResizeObserver = ref => {
//     const [dimensions, setDimensions] = useState(null);
//     useEffect(() => {
//         // called as soon as DOM is rendered, then every time dimensions changes
//         const observeTarget = ref.current;
//         const resizeObserver = new ResizeObserver(entries => {
//             // entries = [   {contentRect: {height, width, etc} }   ]
//             entries.forEach(e => { setDimensions(e.contentRect); });
//         });
//         resizeObserver.observe(observeTarget);
//         return () => {
//             resizeObserver.unobserve(observeTarget);
//             // triggered when component is unmounted
//         };
//     }, [ref]);
//     return dimensions;  // {height, width}
// };

function RacingBarChart({ data }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    // wrapperRef is a div surrounding the svg because svg won't give
    // true dimensions in useResizeObserver
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        // called as soon as DOM is rendered, then every time data or dimensions change
        const svg = select(svgRef.current);
        if (!dimensions) return;

        data.sort((a,b) => b.value - a.value);

        const {height, width} = dimensions;

        const xScale = scaleLinear()
            .domain([0, max(data, e => e.value)])
            .range([0, width]);  // width of chart in pixels

        const yScale = scaleBand()
            .domain(data.map((v,i) => i))   // min and max values of data being charted
            .range([0, height])             // height of chart in pixels
            .paddingInner(0.1)

        svg.selectAll(".bar")
            // .data(data)                  // by default every bar is keyed to the index of an element
            .data(data, (d, i) => d.name)   // this keys it to the element's name
            // .join("rect")                // this gives a weird transition from zero upon loading
            .join(enter => enter.append("rect").attr('y', (d,i) => yScale(i)))
            .attr('fill', d => d.color)
            .attr("class", "bar")
            .attr("x", 0)           // bar always starts on the left
            .attr('height', yScale.bandwidth())
            .transition()           // only the values below this line will transition
            .attr("width", d => xScale(d.value))
            .attr("y", (d,i) => yScale(i))

        svg.selectAll(".label")
            .data(data, (d, i) => d.name)   // this keys it to the element's name
            // .join("text")   // this gives a weird transition from zero upon loading
            .join(enter => enter.append("text").attr('y', (d,i) => yScale(i) + yScale.bandwidth() / 2 + 5))
            .text(d => `${d.name} (${d.value} meters)`)
            .attr("class", "label")
            .attr("x", 10)           // 10px margin for text
            .transition()           // only the values below this line will transition
            .attr("y", (d,i) => yScale(i) + yScale.bandwidth() / 2 + 5);

    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}>
                {/* <g className="x-axis" />
                <g className="y-axis" /> */}
            </svg>
        </div>
    );
}

export default RacingBarChart;