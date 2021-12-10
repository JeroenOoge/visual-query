import 'antd/dist/antd.css';
import { Button, message } from 'antd';
import { csvParse } from 'd3-dsv';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React from 'react';
import './App.css';
import DragUpload from './DragUpload.js';
import ExcludedPapers from './ExcludedPapers';
import QueryCreate from './QueryCreate.jsx';
import QueryButton from './QueryButton.jsx';
import QueryResult from './QueryResult.jsx';
import Query from './Query';
import { parse } from 'json2csv';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.handleDataDrop = this.handleDataDrop.bind(this);
    this.handleQueryButtonClick = this.handleQueryButtonClick.bind(this);
    this.getQueryResult = this.getQueryResult.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleAbstractChange = this.handleAbstractChange.bind(this);
  }

  initialState = () => {
    return {
      data: [{ Category: "ai", Keyword: "machine learning" }],
      queryResult: Object.create({}),
      keywordImpacts: [],
      abstracts: [],
      activeKeyword: ""
    }
  };

  buildQuery = (array) => {
    let cats = new Set(array.map(d => d["Category"]));
    let query = [];
    cats.forEach(c => {
      let group = array.filter(d => d["Category"] === c).map(d => d["Keyword"]).join(" OR ");
      query.push("(" + group + ")");
    });
    return query.length === 0 ? "()" : query.join(" AND ");
  }

  limitQuery = (str) => {
    let limit = ` AND ( LIMIT-TO ( DOCTYPE,"ar" ) OR LIMIT-TO ( DOCTYPE,"cp" ) OR LIMIT-TO ( DOCTYPE,"ch" ) )
      AND ( LIMIT-TO ( LANGUAGE,"English" ) )
      AND  PUBYEAR  <  2022`;
    return "TITLE-ABS-KEY (" + str + ")" + limit;
  }

  buildQueryFull = (array) => {
    return this.limitQuery(this.buildQuery(array));
  }

  buildQueryUniquePapers = (array, keyword, category) => {
    const queryOtherCats = this.buildQuery(array.filter(d => d["Category"] !== category)),
      querySameCat = keyword + " AND NOT " + this.buildQuery(array.filter(d => d["Category"] === category && d["Keyword"] !== keyword)),
      query = "(" + querySameCat + ") AND " + queryOtherCats;
    return this.limitQuery(query);
  }

  handleDataDrop(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      this.setState({ data: csvParse(event.target.result) });
    }.bind(this);
  }

  handleQueryButtonClick() {
    this.setState({ keywordImpacts: [] });
    const query = this.buildQueryFull(this.state.data);
    this.getQueryResult(query).then(res => {
      this.setState({ queryResult: res });
      this.setKeywordImpacts();
    });
  }

  async getQueryResult(query, count = 1000, key = "7f59af901d2d86f78a1fd60c1bf9426a") {
    let response = await fetch(`/search/${encodeURIComponent(query)}/${key}/${count}`)
      .then(res => res.json());
    console.log(response);
    return response;
  }

  async getAbstract(doi, key = "7f59af901d2d86f78a1fd60c1bf9426a") {
    let response = await fetch(`/abstract/${key}/${doi}`)
      .then(res => res.json());
    console.log(response);
    return response;
  }

  setKeywordImpacts() {
    const data = this.state.data;
    data.forEach((d, i) => {
      const c = d["Category"],
        k = d["Keyword"],
        query = this.buildQueryUniquePapers(data, k, c);
      setTimeout(() => {
        this.getQueryResult(query).then(res => {
          let i = res["search-results"]["opensearch:totalResults"];
          this.setState({ keywordImpacts: this.state.keywordImpacts.concat([{ Category: c, Keyword: k, Impact: i }]) });
        });
      }, 1000 * i)
    });
  }

  handleQueryChange(data) {
    let state = this.initialState();
    state["data"] = data;
    this.setState(state);
  }

  saveQuery = () => {
    const csv = parse(this.state.data),
      blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
      element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = "keywords.csv";
    document.body.appendChild(element);
    element.click();
  }

  async handleAbstractChange(keyword, category) {
    const query = this.buildQueryUniquePapers(this.state.data, keyword, category);
    navigator.clipboard.writeText(query);
    message.success('Query copied to clipboard', 1);
    // const queryResult = await this.getQueryResult(query, 10),
    //   dois = queryResult["search-results"]["entry"].map(d => d["prism:doi"]).filter(d => d !== undefined),
    //   abstracts = await Promise.all(dois.map(async doi => {
    //     const res = await this.getAbstract(doi);
    //     return res["abstracts-retrieval-response"];
    //   }));
    // this.setState({ abstracts: abstracts, activeKeyword: { Keyword: keyword, Category: category } });
  }

  render() {
    let dragUpload,
      query,
      buttons,
      colour = scaleOrdinal(schemeCategory10).domain(this.state.data.map(d => d["Category"]));
    if (this.state.data.length > 0) {
      buttons = <div className="buttons">
        <QueryButton onClick={this.handleQueryButtonClick} />
        <Button onClick={this.saveQuery}>Download keywords as csv</Button>
      </div>;
      query = <Query query={this.buildQueryFull(this.state.data)} />;
    } else {
      dragUpload = <DragUpload onDropDone={this.handleDataDrop} showUploadList={false} />;
    }

    return (
      <>
        <div className="left">
          <h2>Build query</h2>
          {dragUpload}
          <QueryCreate data={this.state.data}
            onQueryChange={this.handleQueryChange}
            colour={colour} />
          {buttons}
          {query}
        </div>
        <div className="right">
          <QueryResult data={this.state.queryResult}
            keywordImpacts={this.state.keywordImpacts}
            colour={colour}
            abstracts={this.state.abstracts}
            activeKeyword={this.state.activeKeyword}
            onAbstractChange={this.handleAbstractChange} />
          <ExcludedPapers total={this.state.queryResult["search-results"]["opensearch:totalResults"]} />
        </div>
      </>
    );
  }
};

export default App;
