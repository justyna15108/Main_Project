import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import EditButton from './EditButton';

class Artykuls extends Component {

    constructor(props) {
        super(props);
        this.state = {
            artykuls: [], kategorias: [], producents: [], loading_data: true,loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            frameworkComponents: {
                editRenderer: EditButton
            },
            rowSelection: "single"
        };
        
        this.findKategoriaName = this.findKategoriaName.bind(this);
        this.findProducentName = this.findProducentName.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    async componentDidMount() {
        await fetch('api/Artykuls')
            .then(response => response.json())
            .then(data => {
                this.setState({ artykuls: data });
            });
        await fetch('api/Producents')
            .then(response => response.json())
            .then(data => {
                this.setState({ producents: data })
            });
        await fetch('api/Kategorias')
            .then(response => response.json())
            .then(data => {
                this.setState({ kategorias: data, loading_data: false });
            });
        this.getTableData();
    }

    refresh() {
        this.props.history.push("/artykuls");
    }

    findKategoriaName(id) {
        var kat = this.state.kategorias;
        for (var i in kat) {
            if (id === kat[i].idKategoria)
                return kat[i].nazwa;
        };
        return "Kategoria not Found";
    }
    findProducentName(id) {
        var prod = this.state.producents;
        for (var i in prod) {
            if (id === prod[i].idProducent)
                return prod[i].nazwa;
        };
        return "Producent not Found";
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var artykuls = this.state.artykuls;
        var art_rowData = [];
        for (var i = 0; i<artykuls.length; i++) {
            var artykul = artykuls[i];
            var row = {
            nazwa: artykul.nazwa,
            kod: artykul.kod,
            illoscProduktow: artykul.illoscProduktow,
            illoscPodstawowa: artykul.illoscPodstawowa,
            kategoria: this.findKategoriaName(artykul.kategoriaIdKategoria),
            producent: this.findProducentName(artykul.producentIdProducent),
            wymaganaRecepta: artykul.wymaganaRecepta,
            idArtykul: artykul.idArtykul
            }
            
            art_rowData.push(row);
        }
        return art_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "Nazwa", field: "nazwa", sortable: true, filter: true ,width: 100
                },
            {
                headerName: "Kod", field: "kod", sortable: true, filter: true, width: 80 
                },
            {
                headerName: "Illość", field: "illoscProduktow", sortable: true, filter: true, width: 80
                },
            {
                headerName: "Illość Podstawowa", field: "illoscPodstawowa", sortable: true, filter: true
                },
            {
                headerName: "Kategoria", field: "kategoria", sortable: true, filter: true
                },
            {
                headerName: "Producent", field: "producent", sortable: true, filter: true
                },
            {
                headerName: "Wymagana recepta?", field: "wymaganaRecepta",sortable: true
            }
        ]
        if (this.props.auth.isAuthenticated && this.props.auth.user.access > 1) {
            cols.push({
                headerName: "Edit", field: "idArtykul", cellRenderer: "editRenderer", colId: "edit"
            });
        }
        else {
            cols.push({
                headerName: "Edit", field: "idArtykul", cellRenderer: "editRenderer", colId: "edit", hide: true
            });
        }
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

    handleCreate() {
        this.props.history.push('/artykul_edit/0');
    }

    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedCell = this.gridApi.getFocusedCell();
        let selectedRow = selectedRows.pop();
        if (selectedCell.column.colId !== 'edit')
        this.props.history.push('/artykul_show/' + selectedRow.idArtykul);
    }

    render() {
        return (
            <div style={{ height: '500px' }} className="ag-theme-balham">
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    context={this.state.context}
                    frameworkComponents={this.state.frameworkComponents}
                    onGridReady={this.onGridReady}
                    rowSelection={this.state.rowSelection}
                    onSelectionChanged={this.onSelectionChanged.bind(this)}
                />
                {(this.props.auth.isAuthenticated && this.props.auth.user.access > 1) &&
                    <FormGroup>
                        <Button color="success" onClick={this.handleCreate}>Dodaj Nowy</Button>
                    </FormGroup>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { auth: state.auth }
}

export default connect(mapStateToProps)(Artykuls);