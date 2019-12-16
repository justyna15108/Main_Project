import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Row, Container, Col } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class Edit_User extends Component {
    displayName = Edit_User.name

    constructor(props) {
        super(props);
        this.state = {
            wydzialy: [], loading: true, err: '', disabled: true, mode: 'create',
            id: '', imie: '', nazwisko: '', email: '', haslo: '', wydzial: '', poziom: 1
        };
        const user_id = this.props.match.params.id;
        if (user_id != 0) {
            fetch('api/Pracowniks/' + user_id)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        id: data.idPracownika, imie: data.imie, nazwisko: data.nazwisko, wydzial: data.wydzialAptekiIdWydzialu,
                        email: data.email, poziom: data.poziomDostepu, mode: 'edit'
                    });
                });
        }

        fetch('api/Wydzials')
            .then(response => response.json())
            .then(data => {
                this.setState({ wydzialy: data, loading: false })
            });


        this.refresh = this.refresh.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.validateData = this.validateData.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    handleCreate() {
        fetch("api/Pracowniks/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imie: this.state.imie,
                nazwisko: this.state.nazwisko,
                wydzialAptekiIdWydzialu: this.state.wydzial,
                poziomDostepu: this.state.poziom,
                email: this.state.email,
                haslo: this.state.haslo
            })
        }).then(setTimeout(this.refresh, 300));

    }

    handleUpdate() {
        fetch("api/Pracowniks/" + this.state.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idPracownika: this.state.id,
                imie: this.state.imie,
                nazwisko: this.state.nazwisko,
                wydzialAptekiIdWydzialu: this.state.wydzial,
                poziomDostepu: this.state.poziom,
                email: this.state.email,
                haslo: this.state.haslo
            })
        }).then(setTimeout(this.refresh, 300));
    }

    handleDelete() {
        let id = this.state.id;
        if (window.confirm("Do you want to delete User" + id) === true)
            fetch('api/Pracowniks/' + id, {
                method: 'DELETE'
            }).then(setTimeout(this.refresh, 300));
    }

    handleReturn() {
        setTimeout(this.refresh, 300);
    }



    refresh() {
        this.props.history.push("/users");
    }

    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        switch (name) {
            case 'imie':
                this.setState({ imie: value });
                break;
            case 'nazwisko':
                this.setState({ nazwisko: value });
                break;
            case 'email':
                this.setState({ email: value })
                break;
            case 'haslo':
                this.setState({ haslo: value })
                break;
            case 'wydzial':
                this.setState({ wydzial: value })
                break;
            case 'poziom':
                this.setState({ poziom: value })
                break;
            default:
                console.log("Unknown");
                break;
        }
        this.validateData();
    }

    validateData() {
        this.setState({ err: "", disabled: false });
        if (this.state.imie.length <= 1)
            this.setState({ err: "Imie nie moż być krótrsza od 1 znaków", disabled: true });
        if (this.state.nazwisko.length <= 1)
            this.setState({ err: "Nazwisko nie moż być krótrsze od 1 znaków", disabled: true });
        if (this.state.email < 5)
            this.setState({ err: "email nie moż być krótrszy od 1 znaków", disabled: true });
        if (this.state.wydzial == null)
            this.setState({ err: "Wybierz Wydzial", disabled: true });
        if (this.state.poziom == null)
            this.setState({ err: "Wybierz poziom", disabled: true });

    }


    renderUserForm() {
        return (
            <Container>
                <Form>
                    <Col sm="12">
                        <Row>
                            <FormGroup>
                                <Label htmlFor="imie">Imie</Label>
                                <Input type="text" className="form-control" name="imie" value={this.state.imie} onChange={this.handleInputChange} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Label htmlFor="nazwisko">Nazwisko</Label>
                                <Input type="text" className="form-control" name="nazwisko" value={this.state.nazwisko} onChange={this.handleInputChange} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input type="text" className="form-control" name="email" value={this.state.email} onChange={this.handleInputChange} />
                            </FormGroup>
                        </Row>

                        {this.state.mode === "create" &&
                            <Row>
                                <FormGroup>
                                    <Label htmlFor="haslo">Haslo</Label>
                                    <Input type="password" className="form-control" name="haslo" value={this.state.haslo} onChange={this.handleInputChange} />
                                </FormGroup>
                            </Row>
                        }
                        <Row>
                            <FormGroup>
                                <Label htmlFor="wydzial">Wydzial</Label>
                                <select className="form-control" name="wydzial" value={this.state.wydzial} onChange={this.handleInputChange}>
                                    <option value="" disabled></option>
                                    {this.state.wydzialy.map(kat =>
                                        <option key={kat.idWydzial} value={kat.idWydzial} >{kat.adres}</option>
                                    )}
                                </select>
                            </FormGroup>
                        </Row>
                        <Row>
                            <FormGroup>
                                <Label htmlFor="poziom">Stanowisko</Label>
                                <select className="form-control" name="poziom" value={this.state.poziom} onChange={this.handleInputChange}>
                                    <option value="" disabled></option>
                                    <option key={1} value={1} >Farmaceuta</option>
                                    <option key={2} value={2} >Menadżer</option>
                                    <option key={3} value={3} >Administrator</option>
                                </select>
                            </FormGroup>
                        </Row>
                        <Row>
                            {this.state.err.length > 0 && <p className="Error">{this.state.err}</p>}
                        </Row>
                        <Row>
                            {this.state.mode === "edit" &&
                                    <Col>
                                <Button color="info" onClick={this.handleUpdate} disabled={this.state.disabled}>Save User</Button>
                                    </Col>
                            }
                            {this.state.mode === "edit" &&
                                <Col>
                                <Button color="danger" onClick={this.handleDelete}>Delete User</Button>
                                </Col>
                            }
                            <Col>
                                {this.state.mode === "create" &&
                                    <Button color="success" onClick={this.handleCreate} disabled={this.state.disabled}>Create User</Button>
                                }
                            </Col>
                            <Col>
                                <Button color="secondary" onClick={this.handleReturn}>Return</Button>
                            </Col>
                        </Row>
                    </Col>
                </Form>
            </Container >
        );
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUserForm();

        return (
            <div>
                <h1>Edit User</h1>
                {contents}
            </div>
        );
    }
}


export default connect()(Edit_User);