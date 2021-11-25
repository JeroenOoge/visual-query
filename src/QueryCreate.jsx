import { PlusCircleOutlined } from '@ant-design/icons';
import React from 'react';
import CategoryInput from './CategoryInput';
import CategorySelect from './CategorySelect';
import './QueryCreate.css';

class QueryCreate extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleDeselect = this.handleDeselect.bind(this);
        this.handleCategoryEdit = this.handleCategoryEdit.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }

    handleSelect(keyword, category) {
        let k = keyword.includes(" ") ? '"' + keyword + '"' : keyword;
        this.props.onQueryChange(this.props.data.concat([{Category: category, Keyword: k}]));
    }

    handleDeselect(keyword, category) {
        this.props.onQueryChange(this.props.data.filter(d => !(d["Keyword"] === keyword && d["Category"] === category)));
    }

    handleCategoryEdit(oldValue, newValue) {
        const data = this.props.data.map(d => d["Category"] === oldValue ? {Category: newValue, Keyword: d["Keyword"]} : d);
        this.props.onQueryChange(data);
    }

    addCategory() {
        const cats = [...new Set(this.props.data.map(d => d["Category"]))];
        this.props.onQueryChange(this.props.data.concat([{Category: "Category" + ++cats.length, Keyword: ""}]));        
    }

    render() {
        let inputs;
        let data = this.props.data;
        if (data.length > 0) {
            let cats = [...new Set(data.map(d => d["Category"]))];
            let getKeywords = (c) => data.filter(d => d["Category"] === c).flatMap(d => d["Keyword"]);
            let catInputs = cats.map(c => {
                const colour = this.props.colour(c);
                return (
                <div className="category" key={c}>
                    <CategoryInput colour={colour} defaultValue={c} onChange={this.handleCategoryEdit} />
                    <CategorySelect category={c} keywords={getKeywords(c)} onSelect={this.handleSelect} onDeselect={this.handleDeselect} />
                </div>
                );
            });
            inputs = <>
                        {catInputs} 
                        <span className="add" onClick={this.addCategory}><PlusCircleOutlined /> Add category</span>
                    </>;
        }

        return (
            <>{inputs}</>
        );
    }
}

export default QueryCreate;