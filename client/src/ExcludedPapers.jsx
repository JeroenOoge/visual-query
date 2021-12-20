import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";
import './ExcludedPapers.css';

class ExcludedPapers extends React.Component {
    constructor(props) {
        super(props);
        this.getIcon = this.getIcon.bind(this);
        const status = this.props.seeds.map(s => ({ Title: s["Title"], Status: undefined }));
        this.state = { status: status };
    }

    async componentDidMount() {
        const query = this.props.queryResult["search-results"]["opensearch:Query"]["@searchTerms"];
        for (let i = 0; i < this.state.status.length; i++) {
            const paper = this.state.status[i];
            const checkQuery = `${query} AND TITLE("${paper["Title"]}")`;
            const result = await this.props.search(checkQuery),
                statusNew = this.state.status;
            statusNew[i]["Status"] = result["search-results"]["opensearch:totalResults"] > 0 ? 1 : 0;
            this.setState({ status: statusNew });
        }
    }

    getIcon(title) {
        const paper = this.state.status.filter(d => d["Title"] === title)[0];
        let icon;
        switch (paper["Status"]) {
            case 1:
                icon = <CheckCircleFilled style={{ color: "#52c41a" }} />;
                break;
            case 0:
                icon = <CloseCircleFilled style={{ color: "#d62728" }} />;
                break;
            default:
                icon = <QuestionCircleFilled style={{ color: "#ff9f4a" }} />
        }
        return icon;
    }

    render() {
        const total = this.props.seeds.length,
            checked = this.state.status.filter(d => d["Status"] !== undefined).length;
        let spin;
        if (checked !== total) {
            spin = <Spin tip={`Checking (${checked}/${total})`} />
        }
        return (
            <div>
                <span className="label">Seed papers {spin}</span>
                {this.props.seeds.map(e => <a key={e["Title"].replace(" ", "-")} href={e["Url"]}>{this.getIcon(e["Title"])} {e["Title"]}</a>)}
            </div>
        );
    }
}

export default ExcludedPapers;