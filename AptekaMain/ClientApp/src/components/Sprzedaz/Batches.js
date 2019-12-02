﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Row, Col } from 'reactstrap';
import DeleteButton from './DeleteButton'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';

class Batches extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lista: '', artykuls: [], batches: [], loading_data: true, loading_table: true,
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
            suma: 0
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
                headerName: "IdBatch", field: "IdBraki", hide: true,
            },
            {
                headerName: "IdPartia", field: "IdPartia", hide: true
            },
            {
                headerName: "WydzialAptekiIdWydzialu", field: "WydzialAptekiIdWydzialu", hide: true
            },
            {
                headerName: "FullArtykul", field: "fullartykul", sortable: true, filter: true, editable: false, width: 400,hide: true
            },
            {
                headerName: "Artykul", field: "artykul", sortable: true, filter: true, editable: false, width: 200
            },
            {
                headerName: "Cena", field: "Cena", sortable: true, filter: true, editable: false, width: 100
            },
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: true, editable: false,width: 100
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
                headerName: "IdBatch", field: "IdBraki", hide: true,
            },
            {
                headerName: "IdPartia", field: "IdPartia", hide: true
            },
            {
                headerName: "WydzialAptekiIdWydzialu", field: "WydzialAptekiIdWydzialu", hide: true
            },
            {
                headerName: "FullArtykul", field: "fullartykul", valueGetter: function (params) {
                    return params.data.artykul + " " + params.data.Producent + " " + params.data.Kraj;
                },sortable: true, filter: true, editable: false, width: 200
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
                    console.log(tmp);
                    if (tmp < 1)
                        tmp = 1;
                    else if (tmp > params.data.Liczba)
                        tmp = params.data.Liczba;
                    return params.data.LiczbaWybrana=tmp;
                }, width: 150
            },
            {
                headerName: "Wartosc", field: "Wartosc", valueGetter: function (params) {
                    return params.data.LiczbaWybrana * params.data.Cena;
                }, sortable: true, filter: true, editable: false, width: 150
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
            sum += node.data.LiczbaWybrana*node.data.Cena;
            console.log("Wartosc");
            console.log(node.data.LiczbaWybrana);
            console.log(node.data.Cena);
        });
        console.log(sum);
        this.setState({ suma: sum });
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
            </Container>
        );
    }
}


export default connect()(Batches);