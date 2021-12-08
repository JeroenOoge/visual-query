import React from "react";
import { Input, Tooltip } from "antd";

class CategoryInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: this.props.defaultValue };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ value: value });
        this.props.onPressEnter(this.state.value, value);
    }

    render() {
        const style = { color: `${this.props.colour}`, fontWeight: "bold" };
        return (
            <Tooltip trigger={['focus']} title={"Press enter to save"} placement="topLeft">
                <Input style={style} defaultValue={this.props.defaultValue} bordered={false} onPressEnter={this.handleChange} />
            </Tooltip>
        );
    }
}

export default CategoryInput;