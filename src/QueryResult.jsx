import React from 'react';
import Abstract from './Abstract';
import BarChart from './BarChart';

class QueryResult extends React.Component {
    constructor(props) {
        super(props);
        this.handleBarClick = this.handleBarClick.bind(this);
    }

    handleBarClick(keyword, category) {
        this.props.onAbstractChange(keyword, category);
    }

    render() {
        let result;
        if (Object.entries(this.props.data).length > 0) {
            result = <h2>{parseInt(this.props.data["search-results"]["opensearch:totalResults"]).toLocaleString()} hits</h2>;
        }

        let impactChart;
        if (this.props.keywordImpacts.length > 0) {
            impactChart = <BarChart data={this.props.keywordImpacts}
                width="500"
                height="500"
                colour={this.props.colour}
                onBarClick={this.handleBarClick} />;
        }

        let abstracts;
        if (this.props.abstracts.length > 0) {
            abstracts = <div className="abstracts">
                <span className="label">Papers containing {this.props.activeKeyword["Keyword"]}</span>
                {this.props.abstracts.map(a => <Abstract data={a} keyword={this.props.activeKeyword} key={a["coredata"]["prism:doi"]} />)}
            </div>;
        }

        return (
            <>
                {result}
                {impactChart}
                {abstracts}
            </>
        )
    };
}

export default QueryResult;