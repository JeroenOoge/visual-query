import React from "react";

class ExcludedPapers extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const seed = ["XplainableClusterExplorer: A novel approach for interactive feature selection for clustering"];
        return (
            <div>
                <span className="label">Warning: this query excludes the following seed papers</span>
                <ul>{excluded.map(e => <li>e</li>)}</ul>
            </div>
        );
    }
}

export default ExcludedPapers;