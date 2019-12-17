import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from 'react-datepicker';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Show_Partia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            partia: '', loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            due_date: new Date(),
            context: { componentParent: this },
            IdPartia: '',
            DataWaznosci: '',
            Artykul: '',
            Status: '',
            CenaWSprzedazy: '',
            CenaWZakupu: '',
            Liczba: '',
            LiczbaWSprzedazy: '',
        };

        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.getShortDate = this.getShortDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    async componentDidMount() {
        const partia_id = this.props.match.params.id;

        await fetch('api/Partias?$expand=artykulIdArtukuluNavigation,batch&$filter=IdPartia eq ' + partia_id)
            .then(response => response.json())
            .then(data => data[0])
            .then(data => {
                this.setState({
                    partia: data,
                    IdPartia: data.IdPartia,
                    Artykul: data.ArtykulIdArtukuluNavigation.Nazwa,
                    Status: data.Status,
                    DataWaznosci: new Date(data.DataWaznosci),
                    CenaWZakupu: data.CenaWZakupu,
                    CenaWSprzedazy: data.CenaWSprzedazy,
                    Liczba: data.Liczba,
                    LiczbaWSprzedazy: data.LiczbaWSprzedazy,
                    Artykul: data.ArtykulIdArtukuluNavigation.Nazwa,

                })
            });
        this.getTableData();
    }

    refresh() {
        this.props.history.push("/zamowienia");
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    }

    getShortDate(json_date) {
        let full_date = new Date(json_date);
        return full_date.toLocaleDateString();
    }

    setRowData() {
        var part = this.state.partia.Batch;
        var part_rowData = [];
        if (part) {
            for (var i = 0; i < part.length; i++) {
                var par = part[i];
                var row = {
                    IdBatch: par.IdBatch,
                    Kod: par.Kod,
                    Liczba: par.Liczba,
                    idWydzial: par.WydzialAptekiIdWydzialu,
                }

                part_rowData.push(row);
            }
        }
        return part_rowData;
    }

    handleUpdate() {
        fetch("api/Partias/" + this.state.partia.IdPartia, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idPartia: this.state.partia.IdPartia,
                DataWaznosci: this.state.due_date,
                ZamowienieIdZamowienia: this.state.partia.ZamowienieIdZamowienia,
                Status: this.state.Status,
                sumaZamowienia: this.state.zamowienie.sumaZamowienia,
                CenaWSprzedazy: this.state.CenaWSprzedazy,
                CenaWZakupu: this.state.CenaWZakupu,
                Liczba: this.state.Liczba,
                LiczbaWSprzedazy: this.state.LiczbaWSprzedazy,
            })
        }).then(resp => console.log(resp.status)).then(setTimeout(this.refresh, 300));
    }

    setColumns() {
        let cols = [
            {
                headerName: "IdBatch", field: "IdBatch", hide: true
            },
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: false, editable: false,
            },
            {
                headerName: "Widział", field: "idWydzial", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Liczba w Sprzedaży", field: "Liczba", sortable: true, filter: true, editable: false,
            }
        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
    }

    handleRedirect(cell) {

        //alert(cell);
        this.props.history.push('/artykul_edit/' + cell);
    }

    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedRow = selectedRows.pop();
        this.props.history.push('/show_zamowienie/' + selectedRow.idArtykul);
    }

    handleDueDateChange = date => {
        this.setState({
            due_date: date
        });
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
    }

    handleReturn() {
        this.props.history.push('/show_zamowienie/' + this.state.partia.ZamowienieIdZamowienia);
    }


    render() {
        console.log(this.state);
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="artykul">Artykuł</Label>
                            <p className="form-control" name="artykul"> {this.state.Artykul} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="Status">Status</Label>
                            <p className="form-control" name="Status"> {this.state.partia.Status} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <Label>Termin Ważnosci</Label>
                        <DatePicker
                            selected={this.state.due_date}
                            onChange={this.handleDueDateChange}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="CenaWZakupu">Cena zakupu</Label>
                            <p className="form-control" name="CenaWZakupu"> {this.state.CenaWZakupu} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="Liczba">Illosc zakupu</Label>
                            <p className="form-control" name="Liczba"> {this.state.Liczba} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="CenaWSprzedazy" >Cena w Sprzedazy</Label>
                            <p className="form-control" name="Liczba"> {this.state.CenaWSprzedazy} </p>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="LiczbaWSprzedazy">Illosc w Sprzedazy</Label>
                            <p className="form-control" name="LiczbaWSprzedazy"> {this.state.LiczbaWSprzedazy} </p>
                        </FormGroup>
                    </Col>
                </Row>
                {this.state.Status == "przyjęta" &&
                    <Row>
                        <div style={{ height: '500px', width: "100%" }} className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={this.state.columnDefs}
                                rowData={this.state.rowData}
                                context={this.state.context}
                                frameworkComponents={this.state.frameworkComponents}
                                onGridReady={this.onGridReady}
                            //  rowSelection={this.state.rowSelection}
                            //  onSelectionChanged={this.onSelectionChanged.bind(this)}
                            />
                        </div>
                    </Row>
                }
                <Row>
                    <Button color="secondary" onClick={this.handleReturn.bind(this)}>Return</Button>
                </Row>
            </Container>
        );
    }
}


export default connect()(Show_Partia);