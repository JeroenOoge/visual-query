import React from 'react';
import { Button } from 'antd';

class QueryButton extends React.Component {
    render() {
        return (
            <Button type="primary" onClick={this.props.onClick}>Query Scopus</Button>
        )
    };
}

export default QueryButton;