import React from "react";
import './Abstract.css';
import parse from 'html-react-parser';

class Abstract extends React.Component {
    render() {
        try {
            const data = this.props.data,
                title = data["coredata"]["dc:title"],
                keyword = this.props.keyword["Keyword"].replace(/"/g, ""),
                regex = new RegExp(keyword, "i");

            let abstract;
            try {
                abstract = data["coredata"]["dc:description"].replace(regex, `<span className="highlight">${keyword}</span>`);
            } catch {
                abstract = "Abstract unavailable."
            }

            let keywords;
            if (data["authkeywords"]) {
                const keywordString = data["authkeywords"]["author-keyword"].map(k => k["$"]).join("; ")
                                                                            .replace(regex, `<span className="highlight">${keyword}</span>`);
                keywords = <p className="keywords"><span>Keywords: </span>{parse(keywordString)}</p>;
            }

            return (
                <div className="abstract" key={title.replace(" ", "")}>
                    <p className="label">{title}</p>
                    <p>{parse(abstract)}</p>
                    {keywords}
                </div>
            );
        } catch {
            return (
                <p>Paper unavailable</p>
            );
        }
    }
}

export default Abstract;