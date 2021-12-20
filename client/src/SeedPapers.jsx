import { CheckCircleFilled, CloseCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";
import './SeedPapers.css';

class SeedPapers extends React.Component {
    constructor(props) {
        super(props);
        this.getIcon = this.getIcon.bind(this);
        this.getList = this.getList.bind(this);
        const status = this.props.seeds.map(s => ({ Title: s["Title"], Url: s["Url"], Status: undefined }));
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

    getList(name, data, showSpin = false) {
        const total = this.props.seeds.length,
            checked = this.state.status.filter(d => d["Status"] !== undefined).length;
        let spin;
        if (checked !== total && showSpin) {
            spin = <Spin tip={`Checking (${checked}/${total})`} />
        }
        if (data.length > 0) {
            return (
                <div className="seed-papers">
                    <span className="label">Seed papers {name} ({data.length}/{total}) {spin}</span>
                    {data.map(e => <a key={e["Title"].replace(" ", "-")} href={e["Url"]}>{this.getIcon(e["Title"])} {e["Title"]}</a>)}
                </div>
            );
        }
    }

    render() {
        return (
            <>
                {this.getList("excluded", this.state.status.filter(s => s["Status"] === 0))}
                {this.getList("to check", this.state.status.filter(s => s["Status"] === undefined), true)}
                {this.getList("included", this.state.status.filter(s => s["Status"] === 1))}
            </>
        );
    }
}

export default SeedPapers;