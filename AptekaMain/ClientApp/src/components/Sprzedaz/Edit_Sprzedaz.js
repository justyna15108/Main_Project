import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Row, Col, Container } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import ReactToPdf from 'react-to-pdf';
import Scan_Preview from './Scan_Preview';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const ref = React.createRef();

class Edit_Sprzedaz extends Component {
    displayName = Edit_Sprzedaz.name;


    constructor(props) {
        super(props);
        this.state = {
            sprzedaz: [], loading: true,
            IdSprzedaz: '', DataSprzedazy: '', Suma: '', RabatIdRabatu: '', TypOplaty: '', WymaganaRecepta: '', ReceptaDolaczona: '',
            Rabat: '', sp: [], columnDefs: [], rowData: [], selectedFile: '', base64: '', file_ready: false, scans: [],
            chosen_url: '', open: false
        };


        this.refresh = this.refresh.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleReturn = this.handleReturn.bind(this);
        this.getShortDate = this.getShortDate.bind(this);
        this.setRowData = this.setRowData.bind(this);
        this.setColumns = this.setColumns.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.pdfref = React.createRef();
        this.handleShow = this.handleShow.bind(this);
        this.findScan = this.findScan.bind(this);
        this.hide = this.hide.bind(this);
    }

    async componentDidMount() {
        const sprzedaz_id = this.props.match.params.id;
        await fetch('/api/Sprzedaz?$expand=SprzedazProduktow($expand=batch($expand=idPartiaNavigation($expand=artykulIdArtukuluNavigation))),rabatIdRabatuNavigation&$filter=IdSprzedaz eq '
            + sprzedaz_id)
            .then(response => response.json())
            .then(data => data[0])
            .then(data => {
                this.setState({
                    IdSprzedaz: data.IdSprzedaz, DataSprzedazy: new Date(data.DataSprzedazy), Suma: data.Suma, RabatIdRabatu: data.RabatIdRabatu,
                    TypOplaty: data.TypOplaty, WymaganaRecepta: data.WymaganaRecepta, ReceptaDolaczona: data.ReceptaDolaczona, Rabat: data.RabatIdRabatuNavigation.ProcentRabatu, sp: data.SprzedazProduktow
                });
            });
        await fetch('/api/ScanRecepties?$filter=sprzedazIdSprzedazy eq '
            + sprzedaz_id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    scans: data
                });
            });
        this.getTableData();
    }

    handleUpdate() {
        fetch("/api/Sprzedaz" + this.state.IdSprzedaz, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IdSprzedaz: this.state.IdSprzedaz,
                DataSprzedazy: this.state.DataSprzedazy,
                Suma: this.state.Suma,
                RabatIdRabatu: this.state.RabatIdRabatu,
                TypOplaty: this.state.TypOplaty,
                WymaganaRecepta: this.state.WymaganaRecepta,
                ReceptaDolaczona: this.state.ReceptaDolaczona
            })
        }).then(setTimeout(this.refresh, 300));
    }

    handleReturn() {
        setTimeout(this.refresh, 300);
    }

    refresh() {
        this.props.history.push("/");
        this.props.history.push("/sprzedazy");
    }

    getShortDate(json_date) {

        let full_date = new Date(json_date);
        return full_date.toLocaleDateString();
    }


    onGridReady = params => {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    };

    setRowData() {
        var sp = this.state.sp;
        var sp_rowData = [];
        for (var i = 0; i < sp.length; i++) {
            var s = sp[i];
            var row = {
                Artykul: s.Batch.IdPartiaNavigation.ArtykulIdArtukuluNavigation.Nazwa,
                Kod: s.Batch.Kod,
                Liczba: s.Liczba,
                Cena: s.Batch.IdPartiaNavigation.CenaWSprzedazy
            }

            sp_rowData.push(row);
        }
        return sp_rowData;
    }

    setColumns() {
        let cols = [
            {
                headerName: "Artykul", field: "Artykul", sortable: true, filter: true, width: 150
            },
            {
                headerName: "Kod", field: "Kod", sortable: true, filter: true, width: 150
            },
            {
                headerName: "Liczba", field: "Liczba", sortable: true, filter: true, width: 100
            },
            {
                headerName: "Cena", field: "Cena", sortable: true, filter: true, width: 100
            }
        ]
        return cols;
    }

    getTableData() {
        let rows = this.setRowData();
        let cols = this.setColumns();
        this.setState({ columnDefs: cols, rowData: rows, loading_table: false });
    }


    fileChangedHandler = event => {
        this.setState({ file_state: "loading" });
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.setState({
                selectedFile: file,
                base64: reader.result,
                file_ready: true
            });
        };
    }

    uploadHandler = () => {
        let reader = new FileReader();
        const formData = new FormData();
        formData.append('ScanPath', 'testpath');
        formData.append('SprzedazIdSprzedazy', this.state.IdSprzedaz);
        formData.append('ScanName', this.state.selectedFile.name);
        formData.append('Scan', this.state.base64);
        console.log('Trying post');
        axios.post('api/ScanRecepties', formData).then(resp => {
            this.setState(prevState => ({
                arrayvar: [...prevState.scans, resp.data]
            }))
            console.log(resp.data);
            this.handleReturn();
        });

    }

    handleShow(id) {
        console.log("id" + id);
        let url = this.findScan(id);
        this.setState({ chosen_url: url, open: true });
    }

    findScan(id) {
        var scans = this.state.scans;
        for (var i in scans) {
            if (id === scans[i].idScan)
                return scans[i].scan;
        };
        return " ";
    }

    hide() {
        this.setState({ open: false });
    }

    render() {
        let options = {
            orientation: 'landscape'
        };
        return (
            <div ref={this.pdfref}>
                <Container fluid>
                    <Row>
                        <Col xs="5">
                            <h1>Sprzedaz: {this.props.match.params.id} </h1>
                            <Row>
                                <Col>
                                    <p> Data: </p>
                                </Col>
                                <Col>
                                    <p>{this.getShortDate(this.state.DataSprzedazy)}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p> typOplaty: </p>
                                </Col>
                                <Col>
                                    <p> {this.state.TypOplaty}</p>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>Suma:</p>
                                </Col>
                                <Col>
                                    <p>{this.state.Suma}zl ( {this.state.Rabat}% rabat )</p>
                                </Col>
                            </Row>
                            {this.state.WymaganaRecepta &&
                                <Row>
                                    <p>Wymaqgana Recepta</p>
                                </Row>
                            }
                            <Row>
                                <div style={{ height: '500px', width: '500px' }} className="ag-theme-balham">
                                    <AgGridReact
                                        columnDefs={this.state.columnDefs}
                                        rowData={this.state.rowData}
                                        context={this.state.context}
                                        onGridReady={this.onGridReady}
                                    />
                                </div>
                            </Row>
                        </Col>
                        <Col xs="5">
                            {this.state.WymaganaRecepta &&
                                <div>
                                    <p>Skany</p>
                                    <Row>
                                        <input type="file" onChange={this.fileChangedHandler} />
                                        <Button color="success" onClick={this.uploadHandler} disabled={!this.state.file_ready} > Upload</Button>
                                    </Row>
                                    <Row>
                                        {this.state.scans.length > 0 &&
                                            <Table>
                                                <tbody>
                                                    {this.state.scans.map(sc =>
                                                        <tr key={sc.idScan}>
                                                            <td>{sc.scanName}</td>
                                                            <td> <Button color="info" onClick={(id) => this.handleShow(sc.idScan)}>Show Scan</Button> </td>
                                                        </tr>
                                                    )}
                                                </tbody>


                                            </Table>
                                        }
                                    </Row>
                                </div>
                            }
                            <Row>
                                <ReactToPdf targetRef={this.pdfref} filename="sprzedaz.pdf">
                                    {({ toPdf }) => (
                                        <Button color="info" onClick={toPdf}>Generate pdf</Button>
                                    )}
                                </ReactToPdf>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <p> </p>
                            </Row>
                            <Row>
                                <Button color="secondary" onClick={this.handleReturn}>Return</Button>
                            </Row>
                        </Col>
                    </Row>
                    <Scan_Preview isopen={this.state.open} hide={this.hide} url={this.state.chosen_url} />
                </Container>
            </div>
        );
    }
}


export default connect()(Edit_Sprzedaz);