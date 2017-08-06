import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

window.jQuery = window.$ = require('jquery');
require('materialize-css');

class Header extends Component {
    componentDidMount() {
        $(".button-collapse").sideNav();
    }
    
    goTo(route) {
        this.props.history.replace(`/${route}`);
    }

    login() {
        this.props.auth.login();
    }

    logout() {
        this.props.auth.logout();
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        
        return (
            <nav>
                <div className="container nav-wrapper">
                    <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                    <a href="" onClick={this.goTo.bind(this, '')} className="brand-logo"><i className="material-icons">done_all</i> Rate IT</a>
                    <ul className="right hide-on-med-and-down">
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.goTo.bind(this, 'my-reviews')}>My Reviews</a></li>
                            )
                        }
                        
                        <li><a onClick={this.goTo.bind(this, 'author')}>Author</a></li>
                        
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.goTo.bind(this, 'docs')}>Docs</a></li>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.logout.bind(this)}>Log Out</a></li>
                            )
                        }
                        {
                            !isAuthenticated() && (
                                <li><a onClick={this.login.bind(this)}>Log In</a></li>
                            )
                        }
                    </ul>
                    <ul className="side-nav" id="mobile-demo">
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.goTo.bind(this, 'my-reviews')}>My Reviews</a></li>
                            )
                        }
                        
                        <li><a onClick={this.goTo.bind(this, 'author')}>Author</a></li>
                        
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.goTo.bind(this, 'docs')}>Docs</a></li>
                            )
                        }
                        {
                            isAuthenticated() && (
                                <li><a onClick={this.logout.bind(this)}>Log Out</a></li>
                            )
                        }
                        {
                            !isAuthenticated() && (
                                <li><a onClick={this.login.bind(this)}>Log In</a></li>
                            )
                        }
                    </ul>
                </div>
            </nav>
        );
    }
};

export default Header;
