import React, {Component} from 'react';
import {Link} from "react-router-dom";
// import logo from '../logo.svg';
import '../stylesheets/Header.css';

class Header extends Component {

  navTo(uri) {
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div className="App-header">
        <Link to='/'>Udacitrivia</Link>
        <Link to='/'>List</Link>
        <Link to='/add'>Add</Link>
        <Link to='/play'>Play</Link>
      </div>
    );
  }
}

export default Header;
