import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class ShowArtykul extends Component {
    displayName = ShowArtykul.name

    constructor(props) {
        super(props);
        this.state = {
            kategorias: [], producents: [], loading: true, err: '', disabled: true,
            id: '', nazwa: '', kod: '', illoscPodstawowa: 0, illoscProduktow: 0, wymaganaRecepta: false, kategoria: '', producent: ''
        };
        const art_id = this.props.match.params.id;

        fetch('api/Artykuls/' + art_id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    id: data.idArtykul, nazwa: data.nazwa, kod: data.kod, illoscProduktow: data.illoscProduktow,
                    illoscPodstawowa: data.illoscPodstawowa, kategoria: data.kategoriaIdKategoria, producent: data.producentIdProducent,
                    wymaganaRecepta: data.wymaganaRecepta
                });
            });
        fetch('api/Producents')
            .then(response => response.json())
            .then(data => {
                this.setState({ producents: data });
            });
        fetch('api/Kategorias')
            .then(response => response.json())
            .then(data => {
                this.setState({ kategorias: data, loading: false });
            });



        this.handleReturn = this.handleReturn.bind(this);
        this.findKategoriaName = this.findKategoriaName.bind(this);
        this.findProducentName = this.findProducentName.bind(this);
    }



    handleReturn() {
        this.props.history.push("/artykuls");
    }

    findKategoriaName(id) {
        var kat = this.state.kategorias;
        for (var i in kat) {
            if (id === kat[i].idKategoria)
                return kat[i].nazwa;
        };
        return "Kategoria not Found";
    }
    findProducentName(id) {
        var prod = this.state.producents;
        for (var i in prod) {
            if (id === prod[i].idProducent)
                return prod[i].nazwa;
        };
        return "Producent not Found";
    }

    renderArtykulsForm() {
        return (
            <Form>
                <Row>
                    <p>Nazwa:  {'  '} {this.state.nazwa}</p>
                </Row>
                <Row>
                    <p>Kod:  {'   '} {this.state.kod} </p>
                </Row>
                <Row>
                    <p>Illosc Produktow:   {this.state.illoscProduktow} </p>
                </Row>
                <Row>
                    <p>Illosc Podstawowa:   {this.state.illoscPodstawowa} </p>
                </Row>
                <Row>
                    <p>Kategoria:   {this.findKategoriaName(this.state.kategoria)} </p>
                </Row>
                <Row>
                    <p>Producent:   {this.findProducentName(this.state.producent)} </p>
                </Row>
                <Row>
                    <p>Czy jest Wymagana Recepta:   {this.state.wymaganaRecepta ? "Tak" : "Nie"} </p>
                </Row>
                <Row>
                    <FormGroup>
                        <Button className="btn btn-primary" type="button" onClick={this.handleReturn}>Powrót</Button>
                    </FormGroup>
                </Row>
            </Form>
        );
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArtykulsForm();

        return (
            <div>
                <h1>Artykul {this.state.nazwa}</h1>
                {contents}
            </div>
        );
    }
}


export default connect()(ShowArtykul);