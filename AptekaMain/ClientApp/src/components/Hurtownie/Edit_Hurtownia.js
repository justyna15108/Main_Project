import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';

class Edit_Hurtownia extends Component {
    displayName = Edit_Hurtownia.name

    constructor(props) {
        super(props);
        this.state = {
            wydzialy: [], loading: true, err: '', disabled: true, mode: 'create',
            id: ''
            //fill the rest
        };
        const hurt_id = this.props.match.params.id;
        if (user_id != 0) {
            fetch('api/Hurtownias/' + hurt_id)
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        id: data.idHurtownia 
                        //fill the rest
                    });
                });
        }
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
                "": ""
                //...
            })
        }).then(setTimeout(this.refresh, 300));
    }
        /*
    "nazwa": "alba",
    "dniNaOplate": 3,
    "dniNaDostawe": 3,
    //this what you sould send for create */

    handleUpdate() {
        fetch("api/Pracowniks/" + this.state.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idHurtownia: this.state.id,
                //...
            })
        }).then(setTimeout(this.refresh, 300));
    }
    /*    "idHurtownia": 1,
     *    "nazwa": "alba",
    "dniNaOplate": 3,
    "dniNaDostawe": 3,
    //this what you sould send for put(update) */


    handleDelete() {
        let id = this.state.id;
        if (window.confirm("Do you want to delete Hurtownia" + id) === true)
            fetch('api/Hurtownias/' + id, {
                method: 'DELETE'
            }).then(setTimeout(this.refresh, 300));
    }

    handleReturn() {
        setTimeout(this.refresh, 300);
    }



    refresh() {
        this.props.history.push("/hurtownia");
    }

    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        switch (name) {
            case 'example':
                this.setState({ example: value });
                break;
            default:
                console.log("Unknown");
                break;
        }
        this.validateData();
    }

    validateData() {
        this.setState({ err: "", disabled: false });
        if (this.state.imie.example <= 1)
            this.setState({ err: "etc", disabled: true });

    }


    renderHurtowniaForm() {
        return (
            <Form>
                <FormGroup>
                    <Label htmlFor="example">example</Label>
                    <Input type="text" className="form-control" name="example" value={this.state.example} onChange={this.handleInputChange} />
                </FormGroup>

                {this.state.err.length > 0 && <p className="Error">{this.state.err}</p>}
                <FormGroup>
                    {this.state.mode === "edit" &&

                        <div>
                            <Button className="btn btn-primary" type="button" onClick={this.handleUpdate} disabled={this.state.disabled}>Save User</Button>
                            <Button className="btn btn-primary" type="button" onClick={this.handleDelete}>Delete User</Button>
                        </div>
                    }
                    {this.state.mode === "create" &&
                        <Button className="btn btn-primary" type="button" onClick={this.handleCreate} disabled={this.state.disabled}>Create User</Button>
                    }
                    <Button className="btn btn-primary" type="button" onClick={this.handleReturn}>Return</Button>
                </FormGroup>
            </Form>
        );
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderHurtowniaForm();

        return (
            <div>
                <h1>Edit Artykul</h1>
                {contents}
            </div>
        );
    }
}


export default connect()(Edit_Hurtownia);