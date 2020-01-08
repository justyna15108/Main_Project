import React from 'react';
import DatePicker from 'react-datepicker';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Row, Col, Input, FormGroup, Label } from 'reactstrap';

class Podsumowanie extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            procentRabatu: 1,
            czyJestAktywny: true,
            dataPoczatku: new Date(),
            dataZakonczenia: new Date(new Date().setDate(new Date().getDate() + 1)),
        };
        this.toggle = this.toggle.bind(this);
        this.accept = this.accept.bind(this);
        this.handleFinishDate = this.handleFinishDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }


    componentDidMount() {
        //this.toggleOn();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isopen !== prevProps.isopen) {
            this.setState({ open: this.props.isopen });
        }
    }

    toggle() {
        this.props.hide();
    }

    accept() {
        this.props.accept(this.state);
    }

    hide() {
        this.setState({ open: false });
    }

    handleFinishDate = date => {
        if (date < this.state.dataPoczatku) {
            window.alert("Zakonczenie rabatu nie może być pózniej niż początek");
        }
        else {
            this.setState({
                dataZakonczenia: date
            });
        }
    }

    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        if (value < 2) {
            value = 1;
        }
        if (value > 99) {
            value = 99;
        }
        this.setState({ procentRabatu: value });
    }

    render() {
        let list = this.props.list;
        return (
            <div>
                <Modal size="lg" isOpen={this.state.open} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Nowy Rabat</ModalHeader>
                    <ModalBody>
                        <Row>
                            <FormGroup>
                                <Label>Data Początku</Label>
                                <Input type="number" className="form-control" name="oplacone" value={this.state.procentRabatu} onChange={this.handleInputChange} />
                            </FormGroup>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label>Data Początku</Label>
                                    <DatePicker
                                        selected={this.state.dataPoczatku}
                                    />
                                </FormGroup>
                            </Col>
                            <Col>
                                <FormGroup>
                                    <Label>Data Zakonczenia</Label>
                                    <DatePicker
                                        selected={this.state.dataZakonczenia}
                                        onChange={this.handleFinishDate}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Col sm="3">
                                <Button color="success" onClick={this.accept}>Dodaj Rabat</Button>
                            </Col>
                            <Col sm="3">
                            </Col>
                            <Col sm="3">
                                <Button color="secondary" onClick={this.toggle}>Powrót</Button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </div>
        );

    }
}

export default Podsumowanie;