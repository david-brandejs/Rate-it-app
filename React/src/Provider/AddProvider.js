import React, { Component } from 'react';
import { API_URL } from './../constants';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import history from '../history';

class AddProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            img: '',
            description: '',
            info: '',
            website: '',
            street: '',
            city: '',
            postalCode: '',
            country: ''
        };
    }
    componentDidMount() {
        $(document).ready(function() {
            $('input#description, textarea#info').characterCounter();
        });
    }
    saveProvider(e) {
        if((this.state.name !== '' && this.state.street !== '' && this.state.city !== '' && 
            this.state.description !== '' && this.state.country !== '') && 
            this.state.description.length <= 100 && this.state.info.length <= 500) {
            
        //prevent the form submitting 
        e.preventDefault();
        
            const { authFetch } = this.props.auth;
            authFetch(`${API_URL}/providers`, {
                method: "POST",
                body: JSON.stringify({
                    name: this.state.name,
                    img: this.state.img,
                    description: this.state.description,
                    info: this.state.info,
                    website: this.state.website,
                    address: {
                        street: this.state.street,
                        city: this.state.city,
                        postalCode: this.state.postalCode,
                        country: this.state.country
                    }
                  })
            }).then(data => {
                this.setState({ providers: data });
                history.replace('/');
            }).catch(error => this.setState({ providers: error }));
        }
    }
    handleChangeFor = (propertyName) => (event) => {
        const newChange = {
            [propertyName]: event.target.value
        };
        this.setState(newChange);
    }
    render() {
        const isEnabled = 
            this.state.name !== '' && this.state.street !== '' && this.state.city !== '' && 
            this.state.description !== '' && this.state.country !== '' && 
            this.state.description.length <= 100 && this.state.info.length <= 500;
  
      return (
        <div className="container">
            <br/>
            <div className="nav-wrapper nav-breadcrumbs white">
                <div className="col s12">
                    <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                    <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Add Provider</b></Link>
                </div>
            </div>

            <h1>Add Provider</h1>

            <div className="row">
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">person</i>
                            <input id="name" type="text" required="true" aria-required="true" className="validate" value={ this.state.name } onChange={ this.handleChangeFor('name') }/>
                            <label htmlFor="name">Name <span className="red-text">*</span></label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">description</i>
                            <input id="description" data-length="100" type="text" required="true" aria-required="true" className="validate" value={ this.state.description } onChange={ this.handleChangeFor('description') }/>
                            <label htmlFor="description" data-error="Too many characters!">Description <span className="red-text">*</span></label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">info_outline</i>
                            <textarea id="info" data-length="500" value={ this.state.info } onChange={ this.handleChangeFor('info') } className="materialize-textarea"></textarea>
                            <label htmlFor="info">Info</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">image</i>
                            <input id="img" type="text" value={ this.state.img } onChange={ this.handleChangeFor('img') } className="validate"/>
                            <label htmlFor="img">Image URL</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <i className="material-icons prefix">web</i>
                            <input id="website" type="text" value={ this.state.website } onChange={ this.handleChangeFor('website') } className="validate"/>
                            <label htmlFor="website">Website</label>
                        </div>
                    </div>

                    <br/>
                    <h2><i className="small material-icons prefix">location_on</i> Address</h2>
                    <div className="row">
                        <div className="input-field col s6">
                            <input id="street" type="text" required="true" aria-required="true" className="validate" value={ this.state.street } onChange={ this.handleChangeFor('street') }/>
                            <label htmlFor="street">Street <span className="red-text">*</span></label>
                        </div>
                        <div className="input-field col s6">
                            <input id="city" type="text" required="true" aria-required="true" className="validate" value={ this.state.city } onChange={ this.handleChangeFor('city') }/>
                            <label htmlFor="city">City <span className="red-text">*</span></label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <input id="postalCode" type="text" className="validate" value={ this.state.postalCode } onChange={ this.handleChangeFor('postalCode') }/>
                            <label htmlFor="postalCode">Postal Code</label>
                        </div>
                        <div className="input-field col s6">
                            <input id="country" type="text" required="true" aria-required="true" className="validate" value={ this.state.country } onChange={ this.handleChangeFor('country') }/>
                            <label htmlFor="country">Country <span className="red-text">*</span></label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12 informative-font-size">
                        <p><span className="red-text">*</span> required field</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s12">
                            <button type="submit" onClick={ this.saveProvider.bind(this) } disabled={ !isEnabled } className="waves-effect waves-light btn">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      );
    }
}

export default AddProvider;