import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col, select } from 'reactstrap';
import DeleteButton from './DeleteButton'
import { AgGridReact } from 'ag-grid-react';
import Podsumowanie from './Podsumowanie';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

class Batches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lista: '', artykuls: [], batches: [], rabats: [], rabat: 1, loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            columnDefs2: [],
            rowData2: [],
            getRowNodeId: function (data) {
                return data.IdBatch;
            },
            rowSelection: "single",
            api: [],
            columnApi: [],
            api2: [],
            columnApi2: [],
            idWydzialu: '',
            redirect: false,
            frameworkComponents: {
                deleteRenderer: DeleteButton
            },
            suma: 0,
            open: false,
            list: [],
            typOplaty: "Gotówka",
            sprzedaz_id: ''
        };

        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.findArtykulName = this.findArtykulName.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.getAllRows = this.getAllRows.bind(this);
        this.findProducentKraj = this.findProducentKraj.bind(this);
        this.findProducentName = this.findProducentName.bind(this);
        this.findKategoria = this.findKategoria.bind(this);
        this.handlesumUpdate = this.handlesumUpdate.bind(this);
        this.togglePopUp = this.togglePopUp.bind(this);
        this.hide = this.hide.bind(this);
        this.create_list = this.create_list.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
        this.check_recepta = this.check_recepta.bind(this);
        this.get_recepta_need = this.get_recepta_need.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.findRabat = this.findRabat.bind(this);
    }

    async componentDidMount() {
        const wydzial_id = this.props.match.params.id;
        this.setState({ idWydzialu: 1 });
        await fetch('api/Batches?$expand=idPartiaNavigation&$filter=wydzialAptekiIdWydzialu eq 1')
            .then(response => response.json())
            .then(data => {
                this.setState({ batches: data });
            });
        await fetch('api/Artykuls?$expand=kategoriaIdKategoriaNavigation, producentIdProducentNavigation')
            .then(response => response.json())
            .then(data => {
                this.setState({ artykuls: data });
            });
        await fetch('api/Rabats')
            .then(response => response.json())
            .then(data => {
                this.setState({ rabats: data });
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

    findProducentName(id) {
        var arts = this.state.artykuls;
        for (var i in arts) {
            if (id === arts[i].IdArtykul)
                return arts[i].ProducentIdProducentNavigation.Nazwa;
        };
        return 0;
    }

    findProducentKraj(id) {
        var arts = this.state.artykuls;
        for (var i in arts) {
            if (id === arts[i].IdArtykul)
                return arts[i].ProducentIdProducentNavigation.Kraj;
        };
        return 0;
    }

    findKategoria(id) {
        var arts = this.state.artykuls;
        for (var i in arts) {
            if (id === arts[i].IdArtykul)
                return arts[i].KategoriaIdKategoriaNavigation.Nazwa;
        };
        return 0;
    }

    findRabat(id) {
        var rabats = this.state.rabats;
        for (var i in rabats) {
            if (id == rabats[i].idRabat)
                return rabats[i].procentRabatu;
        };
        return 0;
    }

    refresh() {
        this.props.history.push("/listy_brakow");
    }

    handleReturn() {
        setTimeout(this.refresh, 300);
    }

    onGridReady = params => {
        this.gridApi1 = params.api;
        this.gridColumnApi1 = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    onGridReady2 = params => {
        this.gridApi2 = params.api;
        this.gridColumnApi2 = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var batches = this.state.batches;
        var brak_rowData = [];
        for (var i = 0; i < batches.length; i++) {
            var batch = batches[i];
            var row = {
                IdBatch: batch.IdBatch,
                IdPartia: batch.IdPartia,
                idArtykul: batch.IdPartiaNavigation.ArtykulIdArtukulu,
                WydzialAptekiIdWydzialu: this.state.idWydzialu,
                artykul: this.findArtykulName(batch.IdPartiaNavigation.ArtykulIdArtukulu),
                Kod: batch.Kod,
                Cena: batch.IdPartiaNavigation.CenaWSprzedazy,
                Liczba: batch.Liczba,
                LiczbaWybrana: 1,
                Producent: this.findProducentName(batch.IdPartiaNavigation.ArtykulIdArtukulu),
                Kraj: this.findProducentKraj(batch.IdPartiaNavigation.ArtykulIdArtukulu),
                Kategoria: this.findKategoria(batch.IdPartiaNavigation.ArtykulIdArtukulu)
            }
            brak_rowData.push(row);
        }
        return brak_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "IdBatch", field: "IdBatch", hide: true,
            },
            {
                headerName: "IdPartia", field: "IdPartia", hide: true
            },
            {
                headerName: "idArtykul", field: "idArtykul", hide: true
            },
            {
                headerName: "WydzialAptekiIdWydzialu", field: "WydzialAptekiIdWydzialu", hide: true
            },
            {
                headerName: "FullArtykul", field: "fullartykul", sortable: true, filter: true, editable: false, width: 400, hide: true
            },
            {
                headerName: "Artykul", field: "artykul", sortable: true, filter: true, editable: false, width: 200
            },
            {
                headerName: "Cena", field: "Cena", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Liczba", field: "Liczba", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Producent", field: "Producent", sortable: true, filter: true, editable: false, width: 150
            },
            {
                headerName: "Kraj Producenta", field: "Kraj", sortable: true, filter: true, editable: false, width: 150
            },
            {
                headerName: "Kategoria", field: "Kategoria", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "LiczbaWybrana", field: "LiczbaWybrana", hide: true,
            }
        ]
        return cols;
    }

    setColumns2() {
        let cols = [
            {
                headerName: "IdBatch", field: "IdBatch", hide: true,
            },
            {
                headerName: "IdPartia", field: "IdPartia", hide: true
            },
            {
                headerName: "idArtykul", field: "idArtykul", hide: true
            },
            {
                headerName: "WydzialAptekiIdWydzialu", field: "WydzialAptekiIdWydzialu", hide: true
            },
            {
                headerName: "FullArtykul", field: "fullartykul", valueGetter: function (params) {
                    return params.data.FullArtykul = params.data.artykul + " " + params.data.Producent + " " + params.data.Kraj;
                }, sortable: true, filter: true, editable: false, width: 200
            },
            {
                headerName: "Artykul", field: "artykul", sortable: true, filter: true, editable: false, width: 150, hide: true
            },
            {
                headerName: "Cena", field: "Cena", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Liczba", field: "Liczba", sortable: true, filter: true, editable: false, width: 100, hide: true
            },
            {
                headerName: "Producent", field: "Producent", sortable: true, filter: true, editable: false, width: 150, hide: true
            },
            {
                headerName: "Kraj Producenta", field: "Kraj", sortable: true, filter: true, editable: false, width: 150, hide: true
            },
            {
                headerName: "Kategoria", field: "Kategoria", sortable: true, filter: true, editable: false, width: 100, hide: true
            },
            {
                headerName: "LiczbaWybrana", field: "LiczbaWybrana", editable: true, type: "valueColumn", valueSetter: function (params) {
                    let tmp = Number(params.newValue);
                    if (tmp < 1)
                        tmp = 1;
                    else if (tmp > params.data.Liczba)
                        tmp = params.data.Liczba;
                    return params.data.LiczbaWybrana = tmp;
                }, width: 150
            },
            {
                headerName: "Wartosc", field: "Wartosc", valueGetter: function (params) {
                    return params.data.Wartosc = params.data.LiczbaWybrana * params.data.Cena;
                }, valueSetter(params) {
                    return params.data.Wartosc;
                },
                sortable: true, filter: true, editable: false, width: 150
            },
            {
                headerName: "deleteRenderer", field: "tmp", cellRenderer: "deleteRenderer", colId: "delete"
            },


        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        let cols2 = this.setColumns2();
        let rows2 = [];
        this.setState({ columnDefs: cols, rowData: rows, columnDefs2: cols2, rowData2: rows2, loading_table: false });
        //new Date(parsed);
    }


    handleInputChange(event) {
        const target = event.target;
        let name = target.name;
        let value = target.value;
        switch (name) {
            case 'rabat':
                this.setState({ rabat: value });
                setTimeout(this.handlesumUpdate, 100);
                break;
            default:
                console.log("Unknown");
                break;
        }

    }

    onSelectionChanged() {
        var selectedRows = this.gridApi1.getSelectedRows();
        var selectedRow = selectedRows[0];
        if (selectedRow) {
            this.gridApi2.updateRowData({ add: selectedRows })
            this.gridApi1.updateRowData({ remove: selectedRows });
        }
        this.handlesumUpdate();
        //console.log(this.gridApi2);
    }

    onSelectionChanged2() {
        var selectedRows = this.gridApi2.getSelectedRows();
        let selectedCell = this.gridApi2.getFocusedCell();
        var selectedRow = selectedRows[0];
        if (selectedCell.column.colId == 'delete')
            if (selectedRow) {
                this.gridApi1.updateRowData({ add: selectedRows })
                //let rows = this.state.rowData2;
                //rows.push(selectedRow);
                //this.setState({ rowData2: rows });
                this.gridApi2.updateRowData({ remove: selectedRows });
            }
        this.handlesumUpdate();
    }

    getAllRows() {
        let rowData = [];
        this.gridApi2.forEachNode(node => rowData.push(node.data));
        return rowData;
    }

    handleRedirect() {
        this.setState({ redirect: true });
    }

    onCellEditingStopped(e) {
        //console.log(e);
        //console.log(this.gridApi2);
        this.handlesumUpdate();
    }


    handlesumUpdate() {
        let sum = 0;
        this.gridApi2.forEachNode(node => {
            sum += node.data.LiczbaWybrana * node.data.Cena;
        });
        let procent = 100 - this.findRabat(this.state.rabat);
        sum = sum * procent / 100;
        this.setState({ suma: sum });
    }

    togglePopUp() {
        this.create_list();
        this.setState({ open: true });
    }

    hide() {
        this.setState({ open: false });
    }


    create_list() {
        let l = [];

        this.gridApi2.forEachNode(node => {
            let row = {
                idBatch: node.data.IdBatch,
                idArtykul: node.data.idArtykul,
                kod: node.data.Kod,
                liczba: node.data.Liczba,
                wydzialAptekiIdWydzialu: node.data.WydzialAptekiIdWydzialu,
                idPartia: node.data.IdPartia,
                cena: node.data.Cena,
                liczbaWybrana: node.data.LiczbaWybrana,
                Wartosc: node.data.Wartosc,
                artykul: node.data.artykul,
                full_artykul: node.data.FullArtykul
            };
            l.push(row);
        });
        this.setState({ list: l });
    }

    handleAccept() {
        var sprzedaz_id;
        var req_sprzedaz = JSON.stringify({
            dataSprzedazy: new Date(),
            suma: this.state.suma,
            typOplaty: this.state.typOplaty,
            wymaganaRecepta: this.get_recepta_need(),
            rabatIdRabatu: this.state.rabat
        });
        fetch("/api/Sprzedaz", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: req_sprzedaz
        }).then(response => response.json()).then(data => {
            console.log(data);
            sprzedaz_id = data.idSprzedaz;
            this.setState({ sprzedaz_id: data.idSprzedaz });
            for (let item of this.state.list) {

                var req_sp = JSON.stringify({
                    sprzedazId: data.idSprzedaz,
                    batchId: item.idBatch,
                    liczba: item.liczbaWybrana,
                });

                fetch("/api/SprzedazProduktow", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: req_sp
                }).then(response => response.json()).then(data => console.log(data));
            } return data;
        }).then(data => { this.props.history.push('/sprzedaz/' + data.idSprzedaz) });

        this.hide();

    }

    check_recepta(id) {
        var arts = this.state.artykuls;
        for (var i in arts) {
            if (id === arts[i].IdArtykul)
                return arts[i].WymaganaRecepta;
        };
        return false;
    }

    get_recepta_need() {
        for (let item of this.state.list) {
            if (this.check_recepta(item.idArtykul) === true)
                return true;
        }
        return false;
    }

    render() {
        var date = new Date(this.state.lista.DataGen);
        //var comp = numericCellEditor: NumericCellEditor};
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h4>Wydzial </h4>
                        {date && <p>Lista Braków dnia {this.state.lista.DataGen}</p>}
                    </Col>
                    <Col>
                        <h4>Sprzedaz</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                        <div style={{ height: '500px' }} className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={this.state.columnDefs}
                                rowData={this.state.rowData}
                                context={this.state.context}
                                onGridReady={this.onGridReady}
                                rowSelection={this.state.rowSelection}
                                onSelectionChanged={this.onSelectionChanged.bind(this)}
                            />
                        </div>
                    </Col>
                    <Col>
                        <select className="form-control" name="rabat" value={this.state.rabat} onChange={this.handleInputChange}>
                            {this.state.rabats.map(rabat =>
                                <option key={rabat.idRabat} value={rabat.idRabat} >{rabat.procentRabatu}%</option>
                            )}
                        </select>
                        <div style={{ height: '500px' }} className="ag-theme-blue">
                            <AgGridReact
                                columnDefs={this.state.columnDefs2}
                                rowData={this.state.rowData2}
                                context={this.state.context}
                                onGridReady={this.onGridReady2}
                                frameworkComponents={this.state.frameworkComponents}
                                rowSelection={this.state.rowSelection}
                                onSelectionChanged={this.onSelectionChanged2.bind(this)}
                                onCellEditingStopped={this.onCellEditingStopped.bind(this)}
                            />
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormGroup>
                            <Button className="btn btn-primary" type="button" onClick={this.handleRedirect}>Przejdź do Złozenia zamowienia</Button>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>Lączna wartość: {this.state.suma}</p>
                    </Col>
                </Row>
                {this.state.redirect &&
                    <Redirect to={{
                        pathname: '/create_zamowienie',
                        state: { init_data: this.getAllRows() }
                    }}
                    />
                }
                <Podsumowanie isopen={this.state.open} hide={this.hide} list={this.state.list} suma={this.state.suma} accept={this.handleAccept} />
                <Button onClick={this.togglePopUp}>Podsumowanie</Button>
            </Container>
        );
    }
}


export default connect()(Batches);