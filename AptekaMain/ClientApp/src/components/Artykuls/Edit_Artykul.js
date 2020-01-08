import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Row, Col, Container } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import validator from 'validator';

class Edit_Artykul extends Component {
    displayName = Edit_Artykul.name

    constructor(props) {
        super(props);
        this.state = {
            kategorias: [], producents: [], loading: true, err: '', disabled: true, mode: 'create',
            id: '', nazwa: '', kod: '', illoscPodstawowa: 0, illoscProduktow: 0, wymaganaRecepta: false, kategoria: '', producent: ''
        };

        this.refresh = this.refresh.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.validateData = this.validateData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    componentDidMount() {
        const art_id = this.props.match.params.id;
        if (art_id != 0) {
            fetch('api/Artykuls/' + art_id)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        id: data.idArtykul, nazwa: data.nazwa, kod: data.kod+'', illoscProduktow: data.illoscProduktow,
                        illoscPodstawowa: data.illoscPodstawowa, kategoria: data.kategoriaIdKategoria, producent: data.producentIdProducent,
                        wymaganaRecepta: data.wymaganaRecepta, mode: 'edit'
                    });
                });
        }

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
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevState.kod !== this.state.kod || prevState.nazwa !== this.state.nazwa || prevState.illoscPodstawowa !== this.state.illoscPodstawowa ||
            prevState.kategoria !== this.state.kategoria || prevState.producent !== this.state.producent) {
            this.validateData();
        }
    }



    handleCreate() {
        this.validateData();
        if (this.state.err > 0) {
            window.alert('Nie wszystkie pola są prawidłowo wypelnione');
        }
        else {
            fetch("api/Artykuls/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nazwa: this.state.nazwa,
                    kod: this.state.kod,
                    illoscProduktow: this.state.illoscProduktow,
                    illoscPodstawowa: this.state.illoscPodstawowa,
                    kategoriaIdKategoria: this.state.kategoria,
                    producentIdProducent: this.state.producent,
                    wymaganaRecepta: this.state.wymaganaRecepta
                })
            }).then(setTimeout(this.refresh, 300));
        }
    }

    handleUpdate() {
        this.validateData();
        if (this.state.err > 0) {
            window.open('Nie wszystkie pola są prawidłowo wypelnione');
        }
        else {
            fetch("api/Artykuls/" + this.state.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idArtykul: this.state.id,
                    nazwa: this.state.nazwa,
                    kod: this.state.kod,
                    illoscProduktow: this.state.illoscProduktow,
                    illoscPodstawowa: this.state.illoscPodstawowa,
                    kategoriaIdKategoria: this.state.kategoria,
                    producentIdProducent: this.state.producent,
                    wymaganaRecepta: this.state.wymaganaRecepta
                })
            }).then(setTimeout(this.refresh, 300));
        }
    }

    handleDelete() {
        let id = this.state.id;
        if (window.confirm("Czy na pewno chcesz usunąc Artykul" + id) === true)
            fetch('api/Artykuls/' + id, {
                method: 'DELETE'
            }).then(setTimeout(this.refresh, 300));
    }

    handleReturn() {
        setTimeout(this.refresh, 300);
    }



    refresh() {
        this.props.history.push("/artykuls");
    }

    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        switch (name) {
            case 'kategoria':
                this.setState({ kategoria: value });
                break;
            case 'producent':
                this.setState({ producent: value });
                break;
            case 'nazwa':
                this.setState({ nazwa: value })
                break;
            case 'kod':
                this.setState({ kod: value })
                break;
            case 'illosc':
                this.setState({ illoscPodstawowa: value })
                break;
            case 'wymaganaRecepta':
                this.setState({ wymaganaRecepta: event.target.checked })
                break;
            default:
                console.log("Unknown");
                break;
        }
    }

    validateData() {
        this.setState({ err: "", disabled: false });
        if (this.state.nazwa.length < 3)
            this.setState({ err: "Nazwa nie moż być krótrsza od 3 znaków", disabled: true });
        if (!validator.isAlphanumeric(this.state.nazwa))
            this.setState({ err: "nazwa powinna zawierac tylko litery i cyfry", disabled: true });
        if (this.state.kod.length < 3)
            this.setState({ err: "kod nie moż być krótrsza od 3 znaków", disabled: true });
        if (!validator.isDecimal(this.state.kod))
            this.setState({ err: "kod może zawierać tylko cyfry", disabled: true });
        if (this.state.illosc < 0)
            this.setState({ err: "Illosc nie moze byc ujemna", disabled: true });
        if (this.state.kategoria === "")
            this.setState({ err: "Wybierz Kategorije", disabled: true });
        if (this.state.producent === "")
            this.setState({ err: "Wybierz Producenta", disabled: true });

    }


    renderArtykulsForm() {
        return (
            <Container>
                <Col xs="8">
                    <Row>
                        <FormGroup>
                            <Label htmlFor="nazwa">Nazwa</Label>
                            <Input type="text" className="form-control" name="nazwa" value={this.state.nazwa} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label htmlFor="kod">Kod</Label>
                            <Input type="kod" className="form-control" name="kod" value={this.state.kod} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label htmlFor="illosc">Illosc Podstawowa</Label>
                            <Input type="number" className="form-control" name="illosc" value={this.state.illoscPodstawowa} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label htmlFor="kategoria">Kategoria</Label>
                            <select className="form-control" name="kategoria" value={this.state.kategoria} onChange={this.handleInputChange}>
                                <option value="" disabled></option>
                                {this.state.kategorias.map(kat =>
                                    <option key={kat.idKategoria} value={kat.idKategoria} >{kat.nazwa}</option>
                                )}
                            </select>
                        </FormGroup>
                    </Row>
                    <Row>
                        <FormGroup>
                            <Label htmlFor="producent">Producent</Label>
                            <select className="form-control" name="producent" value={this.state.producent} onChange={this.handleInputChange}>
                                <option value="" disabled></option>
                                {this.state.producents.map(prod =>
                                    <option key={prod.idProducent} value={prod.idProducent} >{prod.nazwa}</option>
                                )}
                            </select>
                        </FormGroup>
                    </Row>
                    <Row>
                        <Label htmlFor="wymaganaRecepta">Wymagana Recepta</Label>
                        <Input type="checkbox" name="wymaganaRecepta" value={this.state.wymaganaRecepta} onChange={this.handleInputChange} />
                    </Row>
                    <Row>
                        {this.state.err.length > 0 && <p className="Error">{this.state.err}</p>}
                    </Row>
                    <Row>
                        {this.state.mode === "edit" &&
                            <Col>
                                <Button color="info" type="button" onClick={this.handleUpdate} disabled={this.state.disabled}>Save Artykul</Button>
                            </Col>
                        }
                        {this.state.mode === "edit" &&
                            <Col>
                                <Button color="danger" onClick={this.handleDelete}> Delete Artykul</Button>
                            </Col>
                        }
                        {this.state.mode === "create" &&
                            <Col>
                                <Button color="success" onClick={this.handleCreate} disabled={this.state.disabled}>Create Artykul</Button>
                            </Col>
                        }
                        <Col>
                            <Button color="secondary" type="button" onClick={this.handleReturn}>Return</Button>
                        </Col>
                    </Row>
                </Col>
            </Container>
        );
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderArtykulsForm();

        return (
            <div>
                <h1>Edit Artykul</h1>
                {contents}
            </div>
        );
    }
}


export default connect()(Edit_Artykul);