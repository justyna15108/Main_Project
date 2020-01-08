import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [], wydzialy: [], loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            rowSelection: "single"
        };

        this.findWydzial = this.findWydzial.bind(this);
        this.getPoziomDostepu = this.getPoziomDostepu.bind(this);
        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    async componentDidMount() {
        await fetch('api/Pracowniks')
            .then(response => response.json())
            .then(data => {
                this.setState({ users: data });
            });
        await fetch('api/Wydzials')
            .then(response => response.json())
            .then(data => {
                this.setState({ wydzialy: data, loading_data: false })
            });
        this.getTableData();
    }

    refresh() {
        this.props.history.push("/users");
    }

    findWydzial(id) {
        var wydz = this.state.wydzialy;
        for (var i in wydz) {
            if (id === wydz[i].idWydzial)
                return wydz[i].adres;
        };
        return "Wydzial not Found";
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var users = this.state.users;
        var user_rowData = [];
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            var row = {
                id: user.idPracownika,
                imie: user.imie,
                nazwisko: user.nazwisko,
                poziomDostepu: this.getPoziomDostepu(user.poziomDostepu),
                wydzial: this.findWydzial(user.wydzialAptekiIdWydzialu),
                email: user.email
            }

            user_rowData.push(row);
        }
        return user_rowData;
    }

    getPoziomDostepu(lvl) {
        let res;
        switch (lvl) {
            case 1:
                res = "Farmaceuta";
                break;
            case 2:
                res = "Kierownik";
                break;
            case 3:
                res = "Administrator";
                break;
            default:
                res = "Not Found";
        }
        return res;
    }

    setColumns() {
        let cols = [
            {
                headerName: "Numer", field: "id", sortable: true, filter: true
            },
            {
                headerName: "Imie", field: "imie", sortable: true, filter: true
            },
            {
                headerName: "Nazwisko", field: "nazwisko", sortable: true, filter: true,
            },
            {
                headerName: "Stanowisko", field: "poziomDostepu", sortable: true, filter: true
            },
            {
                headerName: "Wydzial Apteki", field: "wydzial", sortable: true, filter: true
            },
            {
                headerName: "email", field: "email", sortable: true, filter: true
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
        this.props.history.push('/user_edit/' + cell);
    }

    handleCreate() {
        this.props.history.push('/user_edit/0');
    }

    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedRow = selectedRows.pop();
        this.props.history.push('/user_edit/' + selectedRow.id);

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
                />
                <FormGroup>
                    <Button className="btn btn-primary" type="button" onClick={this.handleCreate}>Dodaj Użytkownika</Button>
                </FormGroup>
            </div>
        );
    }
}


export default connect()(Users);