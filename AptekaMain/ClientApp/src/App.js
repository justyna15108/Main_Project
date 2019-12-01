import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Artykuls from './components/Artykuls/Artykuls';
import Add_Scans from './components/Scans/Add_Scans';
import Scans from './components/Scans/Scans';
import Login_Form from './components/Login/Login_Form';
import Edit_Artykul from './components/Artykuls/Edit_Artykul';
import ShowArtykul from './components/Artykuls/ShowArtykul';
import Users from './components/Users/Users';
import Edit_User from './components/Users/Edit_User';
import Listy_Brakow from './components/ListaBraki/Listy_Brakow';
import Show_Lista_Brakow from './components/ListaBraki/Show_Lista_Brakow';
import Create_Zamowienie from './components/Zamowienia/Create_Zamowienie';
import Zamowienia from './components/Zamowienia/Zamowienia';
import Show_Zamowienie from './components/Zamowienia/Show_Zamowienie';
import Show_Partia from './components/Partia/Show_Partia';
import Accept_Partia from './components/Partia/Accept_Partia';
import Batches from './components/Sprzedaz/Batches';
import './theme/bootstrap_red.css';
import Hurtownie from './components/Hurtownie/Hurtownie';
import Edit_Hurtownia from './components/Hurtownie/Edit_Hurtownia';


export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
        <Route path='/artykuls' component={Artykuls} />
        <Route exact path='/artykul_edit/:id' component={Edit_Artykul} />
        <Route exact path='/artykul_show/:id' component={ShowArtykul} />
        <Route path='/add_scans' component={Add_Scans} />
        <Route path='/scans' component={Scans} />
        <Route path='/login' component={Login_Form} />
        <Route exact path='/users' component={Users} />
        <Route exact path='/user_edit/:id' component={Edit_User} />
        <Route exact path='/listy_brakow/' component={Listy_Brakow} />
        <Route exact path='/lista_brakow_show/' component={Show_Lista_Brakow} />
        <Route exact path='/create_zamowienie/' component={Create_Zamowienie} />
        <Route exact path='/show_zamowienie/:id' component={Show_Zamowienie} />
        <Route exact path='/zamowienia/' component={Zamowienia} />
        <Route exact path='/show_partia/:id' component={Show_Partia} />
        <Route exact path='/accept_partia' component={Accept_Partia} />
        <Route exact path='/batches/:id' component={Batches} />
        <Route exact path='/hurtownie' component={Hurtownie} />
        <Route exact path='/hurtownia_edit/:id' component={Edit_Hurtownia} />
        
  </Layout>
);
