import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Row, Col } from 'reactstrap';

class Podsumowanie extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            lista: [],
        };
        this.toggle = this.toggle.bind(this);
        this.accept = this.accept.bind(this);
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
        this.props.accept();
    }

    render() {
        let list = this.props.list;
        return (
            <div>
                <Modal size="lg" isOpen={this.state.open} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Podsumowanie</ModalHeader>
                    <ModalBody>
                        <Table>
                            <tbody>
                                {list.map(item =>
                                    <tr key={item.idBatch}>
                                        <td>{item.full_artykul}</td>
                                        <td>{item.cena}</td>
                                        <td>{item.Wartosc}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <Row className="row justify-content-end">
                            <Col sm="1">
                                <p>Suma:</p>
                            </Col>
                            <Col sm="2">
                                <p>{this.props.suma}</p>
                            </Col>
                        </Row>
                        {this.props.recepta_need &&
                        <Row>
                            Dla tej sprzedaży jest wymagana recepta
                        </Row>
                        }
                        
                    </ModalBody>
                    <ModalFooter>
                        <Row>
                            <Col sm="3">
                                <Button color="success" onClick={this.accept}>Ok</Button>
                            </Col>
                            <Col sm="3">
                            </Col>
                            <Col sm="3">
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                            </Col>
                        </Row>
                    </ModalFooter>
                </Modal>
            </div>
        );

    }
}

export default Podsumowanie;