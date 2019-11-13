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
        
  </Layout>
);
