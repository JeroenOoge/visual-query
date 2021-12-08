import React from 'react';
import * as d3 from 'd3';
import './BarChart.css';

class BarChart extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.handleBarClick = this.handleBarClick.bind(this);
    // }

    handleBarClick(keyword, category) {
        this.props.onBarClick(keyword, category);
    }

    render() {
        const data = this.props.data.sort((a, b) => b["Impact"] - a["Impact"]),
            labelWidth = 150,
            margin = { top: 0, right: 15, bottom: 10, left: 0 },
            height = this.props.data.length * 25 + margin.top + margin.bottom,
            scaleX = d3.scaleLinear()
                .domain([0, d3.max(this.props.data, d => Math.abs(d["Impact"])),])
                .range([0, this.props.width - margin.left - margin.right - labelWidth]),
            scaleY = d3.scaleBand()
                .domain(data.map(d => d["Keyword"]))
                .range([0, height - margin.top - margin.bottom])
                .paddingInner(.35),
            colour = this.props.colour;

        return (
            <div className="barChart">
                <p className="label">Changes in number of hits when keywords are added to the query</p>
                <svg width={this.props.width} height={height}>
                    <g transform={`translate(${margin.left}, ${margin.top})`}>
                        {data.map(d => {
                            const keyword = d["Keyword"],
                                category = d["Category"];
                            return (
                                <g className="bar"
                                    style={{ pointerEvents: "bounding-box" }}
                                    key={category + keyword}
                                    onClick={this.handleBarClick.bind(this, keyword, category)}>
                                    <text y={scaleY(keyword)}
                                        dy={scaleY.bandwidth() / 2}
                                        fill={d3.color(colour(category)).darker(0.25)}>
                                        {keyword}
                                    </text>
                                    <rect width={scaleX(Math.abs(d["Impact"]))}
                                        height={scaleY.bandwidth()}
                                        transform={`translate(${labelWidth}, ${scaleY(keyword)})`}
                                        className="ant-select-selection-item"
                                        fill={d3.color(colour(category)).copy({ opacity: .75 })} />
                                    <text x={labelWidth + 5}
                                        y={scaleY(keyword)}
                                        dy={scaleY.bandwidth() / 2} >
                                        {d["Impact"].toLocaleString()}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>
        );
    }
}

export default BarChart;