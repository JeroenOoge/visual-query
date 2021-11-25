import React from 'react';
import './Query.css';
import { message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

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
            <div className="query">
                <span className="label">
                    Query for Scopus <CopyOutlined className="copy" onClick={this.handleCopy} />
                </span>
                <p>{this.props.query}</p>
            </div>
        );
    }
}

export default Query;