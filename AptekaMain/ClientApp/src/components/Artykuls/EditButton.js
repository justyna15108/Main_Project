import React, { Component } from "react";

export default class EditButton extends Component {
    constructor(props) {
        super(props);

        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {

        this.props.context.componentParent.handleRedirect(this.props.value);
    }

    render() {
        return (
            <span><button style={{ height: 20, lineHeight: 0.5 }} onClick={this.invokeParentMethod} className="btn btn-info">Edytuj</button></span>
        );
    }
};