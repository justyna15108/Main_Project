import React from 'react';
import { connect } from 'react-redux';
import {
    Collapse,
    Container,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { Link } from 'react-router-dom';
import './NavMenu.css';

class NavMenu extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    render() {
        return (
            <header>
                <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow navbar-dark bg-dark" dark>
                    <Container fluid>
                        <NavbarBrand tag={Link} to="/">Apteka</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} className="mr-2" />
                        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
                            <ul className="navbar-nav flex-grow">
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Towar
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/artykuls">Artykuły</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Zamowienia
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/lista_brakow_show">Listy Braków</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/create_zamowienie">Nowe Zamowienie</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/zamowienia">Zamowienia</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Sprzedaż
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/batches/1">Sprzedaz w aptece</NavLink>
                                        </DropdownItem>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/sprzedazy">Sprzedazy</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Administrowanie
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/users">Users</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        Charts
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem>
                                            <NavLink tag={Link} className="text-dark" to="/sales_charts">Sprzedaz</NavLink>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                                {!this.props.auth.isAuthenticated && 
                                <NavItem>
                                    <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
                                </NavItem>
                                }
                                {this.props.auth.isAuthenticated &&
                                    <NavItem>
                                    <NavLink tag={Link} className="text-dark" to={"/user_edit/" + this.props.auth.user.pracownikIdPracownika}> Twoj Profil </NavLink>
                                    </NavItem>
                                }
                            </ul>
                        </Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return { auth: state.auth }
}

export default connect(mapStateToProps)(NavMenu);
