import React from "react";
import { Input } from "antd";

class CategoryInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: this.props.defaultValue};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({value: value});
        this.props.onChange(this.state.value, value);
    }

    render() {        
        const style = {color: `${this.props.colour}`, fontWeight: "bold"};
        return <Input style={style} defaultValue={this.props.defaultValue} bordered={false} onChange={this.handleChange} />;
    }
}

export default CategoryInput;