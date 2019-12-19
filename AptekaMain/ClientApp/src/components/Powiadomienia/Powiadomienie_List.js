import React, { Component } from 'react';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle
} from 'reactstrap';

export default class Powiadomienie_List extends Component {

    render() {
        let pow_Nodes = this.props.data.map(function (pow, index) {
            let date = new Date(pow.dataGeneracji);
            return <div key={index} className="p-3 my-2 rounded">
                <Card>
                    <CardBody>
                        <CardTitle> Wydzial: {pow.wydzialIdWydzial}</CardTitle>
                        <CardSubtitle>{date.toLocaleDateString()}</CardSubtitle>
                        <CardText>{pow.tresc}</CardText>
                    </CardBody>
                </Card>
            </div>
        });

        return (
            <div id="project-comments" className="commentList">
                <ul>{pow_Nodes}</ul>
            </div>
        );
    }
}