import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionCreators } from '../../store/user_Auth';

class Logout extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var end_date = new Date();
        fetch("api/UserSessions/" + this.props.user.idSession, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idSession: this.props.user.idSession,
                active: false,
                access: this.props.user.access, 
                pracownikIdPracownika: this.props.user.pracownikIdPracownika
            })
        });
        this.props.logoutUser();
    }

    render() {
        return (
            <div>
                <Redirect to='/' />
            </div>
        );
    }

}

export default connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Logout);