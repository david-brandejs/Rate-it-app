import React, { Component } from 'react';
import { API_URL } from './../constants';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Moment from 'react-moment';

class Provider extends Component {
    componentDidMount() {
        $(document).ready(function(){
            $('.collapsible').collapsible();
        });
    }  
    componentWillMount() {
        this.setState({ provider: {
            address: []
            }
        });
        this.setState({ reviews: [{
            providerRating: [],
            serviceRating: []
            }]
        });
        
        if(this.props.auth) {
            const { authFetch } = this.props.auth;
            authFetch(`${API_URL}` + this.props.location.pathname)
                .then(data => this.setState({ provider: data }))
                .catch(error => this.setState({ provider: error }));
      
            authFetch(`${API_URL}` + this.props.location.pathname.replace("/provider", "/reviews"))
                .then(data => this.setState({ reviews: data }))
                .catch(error => this.setState({ reviews: error }));
        }
    }    
    render() {
        const { provider } = this.state;
        var key = 0;
        
        let reviewNodes = this.state.reviews.map(review => {
            key += 1;
            var providerRating = ((review.providerRating.communication + review.providerRating.management + review.providerRating.integrity +
                review.providerRating.reliability + review.providerRating.availability)/5).toFixed(1);
            var serviceRating = ((review.serviceRating.timeliness + review.serviceRating.quality + review.serviceRating.costs)/3).toFixed(1);
            var overallRating = ((review.providerRating.communication + review.providerRating.management + review.providerRating.integrity +
                                    review.providerRating.reliability + review.providerRating.availability + review.serviceRating.timeliness + 
                                    review.serviceRating.quality + review.serviceRating.costs)/8).toFixed(1);
                            
            return (
                <li key={ key }>
                    <div className="collapsible-header">
                        <b>{ key + '. ' + review.serviceType }</b> - created <Moment format="D. M. YYYY - HH:mm">{ review.createdAt }</Moment>
                    </div>
                    <div className="collapsible-body">
                        <div className="row valign-wrapper">
                            <div className="col s2 offset-s1">
                                <b>Overall Rating</b>
                            </div>
                            <div className="col m2 s1">
                                <i className="material-icons card-icon star-rate">star_rate</i><b>
                                    { overallRating }
                                </b>
                            </div>
                            <div className="col s2 offset-m1">
                                <b>Satisfaction</b>
                            </div>
                            <div className="col m3 s3">
                                <span className="center-align">
                                    <i className="material-icons card-icon star-rate">star_rate</i><b>{ review.satisfaction }</b>
                                </span>
                            </div>
                        </div>
                        <div className="divider"></div><br/>
                        
                        <div className="row valign-wrapper">
                            <div className="col m2 s4">
                                <b>Provider Rating</b><br/><i className="material-icons card-icon star-rate">star_rate</i><b>
                                    { providerRating }
                                </b>
                            </div>
                            <div className="col m2 s4">
                                Communication<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.communication }</b>
                            </div>
                            <div className="col m2 s4">
                                Management<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.management }</b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Integrity<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.integrity }</b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Reliability<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.reliability }</b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Availability<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.availability }</b>
                            </div>
                        </div>
                        
                        <div className="row valign-wrapper hide-on-med-and-up">
                            <div className="col s4">
                                Integrity<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.integrity }</b>
                            </div>
                            <div className="col s4">
                                Reliability<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.reliability }</b>
                            </div>
                            <div className="col s4">
                                Availability<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.providerRating.availability }</b>
                            </div>
                        </div>

                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col m2 s6">
                                <b>Service Rating</b><br/><i className="material-icons card-icon star-rate">star_rate</i><b>
                                    { serviceRating }
                                </b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Timeliness<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.timeliness }</b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Quality<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.quality }</b>
                            </div>
                            <div className="col m2 hide-on-small-only">
                                Costs<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.costs }</b>
                            </div>
                            <div className="col m4 s6">
                            </div>
                        </div>
                        
                        <div className="row valign-wrapper hide-on-med-and-up">
                            <div className="col s4">
                                Timeliness<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.timeliness }</b>
                            </div>
                            <div className="col s4">
                                Quality<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.quality }</b>
                            </div>
                            <div className="col s4">
                                Costs<br/><i className="material-icons card-icon star-rate">star_rate</i><b>{ review.serviceRating.costs }</b>
                            </div>
                        </div>

                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col s3 center-align">
                                <b>Comment</b>
                            </div>
                            <div className="col s9">
                                { review.comment}
                            </div>
                        </div>
                    </div>
                </li>
            );
        });

        return (
            <div className="container">
                <br/>
                <div className="nav-wrapper nav-breadcrumbs white">
                    <div className="col s12">
                        <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                        <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Provider Info</b></Link>
                    </div>
                </div>
                
                <div className="row valign-wrapper">
                    <div className="col s5">
                        <h1>Provider Information</h1>
                    </div>
                    <div className="col s7 right-align">
                        <Link to={ this.props.location.pathname.replace("/provider", "/add-review") } className="waves-effect waves-light btn">New review</Link>
                    </div>
                </div>
                
                <div className="col s12 m8 offset-m2 l6 offset-l3">
                    <div className="card-panel grey lighten-5 z-depth-1">
                        <div className="row valign-wrapper">
                            <div className="col s3">
                                <i className="card-icon material-icons prefix">person</i>
                                <b>Name</b>
                            </div>
                            <div className="col s9">
                                { provider.name }
                            </div>
                        </div>
                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col s3">
                                <i className="card-icon material-icons prefix">description</i>
                                <b>Description</b>
                            </div>
                            <div className="col s9">
                                { provider.description }
                            </div>
                        </div>
                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col s3">
                                <i className="card-icon material-icons prefix">info_outline</i>
                                <b>Info</b>
                            </div>
                            <div className="col s9">
                                { provider.info }
                            </div>
                        </div>
                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col s3">
                                <i className="card-icon material-icons prefix">web</i>
                                <b>Website</b>
                            </div>
                            <div className="col s9">
                                <a href={ provider.website }>{ provider.website }</a>
                            </div>
                        </div>
                        <div className="divider"></div><br/>
                        <div className="row valign-wrapper">
                            <div className="col s3">
                                <i className="card-icon material-icons prefix">location_on</i>
                                <b>Address</b>
                            </div>
                            <div className="col s9">
                                <a href={ 'https://www.google.com/maps/search/?api=1&query=' + provider.address.street + '+' + 
                                        provider.address.city + '+' + provider.address.country }>
                                    { 
                                      (provider.address.street ? provider.address.street + ', ' : '') +
                                      (provider.address.city ? provider.address.city + ', ' : '') +
                                      (provider.address.postalCode ? provider.address.postalCode + ', ' : '') + 
                                      (provider.address.country ? provider.address.country : '') 
                                    }
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <br/>
                <h2>Reviews</h2>
                <ul className="collapsible popout" data-collapsible="expandable">
                    { reviewNodes.length !== 0 ? reviewNodes : <span className="teal-text">No reviews yet.</span> }
                </ul><br/>
            </div>
        );
    }
};

export default Provider;