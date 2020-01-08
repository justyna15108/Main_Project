import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Table, Container, Col, Row } from 'reactstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {
    PieChart, Pie, Legend, Tooltip, Cell, ResponsiveContainer, Sector,
} from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class Sales_Charts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sprzedaz_by_payment: [],
            sprzedaz_by_date: [],
            sprzedaz_by_recepta: [],
            dates_by_month: [
                {
                    key: 1,
                    month: "Grudzień",
                    start: "2019-12-01T00:00:00Z",
                    finish: "2020-01-01T00:00:00Z"
                },
                {
                    key: 2,
                    month: "Styczeń",
                    start: "2020-01-01T00:00:00Z",
                    finish: "2020-02-01T00:00:00Z"
                },
            ],
            activeIndex: 0,
            graphs: []
        };

        this.get_data_recepta_chart = this.get_data_recepta_chart.bind(this);
        this.get_data_payment_chart = this.get_data_payment_chart.bind(this);
        this.create_map = this.create_map.bind(this);
    }

    async componentDidMount() {
        let sp_b_r = [];
        let sp_b_p = [];
        for (let i = 0; i < this.state.dates_by_month.length; i++) {
            await fetch('api/Sprzedaz?$apply=filter(dataSprzedazy ge ' + this.state.dates_by_month[i].start + ' and dataSprzedazy le ' + this.state.dates_by_month[i].finish + ')/groupby((wymaganaRecepta), aggregate($count as Liczba))')
                .then(response => response.json())
                .then(data => {
                    sp_b_r.push(data);
                });
            await fetch('api/Sprzedaz?$apply=filter(dataSprzedazy ge ' + this.state.dates_by_month[i].start + ' and dataSprzedazy le ' + this.state.dates_by_month[i].finish + ')/groupby((typOplaty), aggregate(suma with sum as Total))')
                .then(response => response.json())
                .then(data => {
                    sp_b_p.push(data);
                });
        }
        this.setState({ sprzedaz_by_recepta: sp_b_r, sprzedaz_by_payment: sp_b_p });
    }


    componentDidUpdate(prevProps, prevState) {
        if (prevState.sprzedaz_by_recepta !== this.state.sprzedaz_by_recepta || prevState.sprzedaz_by_payment !== this.state.sprzedaz_by_payment) {
            this.create_map();
        }
    }



    refresh() {
        this.props.history.push("/users");
    }

    get_data_payment_chart(a) {
        let data_arr = this.state.sprzedaz_by_payment[a];
        let rdata = [];
        for (var i = 0; i < data_arr.length; i++) {
            var r = data_arr[i];
            var row = {
                name: r.TypOplaty,
                value: r.Total
            }
            rdata.push(row);
        }

        return rdata;
    }
    get_data_recepta_chart(a) {
        let data_arr = this.state.sprzedaz_by_recepta[a];
        console.log('grc');
        console.log(data_arr);
        console.log(this.state.sprzedaz_by_recepta);
        let rdata = [];
        for (var i = 0; i < data_arr.length; i++) {
            var r = data_arr[i];
            var row = {
                name: r.WymaganaRecepta ? "Recepta" : "Brak recepty",
                value: r.Liczba
            }
            rdata.push(row);
        }

        return rdata;
    }

    onPieEnter = (data, index) => {
        console.log("Pie Charts");
        console.log(index);
        this.setState({
            activeIndex: index,
        });
    };


    create_map() {
        console.log("create_map");
        let rows = [];
        let init_data = this.state.dates_by_month;
        for (let a = 0; a < init_data.length; a++) {
            console.log("for render " + a)
            const r_data = this.get_data_recepta_chart(a);
            const p_data = this.get_data_payment_chart(a);
            console.log("data");
            console.log(r_data);
            console.log(p_data);
            let obj =
                <Row>
                    <Col>
                        Miesiąc: {init_data[a].month}
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart height={250}>
                                <Pie
                                    data={r_data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    isAnimationActive={false}
                                    label={({
                                        cx,
                                        cy,
                                        midAngle,
                                        innerRadius,
                                        outerRadius,
                                        value,
                                        index
                                    }) => {
                                        console.log("handling label?");
                                        const RADIAN = Math.PI / 180;
                                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                        return (
                                            <text
                                                x={x}
                                                y={y}
                                                fill="#8884d8"
                                                textAnchor={x > cx ? "start" : "end"}
                                                dominantBaseline="central"
                                            >
                                                {r_data[index].name} ({value})
                                        </text>
                                        );
                                    }}
                                >
                                    {
                                        r_data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                                    }
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col>
                        Typ Opłaty
                    <PieChart width={500} height={400}>
                            <Pie
                                activeIndex={this.state.activeIndex}
                                activeShape={({
                                    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
                                    fill, payload, percent, value
                                }) => {
                                    const RADIAN = Math.PI / 180;
                                    const sin = Math.sin(-RADIAN * midAngle);
                                    const cos = Math.cos(-RADIAN * midAngle);
                                    const sx = cx + (outerRadius + 10) * cos;
                                    const sy = cy + (outerRadius + 10) * sin;
                                    const mx = cx + (outerRadius + 30) * cos;
                                    const my = cy + (outerRadius + 30) * sin;
                                    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                                    const ey = my;
                                    const textAnchor = cos >= 0 ? 'start' : 'end';

                                    return (
                                        <g>
                                            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                innerRadius={innerRadius}
                                                outerRadius={outerRadius}
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                fill={fill}
                                            />
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                innerRadius={outerRadius + 6}
                                                outerRadius={outerRadius + 10}
                                                fill={fill}
                                            />
                                            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                                            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
                                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                                                {`(${(percent * 100).toFixed(2)}%)`}
                                            </text>
                                        </g>
                                    );
                                }}
                                data={p_data}
                                cx={200}
                                cy={200}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onMouseEnter={this.onPieEnter}
                            />
                        </PieChart>
                    </Col>
                </Row>
            console.log(obj);
            rows.push(obj);
        }
        console.log("end map");
        console.log(rows);
        this.setState({ graphs: rows });

    }


    render() {
        return (
            <Container fluid>
                {this.state.graphs.map(function (object, i) {
                    return <div key={i}>
                        {object}
                    </div>;
                })
                }
            </Container>
        );
    }
}


export default connect()(Sales_Charts);