import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

class Hurtownie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hurtownie: [], loading_data: true, loading_table: true,
            columnDefs: [],
            rowData: [],
            context: { componentParent: this },
            rowSelection: "single"
        };

        this.refresh = this.refresh.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
    }

    //Componened was created but not yet rendered
    //good place for fetching data from api or from props
    async componentDidMount() {
        await fetch('api/Hurtownias')
            .then(response => response.json())
            .then(data => {
                this.setState({ wydzialy: data })
            });
        this.getTableData();
    }

    //If for some reason you want to rerender this component with fetching new data
    refresh() {
        this.props.history.push("/users");
    }

    //when ag grid is ready
    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var hurtownie = this.state.hurtownie;
        var hurtownie_rowData = [];
        for (var i = 0; i < users.length; i++) {
            var hurt = hurtownie[i];
            var row = {
                idHurtownia: hurt.idHurtownia,


                //fill the rest
            }

            hurtownie_rowData.push(row);
        }
        return hurtownie_rowData;
    }
    /* This is what you get from api
     {
        "idHurtownia": 1,
        "nazwa": "alba",
        "dniNaOplate": 3,
        "dniNaDostawe": 3
        },
    */
    //default column properties: hide: false, editable: false
    // header-> column name in the table, field-> real column name, then aditional props
    setColumns() {
        let cols = [
            {
                headerName: "idHurtownia", field: "idHurtownia", hide: true
            },
            {
                headerName: "Nazwa", field: "nazwa", sortable: true, filter: true
            },
            {
                headerName: "Dni dla oplaty zamowienia", field: "dniNaOplate", sortable: true, filter: true,
            },
            {
                headerName: "Dni na dostawe zamowienia", field: "dniNaDostawe", sortable: true, filter: true
            }
        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
    }

    //i use empty edit form to create new but if you want you can create new component
    handleCreate() {
        this.props.history.push('/hurtownia_edit/0');
    }

    //when you click on row this function is called 
    onSelectionChanged() {
        let selectedRows = this.gridApi.getSelectedRows();
        let selectedRow = selectedRows.pop();
        this.props.history.push('/Wydzials_edit/' + selectedRow.id);
        //redirect to edit form
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
                    <Button className="btn btn-primary" type="button" onClick={this.handleCreate}>Create new</Button>
                </FormGroup>
            </div>
        );
    }
}


export default connect()(Hurtownie);