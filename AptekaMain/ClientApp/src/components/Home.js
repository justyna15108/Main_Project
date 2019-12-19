import React, { Component } from 'react';
import { connect } from 'react-redux';
import Wydzial_Powiadomienia from './Powiadomienia/Wydzial_Powiadomienia';
import { Col,Row } from 'reactstrap';
class Home extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col>
                        <p>Hello</p>
                        {!this.props.auth.isAuthenticated && <p>Please Log In</p>}
                        {this.props.auth.isAuthenticated && <p>Level {this.props.auth.user.access} User</p>}
                    </Col>

                    <Col>
                        {this.props.auth.isAuthenticated && <Wydzial_Powiadomienia />}
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { auth: state.auth }
}

export default connect(mapStateToProps)(Home);
