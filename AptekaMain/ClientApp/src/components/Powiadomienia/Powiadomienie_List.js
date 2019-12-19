import React, { Component } from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

export default class Powiadomienie_List extends Component {

    render() {
        let pow_Nodes = this.props.data.map(function (pow, index) {
            let date = new Date(pow.dataGeneracji);
            return <div key={index} className="p-3 my-2 rounded">
                <Toast>
                    <ToastHeader>
                        Wydzial: {pow.wydzialIdWydzial} {date.toLocaleDateString()}
                    </ToastHeader>
                    <ToastBody>
                        {pow.tresc}
                    </ToastBody>
                </Toast>
            </div>
        });

        return (
            <div id="project-comments" className="commentList">
                <ul>{pow_Nodes}</ul>
            </div>
        );
    }
}