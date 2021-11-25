import 'antd/dist/antd.css';
import { Button } from 'antd';
import { csvParse } from 'd3-dsv';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import React from 'react';
import './App.css';
import DragUpload from './DragUpload.js';
import QueryCreate from './QueryCreate.jsx';
import QueryButton from './QueryButton.jsx';
import QueryResult from './QueryResult.jsx';
import Query from './Query';
import { CSVLink } from "react-csv";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: [], queryResult: Object.create({}), keywordImpacts: [], abstracts: [], activeKeyword: ""};
    this.handleDataDrop = this.handleDataDrop.bind(this);
    this.handleQueryButtonClick = this.handleQueryButtonClick.bind(this);
    this.getQueryResult = this.getQueryResult.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleAbstractChange = this.handleAbstractChange.bind(this);
  }

  buildQuery = (array) => {
    let limit = ` AND ( LIMIT-TO ( DOCTYPE,"ar" ) OR LIMIT-TO ( DOCTYPE,"cp" ) OR LIMIT-TO ( DOCTYPE,"ch" ) )
      AND ( LIMIT-TO ( LANGUAGE,"English" ) )
      AND  PUBYEAR  <  2021`;
    let cats = new Set(array.map(d => d["Category"]));
    let query = [];
    cats.forEach(c => {
      let group = array.filter(d => d["Category"] === c).map(d => d["Keyword"]).join(" OR ");
      query.push("(" + group + ")");
    });
    return "TITLE-ABS-KEY (" + query.join(" AND ") + ")" + limit;
  }
    
  handleDataDrop(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      this.setState({data: csvParse(event.target.result)});
    }.bind(this);
  }

  handleQueryButtonClick() {
    this.setState({keywordImpacts: []});
    const query = this.buildQuery(this.state.data);
    this.getQueryResult(query).then(res => {
      this.setState({queryResult: res});
      this.setKeywordImpacts();
    });
  }

  async getQueryResult(query, count=1) {
    const httpAccept = encodeURIComponent("httpAccept=application/json"),
          queryString = "&query=" + encodeURIComponent(query),
          key = "&apiKey=7f59af901d2d86f78a1fd60c1bf9426a",
          countString = "&count=" + count;
    let response = await fetch("https://nonprod-api.elsevier.com/content/search/scopus?" + httpAccept + queryString + key + countString);
    let json = await response.json();
    return json;
  }

  async getAbstract(doi) {
    const httpAccept = "httpAccept=application/json",
          key = "&apiKey=7f59af901d2d86f78a1fd60c1bf9426a",
          response = await fetch(`https://nonprod-api.elsevier.com/content/abstract/doi/${doi}?${httpAccept}${key}`),
          json = await response.json();
    return json;
  }

  setKeywordImpacts() {
    let data = this.state.data;
    let total = this.state.queryResult["search-results"]["opensearch:totalResults"];
    data.forEach((d, i) => {
      const c = d["Category"],
            k = d["Keyword"];
      setTimeout(() => {
        let dataShort = data.filter(d => d["Keyword"] !== k),
            query = this.buildQuery(dataShort);
        this.getQueryResult(query).then(res => {
          let i = total - res["search-results"]["opensearch:totalResults"];
          this.setState({ keywordImpacts: this.state.keywordImpacts.concat([{Category: c, Keyword: k, Impact: i}]) });
        });
      }, 1000*i)
    });
  }

  handleQueryChange(data) {
    this.setState({data: data, queryResult: Object.create({}), keywordImpacts: []});
  }

  async handleAbstractChange(keyword, category) {
    const query = this.buildQuery(this.state.data.filter(d => (d["Keyword"] === keyword && d["Category"] === category) || d["Category"] !== category)),
          queryResult = await this.getQueryResult(query, 20),
          dois = queryResult["search-results"]["entry"].map(d => d["prism:doi"]),
          abstracts = await Promise.all(dois.map(async doi => {
            const res = await this.getAbstract(doi);
            return res["abstracts-retrieval-response"];
          }));
          console.log(queryResult);
          console.log(dois);
          console.log(abstracts);
    this.setState({abstracts: abstracts, activeKeyword: {Keyword: keyword, Category: category}});
  }

  render() {
    let dragUpload,
        query,
        buttons,
        colour = scaleOrdinal(schemeCategory10).domain(this.state.data.map(d => d["Category"]));
    if (this.state.data.length > 0) {      
      const dataExport = this.state.data.map(d => {
        return {Category: d["Category"], Keyword: d["Keyword"].replace(/"/g, '"""')};
      });
      buttons = <div className="buttons">
        <QueryButton onClick={this.handleQueryButtonClick} />
        <Button><CSVLink data={dataExport} filename="keywords.csv" enclosingCharacter={undefined}>Download keywords as csv</CSVLink></Button>
      </div>;
      query = <Query query={this.buildQuery(this.state.data)} />;
    } else {
      dragUpload = <DragUpload onDropDone={this.handleDataDrop} showUploadList={false} />;
    }

    return (
      <>
        <div className="left">
          <h2>Build Query</h2>
          {dragUpload}
          <QueryCreate data={this.state.data}
                       onQueryChange={this.handleQueryChange}
                       colour={colour} />
          {buttons}
          {query}
        </div>
        <div className="right">
          <h2>Query Results</h2>
          <QueryResult data={this.state.queryResult}
                       keywordImpacts={this.state.keywordImpacts}
                       colour={colour}
                       abstracts={this.state.abstracts}
                       activeKeyword={this.state.activeKeyword}
                       onAbstractChange={this.handleAbstractChange} />
        </div>
      </>
    );
  }
};

export default App;
