import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Sprzedazy extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sprzedazy: [], loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            rowSelection: "single"
        };

        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
    }

    async componentDidMount() {
        await fetch('/api/Sprzedaz?$filter=idSprzedaz ne 1')
            .then(response => response.json())
            .then(data => {
                this.setState({ sprzedazy: data, loading_data: false });
            });
        this.getTableData();
    }

    refresh() {
        this.props.history.push("/sprzedazy");
    }


    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var sprz = this.state.sprzedazy;
        var user_rowData = [];
        for (var i = 0; i < sprz.length; i++) {
            var spr = sprz[i];
            var row = {
                idSprzedaz: spr.idSprzedaz,
                suma: spr.suma,
                dataSprzedazy: spr.dataSprzedazy,
                typOplaty: spr.typOplaty,
                wymaganaRecepta: spr.wymaganaRecepta,
            }

            user_rowData.push(row);
        }
        return user_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "Numer", field: "idSprzedaz", sortable: true, filter: true
            },
            {
                headerName: "suma", field: "suma", sortable: true, filter: true
            },
            {
                headerName: "dataSprzedazy", field: "dataSprzedazy", sortable: true, filter: true,
            },
            {
                headerName: "typOplaty", field: "typOplaty", sortable: true, filter: true
            },
            {
                headerName: "wymaganaRecepta", field: "wymaganaRecepta", sortable: true, filter: true
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
        this.props.history.push('/sprzedaz/' + cell);
    }

    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedRow = selectedRows.pop();
        this.props.history.push('/sprzedaz/' + selectedRow.idSprzedaz);

    }

    render() {
        return (
            <div style={{ height: '500px' }} className="ag-theme-balham">
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    context={this.state.context}
                    onGridReady={this.onGridReady}
                    rowSelection={this.state.rowSelection}
                    onSelectionChanged={this.onSelectionChanged.bind(this)}
                    getRowStyle={function (params) {
                        if (params.data.wymaganaRecepta === true) {
                            return {
                                'background-color': '#ffb2b2',
                                'color': '#F4F8F5'
                            };
                        } else if (params.data.wymaganaRecepta === false) {
                            return {
                                'background-color': '#b2ffb2'
                            };
                        }
                        return null;
                    }

                    }

                />
            </div>
        );
    }
}


export default connect()(Sprzedazy);