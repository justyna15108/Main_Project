import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { Card, CardBody, CardTitle, CardText, Row, Col, Button, Label, FormGroup } from 'reactstrap';
import DodajRabat from './DodajRabat';


class Rabats extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            rabats: []
        };
        this.getShortDate = this.getShortDate.bind(this);
        this.handleCreate = this.handleCreate.bind(this)
        this.hide = this.hide.bind(this);
        this.togglePopUp = this.togglePopUp.bind(this);
        this.refresh = this.refresh.bind(this);

    }

    async componentDidMount() {
        await fetch('api/Rabats?$filter=idRabat ne 1')
            .then(response => response.json())
            .then(data => {
                this.setState({ rabats: data });
            });
    }

    getShortDate(json_date) {

        let full_date = new Date(json_date);
        return full_date.toLocaleDateString();
    }

    handleCreate(obj) {
        var req = JSON.stringify({
            procentRabatu: obj.procentRabatu,
            czyJestAktywny: obj.czyJestAktywny ===true? '1' : '0',
            dataPoczatku: obj.dataPoczatku,
            dataZakonczenia: obj.dataZakonczenia
        });
        console.log("Create");
        console.log(req);
        fetch("/api/Rabats", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: req
        }).then(setTimeout(this.refresh, 300));
    }
    togglePopUp() {
            this.setState({ open: true });
    }

    hide() {
        this.setState({ open: false });
    }

    refresh() {
        this.hide();
        this.props.history.push("/");
        this.props.history.push("/rabats");
    }

    render() {
        return (
            <div>
                <Row xs="2" >
                    <h5>Rabaty</h5>
                </Row>
                {this.state.rabats.map(rabat =>
                    <Row md='3' >
                        <Col sm='3'>
                            <Card color={rabat.czyJestAktywny == true ? 'secondary' : 'warning'} >
                                <CardBody>
                                    <p>Rabat: {rabat.procentRabatu}</p>
                                    <p>Data początku {this.getShortDate(rabat.dataPoczatku)} </p>
                                    <p>Data zakonczenia {this.getShortDate(rabat.dataZakonczenia)} </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )}
                <Row>
                    <Button color='success' onClick={this.togglePopUp}>Dodaj Rabat</Button>
                </Row>
                <DodajRabat isopen={this.state.open} hide={this.hide} accept={this.handleCreate} />
            </div>
        );
    }
}


export default connect()(Rabats);