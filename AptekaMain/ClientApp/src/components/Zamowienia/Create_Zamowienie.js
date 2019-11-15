import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'react-datepicker/dist/react-datepicker.css';

class Create_Zamowienia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            artykuls: [], hurtowni: [], loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            rowSelection: "multiple",
            init_data: [],
            searchList: [],
            selectedOption: '',
            getRowNodeId: function (data) {
                return data.idArtykul;
            },
            order_date: new Date(),
            payment_date: new Date(),
            receive_date: new Date(),
            hurtownia_id: '',
            disabled: true,
            wartosc: '',
            oplacone: 0,
        };

        this.findHurtowniaName = this.findHurtowniaName.bind(this);
        this.findArtykul = this.findArtykul.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleWartoscUpdate = this.handleWartoscUpdate.bind(this);
        this.validateData = this.validateData.bind(this);
        this.get_days_for_payment = this.get_days_for_payment.bind(this);
        this.get_days_for_delivery = this.get_days_for_delivery.bind(this);
    }

    async componentDidMount() {
        if (this.props.location.state) {
            this.setState({ init_data: this.props.location.state.init_data });
        }
        await fetch('api/Artykuls')
            .then(response => response.json())
            .then(data => {
                this.setState({ artykuls: data });
            });
        await fetch('api/Hurtownias')
            .then(response => response.json())
            .then(data => {
                this.setState({ hurtowni: data })
            });
        this.getTableData();

        var searchList = this.state.artykuls.map(
            art => {
                return {
                    value: art,
                    label: art.nazwa,
                }
            }
        );
        this.setState({ searchList });
    }

    refresh() {
        this.props.history.push("/zamowienia/");
    }

    findHurtowniaName(id) {
        var hurt = this.state.hurtowni;
        for (var i in hurt) {
            if (id === hurt[i].idHurtownia)
                return hurt[i].nazwa;
        };
        return "Hurtownia not Found";
    }

    findArtykul(id) {
        var art = this.state.artykuls;
        for (var i in art) {
            if (id === art[i].idArtykul)
                return art[i];
        }
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var artykuls = this.state.artykuls;
        var art_rowData = [];
        let data = this.state.init_data
        if (data) {
            for (var i = 0; i < data.length; i++) {
                var d = data[i];
                var artykul = this.findArtykul(d.artykulId);
                var row = {
                    idArtykul: artykul.idArtykul,
                    nazwa: artykul.nazwa,
                    kod: artykul.kod,
                    illoscProduktow: artykul.illoscProduktow,
                    illoscPodstawowa: artykul.illoscPodstawowa,
                    cenaWZakupu: 0,
                    liczba: d.illosc,
                }
                art_rowData.push(row);
            }
        }
        return art_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "idArtykul", field: "idArtykul", hide: true
            },
            {
                headerName: "Nazwa", field: "nazwa", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Illość W Sprzedaży", field: "illoscProduktow", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Illość Podstawowa", field: "illoscPodstawowa", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Cena zakupu", field: "cenaWZakupu", sortable: true, editable: true,
            },
            {
                headerName: "Liczba w zamowieniu", field: "liczba", sortable: true, editable: true,
            },
            {
                headerName: "Suma", field: "suma",
                valueGetter: function (params) {
                    let c = params.data.cenaWZakupu;
                    let i = params.data.liczba;
                    let r = c * i;
                    r = r.toFixed(2);
                    return r;
                },
                editable: false,
                sortable: true
            },
        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
    }

    handleCreate() {
        this.handleWartoscUpdate();
        var req = JSON.stringify({
            dataZamowienia: this.state.order_date,
            dataOplaty: this.state.payment_date,
            dataDostawy: this.state.receive_date,
            sumaZamowienia: this.state.wartosc,
            hurtowniaIdHurtowni: this.state.hurtownia_id,
            oplacono: this.state.oplacone == 1 ? false : true,
            status: "zlozone",
        });
        console.log(req);
        /*
        body: (...)
        bodyUsed: false
        headers: Headers
        ok: true
        redirected: false
        status: 201
        statusText: "Created"
        type: "basic"
        url: "http://localhost:55810/api/Zamowienies"
        */
        fetch("/api/Zamowienies", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: req
        }).then(response => response.json()).then(data => {
            console.log(data);
            this.gridApi.forEachNode(node => {
                var req_partia = JSON.stringify({
                    dataWaznosci: new Date(),
                    artykulIdArtukulu: node.data.idArtykul,
                    zamowienieIdZamowienia: data.idZamowienia,
                    cenaWSprzedazy: 0,
                    cenaWZakupu: node.data.cenaWZakupu,
                    liczba: node.data.liczba,
                    liczbaWSprzedazy: node.data.liczba,
                    status: "Oczekiwane",
                });
                fetch("/api/Partias", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: req_partia
                }).then(response => response.json()).then(data => console.log(data));
            });
        }).then(setTimeout(this.refresh, 300));
    }

    onSelectionChanged() {

    }

    handleChange = selectedOption => {
        this.setState({ selectedOption })
    }

    handleAdd() {
        if (this.state.selectedOption) {
            var s = this.state.selectedOption.value;
            var row = this.gridApi.getRowNode(s.idArtykul);
            if (row) {
                window.alert("Ten Artykuł już został dodany");
            }
            else {
                var art_rowData = [];
                var row = {
                    idArtykul: s.idArtykul,
                    nazwa: s.nazwa,
                    kod: s.kod,
                    illoscProduktow: s.illoscProduktow,
                    illoscPodstawowa: s.illoscPodstawowa,
                    cenaWZakupu: 0,
                    liczba: 0,
                }
                art_rowData.push(row);
                this.gridApi.updateRowData({ add: art_rowData })
            }
        }
    }

    handleDelete() {
        var d_rows = this.gridApi.getSelectedRows();
        this.gridApi.updateRowData({ remove: d_rows });
    }

    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        switch (name) {
            case 'hurtownia':
                this.setState({ hurtownia_id: value });
                break;
            case 'oplacone':
                this.setState({ oplacone: value });
                break;
            default:
                console.log("Unknown");
                break;
        }
        this.validateData();
    }

    validateData() {
        this.setState({ err: "", disabled: false });
        if (this.state.hurtownia_id == null)
            this.setState({ err: "Wybierz Hutrownie", disabled: true });

    }


    get_days_for_payment(id) {
        var hur = this.state.hurtowni;
        for (var i in hur) {
            if (id == hur[i].idHurtownia)
                return hur[i].dniNaOplate;
        }
        return 1;
    }

    get_days_for_delivery(id) {
        var hur = this.state.hurtowni;
        for (var i in hur) {
            if (id == hur[i].idHurtownia)
                return hur[i].dniNaDostawe;
        }
        console.log("Not Found delivery days");
        return 1;
    }

    handleOrderDateChange = date => {
        this.setState({
            order_date: date
        });
        if (this.state.hurtownia_id) {
            var p_date = new Date();
            p_date.setDate(date.getDate() + this.get_days_for_payment(this.state.hurtownia_id));
            var d_date = new Date();
            d_date.setDate(date.getDate() + this.get_days_for_delivery(this.state.hurtownia_id));
            this.setState({
                payment_date: p_date, receive_date: d_date
            });
        }
    }

    handlePaymentDateChange = date => {
        this.setState({
            payment_date: date
        });
    }

    handleReceiveDateChange = date => {
        this.setState({
            receive_date: date
        });
    }

    handleWartoscUpdate() {
        let sum = 0;
        this.gridApi.forEachNode(node => {
            let c = node.data.cenaWZakupu;
            let i = node.data.liczba;
            let r = c * i;
            sum += r;
        });
        console.log(sum);
        this.setState({ wartosc: sum });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="hurtownia">Hurtownia</Label>
                                <select className="form-control" name="hurtownia" value={this.state.hurtownia_id} onChange={this.handleInputChange}>
                                    <option value="" disabled></option>
                                    {this.state.hurtowni.map(hurt =>
                                        <option key={hurt.idHurtownia} value={hurt.idHurtownia}>{hurt.nazwa}</option>
                                    )}
                                </select>
                            </FormGroup>
                        </Form>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Data zamowienia</Label>
                            <DatePicker
                                selected={this.state.order_date}
                                onChange={this.handleOrderDateChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Data Opłaty</Label>
                            <DatePicker
                                selected={this.state.payment_date}
                                onChange={this.handlePaymentDateChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label>Data dotawy</Label>
                            <DatePicker
                                selected={this.state.receive_date}
                                onChange={this.handleReceiveDateChange}
                            />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="wartosc" >Lączna Wartość</Label>
                            <p className="form-control" name="wartosc">{this.state.wartosc} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="oplacone" >Opłacone</Label>
                            <Input type="checkbox" className="form-control" name="oplacone" value={this.state.oplacone} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div>
                            <Select
                                value={this.state.selectedOption}
                                options={this.state.searchList}
                                onChange={this.handleChange}
                            />
                        </div>
                    </Col>
                    <Col>
                        <Button className="btn btn-primary" type="button" onClick={this.handleAdd}>Dodaj</Button>
                    </Col>
                    <Col>
                        <Button className="btn btn-primary" type="button" onClick={this.handleDelete}>Delete</Button>
                    </Col>
                    <Col>
                        <Button className="btn btn-primary" type="button" onClick={this.handleWartoscUpdate}>Wylicz lączną wartość</Button>
                    </Col>
                </Row>
                <Row>
                    <div style={{
                        height: "600px",
                        width: "100%"
                    }} className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            context={this.state.context}
                            frameworkComponents={this.state.frameworkComponents}
                            onGridReady={this.onGridReady}
                            rowSelection={this.state.rowSelection}
                            onSelectionChanged={this.onSelectionChanged.bind(this)}
                            getRowNodeId={this.state.getRowNodeId}
                        />
                    </div>
                </Row>
                <Row>
                    <FormGroup>
                        <Button className="btn btn-primary" type="button" onClick={this.handleCreate}>Zlóz zamowienie</Button>
                    </FormGroup>
                </Row>
            </Container>
        );
    }
}


export default connect()(Create_Zamowienia);