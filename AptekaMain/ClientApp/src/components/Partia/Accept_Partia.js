import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import DatePicker from 'react-datepicker';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Accept_Partia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wydzialy: [],
            artykuls: [],
            partii: [],
            partia: '', loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            due_date: new Date(),
            context: { componentParent: this },
            IdPartia: '',
            DataWaznosci: new Date(),
            Artykul: '',
            Status: '',
            CenaWSprzedazy: '',
            CenaWZakupu: '',
            Liczba: 0,
            LiczbaWSprzedazy: '',
            current_location: 0,
            length: 0,
            suma: 0,
        };

        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.getShortDate = this.getShortDate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendToNext = this.sendToNext.bind(this);
    }

    async componentDidMount() {
        console.log(this.props.location);

        let partii = this.props.location.state.partii;
        let current_location = this.props.location.state.current_location;
        let length = this.props.location.state.length;
        let partia = partii[current_location];
        this.setState({
            partii: partii,
            current_location: current_location,
            length: length,
            partia: partia,
            idPartia: partia.IdPartia,
            DataWaznosci: partia.DataWaznosci,
            ZamowienieIdZamowienia: partia.ZamowienieIdZamowienia,
            Status: partia.Status,
            CenaWSprzedazy: partia.CenaWSprzedazy,
            CenaWZakupu: partia.CenaWZakupu,
            Liczba: partia.Liczba,
            LiczbaWSprzedazy: partia.LiczbaWSprzedazy,
            suma: partia.Liczba,
            Artykul: partia.ArtykulIdArtukuluNavigation.Nazwa,
        });
        await fetch('api/Artykuls?$select=idArtykul, nazwa, illoscPodstawowa')
            .then(response => response.json())
            .then(data => {
                this.setState({ artykuls: data });
            });
        await fetch('/api/Wydzials')
            .then(response => response.json())
            .then(data => {
                this.setState({ wydzialy: data });
            });
        this.getTableData();
    }

    findArtykulName(id) {
        var arts = this.state.artykuls;
        for (var i in arts) {
            if (id === arts[i].IdArtykul)
                return arts[i].Nazwa;
        };
        return "Artykul not Found";
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
        var part_rowData = [];
        var wydz = this.state.wydzialy;

        for (var i = 0; i < wydz.length; i++) {
            var wyd = wydz[i];
            var row = {
                Kod: ""+this.state.idPartia+"-"+i,
                Liczba: this.state.Liczba / wydz.length,
                idWydzial: wyd.idWydzial,
            }
            part_rowData.push(row);
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
                artykulIdArtukulu: this.state.partia.ArtykulIdArtukulu,
                Status: "przyjęta",
                CenaWSprzedazy: this.state.CenaWSprzedazy,
                CenaWZakupu: this.state.CenaWZakupu,
                Liczba: this.state.Liczba,
                LiczbaWSprzedazy: this.state.LiczbaWSprzedazy,
            })
        }).then(data => {
            console.log(data);
            this.gridApi.forEachNode(node => {
                var req_partia = JSON.stringify({
                    "kod": node.data.Kod,
                    "liczba": node.data.Liczba,
                    "wydzialAptekiIdWydzialu": node.data.idWydzial,
                    "idPartia": this.state.partia.IdPartia,
                });
                console.log(req_partia);
                fetch("/api/Batches", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: req_partia
                }).then(response => response.json()).then(data => console.log(data));
            })
        }).then(
            setTimeout(this.state.length === this.state.current_location ? this.refresh : this.sendToNext, 300));
    }


    sendToNext() {
        this.props.history.push("");
        this.props.history.push({
            pathname: '/accept_partia',
            state: { partii: this.state.partii, length: this.state.partii.length - 1, current_location: this.state.current_location + 1 }
        })

    }

    setColumns() {
        let cols = [
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: false, editable: true,
            },
            {
                headerName: "Widział", field: "idWydzial", sortable: true, filter: true, editable: false,
            },
            {
                headerName: "Illosc w batchu", field: "Liczba", sortable: true, filter: true, editable: false,
                valueSetter: function (params) {
                    let tmp = parseInt(params.newValue, 10);
                    return params.data.Liczba = tmp;
                },
            }
        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
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
            case 'Liczba':
                this.setState({ Liczba: value });
                break;
            case 'CenaWSprzedazy':
                this.setState({ CenaWSprzedazy: Math.abs(value) });
                break;
            default:
                console.log("Unknown");
                break;
        }
    }

    count_total() {
        let sum = 0;
        this.gridApi.forEachNode(node => {
            sum += node.data.Liczba;
        });
        console.log(sum);
        this.setState({ suma: sum });
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
                            <Label htmlFor="Liczba">Illosc zakupu</Label>
                            <Input type="number" className="form-control" name="Liczba" value={this.state.Liczba} onChange={this.handleInputChange} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label htmlFor="CenaWSprzedazy">Cena w sprzedazy</Label>
                            <Input type="number" className="form-control" name="CenaWSprzedazy" value={this.state.CenaWSprzedazy} onChange={this.handleInputChange} />
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
                        //  rowSelection={this.state.rowSelection}
                        //  onSelectionChanged={this.onSelectionChanged.bind(this)}
                        />
                    </div>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Button color="success" onClick={this.handleUpdate}>{this.state.length === this.state.current_location ? "Zakoncz Przyjmowanie" : "Przejdz do następnego"} </Button>
                        </FormGroup>
                    </Col>
                    <Col>
                        <p>Partia {this.state.current_location + 1} Out of {this.state.length + 1} </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default connect()(Accept_Partia);