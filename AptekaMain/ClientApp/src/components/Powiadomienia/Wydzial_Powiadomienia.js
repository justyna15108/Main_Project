import React, { Component } from 'react';
import Powiadomienie_List from './Powiadomienie_List';
import Pagination from "react-pagination-js";
import "react-pagination-js/dist/styles.css";

class Wydzial_Powiadomienia extends Component {

    constructor(props) {
        super(props);
        this.state = {
            powiadomienia: [],
            page_length: 6,
            skip: 0,
            limit: 0,
            currentPage: 1,
            pageCount: 1,
        };

        this.get_data = this.get_data.bind(this);
    }

    componentDidMount() {
        this.get_data();
    }

    get_data() {
        fetch('api/Powiadomienies?$apply=aggregate($count as limit)')
            .then(response => response.json())
            .then(data => {
                this.setState({ limit: data[0].limit });
            });
        fetch('api/Powiadomienies?$orderby=idPowiadomienie desc&$top=' + this.state.page_length + '&$skip=' + this.state.skip)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    powiadomienia: data,
                    pageCount: Math.ceil(this.state.limit / this.state.page_length),
                });
            });
    }


    refresh() {
        this.props.history.push("/users");
    }

    changeCurrentPage = numPage => {
        let real_num = numPage - 1;
        let offset = Math.ceil(real_num * this.state.page_length);
        this.setState({ skip: offset, currentPage: numPage }, () => {
            this.get_data();
        });
    };


    render() {
        return (
            <div className="commentBox">
                <Powiadomienie_List data={this.state.powiadomienia} />
                <Pagination
                    currentPage={this.state.currentPage}
                    totalSize={this.state.limit}
                    sizePerPage={this.state.page_length}
                    changeCurrentPage={this.changeCurrentPage}
                    theme="bootstrap"
                />
            </div>
        );
    }
}


export default Wydzial_Powiadomienia;