import React from 'react';
import { Select } from 'antd';

class CategorySelect extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeselect = this.handleDeselect.bind(this);
    }

    handleSelect(keyword) {
        this.props.onSelect(keyword, this.props.category);
    }

    handleDeselect(keyword) {
        this.props.onDeselect(keyword, this.props.category);
    }

    render() {
        return (
            <Select mode="tags" defaultValue = {this.props.keywords} onSelect={this.handleSelect} onDeselect={this.handleDeselect}/>
        );
    }
}

export default CategorySelect;