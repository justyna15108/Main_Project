import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Row, Col } from 'reactstrap';
import { Document } from 'react-pdf'
class Scan_Preview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            url: ''
        };
        this.toggle = this.toggle.bind(this);
    }


    componentDidMount() {
        //this.toggleOn();
    }

    componentDidUpdate(prevProps) {
        if (this.props.isopen !== prevProps.isopen) {
            this.setState({ open: this.props.isopen, url: this.props.url });
        }
    }

    toggle() {
        this.props.hide();
    }

    render() {
        let list = this.props.list;
        return (
            <div>
                <Modal size="lg" isOpen={this.state.open} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>Podsumowanie</ModalHeader>
                    <ModalBody>
                        <img src={this.props.url} height="400" width="500"/>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </Modal>
            </div>
        );

    }
}

export default Scan_Preview;