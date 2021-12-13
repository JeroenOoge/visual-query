import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";
import './ExcludedPapers.css';

class ExcludedPapers extends React.Component {
    constructor(props) {
        super(props);
        this.getIcon = this.getIcon.bind(this);
        this.state = { hits: [] };
    }

    async componentDidMount() {
        const total = this.props.queryResult["search-results"]["opensearch:totalResults"],
            query = this.props.queryResult["search-results"]["opensearch:Query"]["@searchTerms"],
            batchAmount = 200;
        for (let i = 0; i < Math.ceil(total / batchAmount); i++) {
            const result = await this.props.search(query, batchAmount, batchAmount * i);
            try {
                this.setState({ hits: this.state.hits.concat(result["search-results"]["entry"].map(o => o["dc:title"])) });
            } catch (error) {
                console.error("No search results:", error);
            }
        }
    }

    getIcon(title) {
        return (this.state.hits.includes(title) ?
            <CheckCircleFilled style={{ color: "#52c41a" }} /> :
            <CloseCircleFilled style={{ color: "red" }} />);
    }

    render() {
        const total = this.props.queryResult["search-results"]["opensearch:totalResults"],
            progress = Math.floor(this.state.hits.length / total * 100);
        let spin;
        if (progress < 100) {
            spin = <Spin tip={`Checking (${progress}%)`} />
        }
        return (
            <div>
                <span className="label">Seed papers {spin}</span>
                {this.props.seeds.map(e => <span key={e.replace(" ", "-")}>{this.getIcon(e)} {e}</span>)}
            </div>
        );
    }
}

export default ExcludedPapers;