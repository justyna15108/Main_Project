import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from 'react-datepicker';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Show_Zamowienie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            zamowienie: '', hurtowni: [], partii: [], loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            rowSelection: "single",
            order_date: '',
            payment_date: '',
            receive_date: '',
            hurtownia: '',
            status: "zlozone",
            oplacone: 1,
        };

        this.findHurtowniaName = this.findHurtowniaName.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.getShortDate = this.getShortDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    async componentDidMount() {
        const zamowienie_id = this.props.match.params.id;

        await fetch('api/Hurtownias')
            .then(response => response.json())
            .then(data => {
                this.setState({ hurtowni: data })
            });
        await fetch('api/Partias?$expand=artykulIdArtukuluNavigation&$filter=zamowienieIdZamowienia eq ' + zamowienie_id)
            .then(response => response.json())
            .then(data => {
                this.setState({ partii: data })
            });
        await fetch('api/Zamowienies/' + zamowienie_id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    zamowienie: data,
                    order_date: new Date(data.dataZamowienia),
                    payment_date: new Date(data.dataOplaty),
                    receive_date: new Date(data.dataDostawy),
                    wartosc: data.sumaZamowienia,
                    oplacone: data.oplacono,
                    hurtownia: this.findHurtowniaName(data.hurtowniaIdHurtowni),
                    status: data.status,
                    loading_data: false

                });
            });
        this.getTableData();
    }

    refresh() {
        this.props.history.push("/zamowienia");
    }

    findHurtowniaName(id) {
        let hurt = this.state.hurtowni;
        for (var i in hurt) {
            if (id === hurt[i].idHurtownia)
                return hurt[i].nazwa;
        };
        return "Hurtownia not Found";
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    getShortDate(json_date) {
        let full_date = new Date(json_date);
        return full_date.toLocaleDateString();
    }

    setRowData() {
        var part = this.state.partii;
        var part_rowData = [];
        for (var i = 0; i < part.length; i++) {
            var par = part[i];
            var row = {
                IdPartia: par.IdPartia,
                Artykul: par.ArtykulIdArtukuluNavigation.Nazwa,
                Status: par.Status,
                DataWaznosci: this.getShortDate(par.DataWaznosci),
                CenaWZakupu: this.getShortDate(par.dataDostawy),
                CenaWSprzedazy: par.CenaWSprzedazy,
                CenaWZakupu: par.CenaWZakupu,
                Liczba: par.Liczba
            }

            part_rowData.push(row);
        }
        return part_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "IdPartia", field: "IdPartia", hide: true
            },
            {
                headerName: "Artykul", field: "Artykul", sortable: true, filter: false, editable: false,
            },
            {
                headerName: "Status", field: "Status", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "DataWaznosci", field: "DataWaznosci", sortable: true, filter: true, editable: false
            },
            {
                headerName: "Cena Zakupu", field: "CenaWZakupu", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Cena Sprzedazy", field: "CenaWSprzedazy", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Liczba", field: "Liczba", sortable: true, filter: true, editable: false,
            },

        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
    }

    handleRedirect(cell) {
        //zlozone
        //alert(cell);
        this.props.history.push('/artykul_edit/' + cell);
    }

    handleUpdate() {
        fetch("api/Zamowienies/" + this.state.zamowienie.idZamowienia, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idZamowienia: this.state.zamowienie.idZamowienia,
                dataZamowienia: this.state.order_date,
                dataOplaty: this.state.payment_date,
                dataDostawy: this.state.receive_date,
                sumaZamowienia: this.state.zamowienie.sumaZamowienia,
                hurtowniaIdHurtowni: this.state.zamowienie.hurtowniaIdHurtowni,
                oplacono: this.state.oplacone,
                status: this.state.zamowienie.status
            })
        }).then(resp => console.log(resp.status)).then(setTimeout(this.refresh, 300));
    }

    handleCancel() {
        fetch("api/Zamowienies/" + this.state.zamowienie.idZamowienia, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idZamowienia: this.state.zamowienie.idZamowienia,
                dataZamowienia: this.state.order_date,
                dataOplaty: this.state.payment_date,
                dataDostawy: this.state.receive_date,
                sumaZamowienia: this.state.zamowienie.sumaZamowienia,
                hurtowniaIdHurtowni: this.state.zamowienie.hurtowniaIdHurtowni,
                oplacono: this.state.oplacone,
                status: "odwołano"
            })
        }).then(resp => console.log(resp.status)).then(setTimeout(this.refresh, 300));
    }


    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedRow = selectedRows.pop();
        this.props.history.push('/show_partia/' + selectedRow.IdPartia);
    }

    handleInputChange(event) {
        this.setState({ oplacone: event.target.checked });
    }

    handleOrderDateChange = date => {
        this.setState({
            order_date: date
        });
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

    handleAccept() {

        fetch("api/Zamowienies/" + this.state.zamowienie.idZamowienia, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idZamowienia: this.state.zamowienie.idZamowienia,
                dataZamowienia: this.state.order_date,
                dataOplaty: this.state.payment_date,
                dataDostawy: this.state.receive_date,
                sumaZamowienia: this.state.zamowienie.sumaZamowienia,
                hurtowniaIdHurtowni: this.state.zamowienie.hurtowniaIdHurtowni,
                oplacono: this.state.oplacone,
                status: "W sprzedaży"
            })
        }).then(resp => console.log(resp.status)).then(
        this.props.history.push({
            pathname: '/accept_partia',
            state: { partii: this.state.partii, length: this.state.partii.length - 1, current_location: 0 }
        })
        );
    }

    render() {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="Status">Status Zamowienia</Label>
                            <p className="form-control" name="Status"> {this.state.status} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <Form>
                            <FormGroup>
                                <Label htmlFor="hurtownia">Hurtownia</Label>
                                <p className="form-control" name="hurtownia"> {this.state.hurtownia} </p>
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
                            <p className="form-control" name="wartosc"> {this.state.wartosc} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="oplacone" >Opłacone</Label>
                            <Input type="checkbox" className="form-control" name="oplacone" checked={this.state.oplacone} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <div style={{ height: '500px', width: "100%" }} className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            context={this.state.context}
                            frameworkComponents={this.state.frameworkComponents}
                            onGridReady={this.onGridReady}
                            rowSelection={this.state.rowSelection}
                            onSelectionChanged={this.onSelectionChanged.bind(this)}
                        />
                    </div>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Button color="info" onClick={this.handleUpdate}>Zapisz zmiany</Button>
                        </FormGroup>
                    </Col>
                    {this.state.status == "zlozone" && <div>
                        <Col>
                            <FormGroup>
                                <Button color="danger" onClick={this.handleCancel}>Odrzyć zamowienie</Button>
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Button color="success" onClick={this.handleAccept}>Przjmij zamowienie</Button>
                            </FormGroup>
                        </Col>
                    </div>
                    }
                </Row>
            </Container>
        );
    }
}


export default connect()(Show_Zamowienie);