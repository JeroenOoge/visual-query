import React from 'react';
import './Query.css';
import { message } from 'antd';

class Query extends React.Component {
    constructor(props) {
        super(props);
        this.handleCopy = this.handleCopy.bind(this);
    }

    handleCopy() {
        navigator.clipboard.writeText(this.props.query);
        message.success('Query copied to clipboard', 1);
    }

    render() {
        return (
            <div className="query" onClick={this.handleCopy}>
                <span className="label">Query for Scopus</span>
                <p>{this.props.query}</p>
            </div>
        );
    }
}

export default Query;