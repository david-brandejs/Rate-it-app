import React, { Component } from 'react';
import './App.css';
import { API_URL } from './constants';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import 'materialize-autocomplete';

class App extends Component {
    constructor(props) {
        super(props);
        
        if(this.props.auth.isAuthenticated()) {
            this.loadSecuredProviders(0, '');
            
            this.state = {
                name: ''
            };
            this.handleNameChange = this.handleNameChange.bind(this);
        }
    }
    handleNameChange(e) {
        this.setState({ name: e.target.value });
        
        this.loadSecuredProviders(0, e.target.value);
    }
    componentWillMount() {
        this.setState({ 
            providers: [], 
            count: null,
            numberOfResults: 10 
        });
    }
    componentDidMount() {
        const { authFetch } = this.props.auth;
        
        //var single = $('#singleInput').materialize_autocomplete({
        $('#singleInput').materialize_autocomplete({
//            limit: 20,
            limit: 0,
            multiple: {
                enable: false
            },
            dropdown: {
                el: '#singleDropdown',
                itemTemplate: '<li class="ac-item" data-id="<%= item._id %>" data-text=\'<%= item.text %>\'><a href="javascript:void(0)"><%= item.text %></a></li>'
            },
            onSelect: function (item) {
                console.log(item.text + ' was selected');
                
                authFetch(`${API_URL}/providers/0/` + item.text)
                  .then(data => this.setState({ providers: data }))
                  .catch(error => this.setState({ providers: error }));

                authFetch(`${API_URL}/providersCount/` + item.text)
                  .then(data => { 
                      
//                    if(data[0].length === 0) {
                        this.setState({ count: data[0].count });
                    
                        let pag = [];

                        pag.push(<li className="disabled" key={ 0 }>
                                    <a href="#!"><i className="material-icons">chevron_left</i></a>
                                </li>);

                        for (let i = 0; i < Math.ceil(data[0].count/this.state.numberOfResults); i++) {  
                            if(i === 0) 
                                pag.push(<li className="active" key={ i+1 }><a href="#" onClick={this.loadSecuredProviders.bind(this, i, this.state.name)}> { i+1 } </a></li>);
                            else
                                pag.push(<li className="waves-effect" key={ i+1 }><a href="#" onClick={this.loadSecuredProviders.bind(this, i, this.state.name)}> { i+1 } </a></li>);
                        }

                        if(0 === Math.ceil(data[0].count/this.state.numberOfResults)-1)
                            pag.push(<li className="disabled" key={ Math.ceil(data[0].count/this.state.numberOfResults)+1 }>
                                        <a href="#!"><i className="material-icons">chevron_right</i></a>
                                    </li>);
                        else
                            pag.push(<li className="waves-effect" key={ Math.ceil(data[0].count/this.state.numberOfResults)+1 }>
                                        <a href="#" onClick={this.loadSecuredProviders.bind(this, 1, this.state.name)}><i className="material-icons">chevron_right</i></a>
                                    </li>);

                        this.setState({ pagination: pag });
                        this.setState({ name: item.text });
//                    }
                    
                    
                })
                  .catch(error => this.setState({ count: error }));
            }.bind(this),
            getData: function (value, callback) {
                
                authFetch(`${API_URL}/providersNames/` + value)
                    .then(data => { 
                        callback(value, data);
                    })
                    .catch(error => this.setState({ providers: error }));
            }
        });
    }
    loadSecuredProviders(offset, text) {
        const { authFetch } = this.props.auth;
        authFetch(`${API_URL}/providers/` + offset + `/` + text)
          .then(data => this.setState({ providers: data }))
          .catch(error => this.setState({ providers: error }));
  
        authFetch(`${API_URL}/providersCount/` + text)
          .then(data => { 
            this.setState({ count: data });
            
            if(data.length !== 0) {
                if(text !== '')
                    data = data[0].count;
            
                let pag = [];

                if(offset === 0)
                    pag.push(<li className="disabled" key={ 0 }>
                                <a href="#!"><i className="material-icons">chevron_left</i></a>
                            </li>);
                else
                    pag.push(<li className="waves-effect" key={ 0 }>
                                <a href="#" onClick={this.loadSecuredProviders.bind(this, offset-1, this.state.name)}><i className="material-icons">chevron_left</i></a>
                            </li>);

                for (let i = 0; i < Math.ceil(data/this.state.numberOfResults); i++) {  
                    if(i === offset) 
                        pag.push(<li className="active" key={ i+1 }><a href="#" onClick={this.loadSecuredProviders.bind(this, i, this.state.name)}> { i+1 } </a></li>);
                    else
                        pag.push(<li className="waves-effect" key={ i+1 }><a href="#" onClick={this.loadSecuredProviders.bind(this, i, this.state.name)}> { i+1 } </a></li>);
                }

                if(offset === Math.ceil(data/this.state.numberOfResults)-1)
                    pag.push(<li className="disabled" key={ Math.ceil(data/this.state.numberOfResults)+1 }>
                                <a href="#!"><i className="material-icons">chevron_right</i></a>
                            </li>);
                else
                    pag.push(<li className="waves-effect" key={ Math.ceil(data/this.state.numberOfResults)+1 }>
                                <a href="#" onClick={this.loadSecuredProviders.bind(this, offset+1, this.state.name)}><i className="material-icons">chevron_right</i></a>
                            </li>);

                this.setState({ pagination: pag });
            } else
                this.setState({ pagination: 'No providers found.' });
        })
          .catch(error => this.setState({ count: error }));
    }
    render() {
        const { isAuthenticated } = this.props.auth;

        let providerNodes = this.state.providers.map(provider => {
            return (
                <div className="card horizontal hoverable" key={ provider._id }>
                    <div className="card-image">
                        <img alt="Provider img" src={ provider.img ? provider.img : `../user_icon.png` }/>
                    </div>
                    <div className="card-stacked">
                        <div className="card-content">
                            <p><b>{ provider.name }</b></p>
                            <p><i className="material-icons card-icon">description</i>
                                { provider.description }
                            </p>
                            <p><i className="material-icons card-icon">location_on</i>
                                { provider.address.street + ', ' + provider.address.city + ', ' }
                                { (provider.address.postalCode ? provider.address.postalCode + ', ' : '') + provider.address.country }
                            </p>
                            <p><i className="material-icons card-icon star-rate">star_rate</i>
                                { provider.rating.toFixed(1) }
                            </p>
                        </div>
                        <div className="card-action">
                            <Link to={'/provider/' + provider._id}>Information</Link>
                            <a href={ provider.website }>Website</a>
                            <Link to={'/add-review/' + provider._id} className="right">New Review</Link>
                        </div>
                    </div>
                </div>
            );
        });
        
        return (
          <div className="container">
              {
                !isAuthenticated() && (
                    <div className="center">
                        <br/><br/><br/><br/>
                        
                        <h1 className="red-text lighten-1">Rate IT is an IT service rating app.</h1><br/><br/>
                        <h2>It allows anyone to rate IT service providers over the entire world.</h2>
                        <h2>That includes web application, digital marketing, custom software and any other IT service provider.</h2>
                        
                        <br/><br/><br/>
                        
                        <h1 className="red-text lighten-1">How does it work?</h1>
                        <br/><br/><br/><br/>
                        
                        <div className="row red-text lighten-1 ">
                            <div className="col s4">
                                <i className="large material-icons">input</i>
                            </div>
                            <div className="col s4 center-align">
                                <i className="large material-icons">person</i>
                            </div>
                            <div className="col s4 center-align">
                                <i className="large material-icons">done_all</i>
                            </div>
                        </div>
                        
                        <div className="row">
                            <div className="col s4">
                                <h2>Log in to rate providers</h2>
                            </div>
                            <div className="col s4">
                                <h2>Pick a provider you wish to rate</h2>
                            </div>
                            <div className="col s4">
                                <h2>Start rating!</h2>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                isAuthenticated() && (
                    <div>
                        { providerNodes == false &&
                            <div className="progress">
                                <div className="indeterminate"></div>
                            </div>
                        }
                        <br/>
                        <Link to={'/add-provider'} className="waves-effect waves-light btn">Add provider</Link>
                        
                        <br/><br/>
                        
                        <div className="row">
                            <div className="input-field col s12">
                                <div className="autocomplete" id="single">
                                    <div className="ac-input">
                                        <input type="text" id="singleInput" key={this.state.name} autoFocus placeholder="Enter text to filter results" value={ this.state.name } 
                                        onChange={ this.handleNameChange } data-activates="singleDropdown" data-beloworigin="true" autoComplete="off"/>
                                    </div>
                                    <ul id="singleDropdown" className="dropdown-content ac-dropdown"></ul>
                                </div>
                                <label className="active" htmlFor="singleInput">Name Filter</label>
                            </div>
                        </div>
                        
                        { providerNodes }
                                
                        <br/>
                        <ul className="pagination center"> 
                            { this.state.pagination }
                        </ul>
                    </div>
                )
            }
          </div>
        );
    }
}

export default App;