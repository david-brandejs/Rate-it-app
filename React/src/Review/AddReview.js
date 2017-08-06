import React, { Component } from 'react';
import { API_URL } from './../constants';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import history from '../history';

class AddReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            providerRating: {
                communication: '',
                management: '',
                integrity: '',
                reliability: '',
                availability: ''
            },
            serviceType: '',
            serviceRating: {
                timeliness: '',
                quality: '',
                costs: ''
            },
            comment: '',
            satisfaction: ''
        };
    }
    componentDidMount() {
        $(document).ready(function() {
            $('textarea#comment').characterCounter();
        });
    }
    componentWillMount() {
        this.setState({ profile: {} });
        
        const { userProfile, getProfile } = this.props.auth;
        if (!userProfile) {
            getProfile((err, profile) => {
                this.setState({ profile });
            });
        } else {
            this.setState({ profile: userProfile });;
        }
    }
    saveReview(e) {
        if(this.state.serviceType !== '' && this.state.comment !== '' && this.state.comment.length <= 500 &&
            this.state.communication > 0 && this.state.management > 0 && this.state.integrity > 0 && 
            this.state.reliability > 0 && this.state.availability > 0 && this.state.timeliness > 0 && 
            this.state.quality > 0 && this.state.costs > 0 && this.state.satisfaction > 0 && 
            this.state.communication < 11 && this.state.management < 11 && this.state.integrity < 11 && 
            this.state.reliability < 11 && this.state.availability < 11 && this.state.timeliness < 11 && 
            this.state.quality < 11 && this.state.costs < 11 && this.state.satisfaction < 11) {
            
            //prevent the form submitting 
            e.preventDefault();
        
            const { authFetch } = this.props.auth;
            authFetch(`${API_URL}` + this.props.location.pathname.replace("/add-review", "/reviews"), {
                method: "POST",
                body: JSON.stringify({
                    user_id: this.state.profile.sub,
                    provider_id: this.props.location.pathname.replace("/add-review/", ""),
                    providerRating: {
                        communication: this.state.communication,
                        management: this.state.management,
                        integrity: this.state.integrity,
                        reliability: this.state.reliability,
                        availability: this.state.availability
                    },
                    serviceType: this.state.serviceType,
                    serviceRating: {
                        timeliness: this.state.timeliness,
                        quality: this.state.quality,
                        costs: this.state.costs
                    },
                    comment: this.state.comment,
                    satisfaction: this.state.satisfaction
                })
            })
              .then(reviewData => {
                    this.setState({ review: reviewData });
                    
                    authFetch(`${API_URL}` + this.props.location.pathname.replace("/add-review", "/reviews-aggregate"))
                        .then(reviewsData => { 
                            this.setState({ reviews: reviewsData });
                            
                            authFetch(`${API_URL}` + this.props.location.pathname.replace("/add-review", "/provider"), {
                                method: "PUT",
                                body: JSON.stringify({
                                    rating: reviewsData[0].totalAverage
                                })
                            }).then(data => {
                                this.setState({ providers: data });
                                history.replace(this.props.location.pathname.replace("/add-review", "/provider"));
                            }).catch(error => this.setState({ reviews: error }));
                        })
                        .catch(error => this.setState({ provider: error }));
              })
              .catch(error => this.setState({ reviews: error }));
        }
    }
    handleChangeForString = (propertyName) => (event) => {
        const newChange = {
            [propertyName]: event.target.value
        };
        this.setState(newChange);
    }
    handleChangeForNumber = (propertyName) => (event) => {
        let newChange = {};
        
        if (event.target.value > 0 && event.target.value < 11) {
            newChange = {
                [propertyName]: event.target.value
            };
        } else if (event.target.value === '') {
            newChange = {
                [propertyName]: ''
            };
        } else if (event.target.value < 1) {
            newChange = {
                [propertyName]: 1
            };
        }
        
        this.setState(newChange);
    }
    render() {
        const isEnabled = 
            this.state.serviceType !== '' && this.state.comment !== '' && this.state.comment.length <= 500 &&
            this.state.communication > 0 && this.state.management > 0 && this.state.integrity > 0 && 
            this.state.reliability > 0 && this.state.availability > 0 && this.state.timeliness > 0 && 
            this.state.quality > 0 && this.state.costs > 0 && this.state.satisfaction > 0 && 
            this.state.communication < 11 && this.state.management < 11 && this.state.integrity < 11 && 
            this.state.reliability < 11 && this.state.availability < 11 && this.state.timeliness < 11 && 
            this.state.quality < 11 && this.state.costs < 11 && this.state.satisfaction < 11;
  
        return (
            <div className="container">
                <br/>
                <div className="nav-wrapper nav-breadcrumbs white">
                    <div className="col s12">
                        <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                        <Link to={ this.props.location.pathname.replace("/add-review", "/provider") } className="breadcrumb teal-text lighten-2">Provider Info</Link>
                        <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Add Review</b></Link>
                    </div>
                </div>

                <h1>Add Review</h1>

                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="serviceType" type="text" required="true" aria-required="true" className="validate" 
                                    value={ this.state.serviceType } onChange={ this.handleChangeForString('serviceType') }/>
                                <label htmlFor="serviceType">Type of service <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <div className="row">
                          <div className="input-field col s12">
                            <textarea id="comment" data-length="500" required="true" aria-required="true" 
                                value={ this.state.comment } onChange={ this.handleChangeForString('comment') } className="materialize-textarea"></textarea>
                            <label htmlFor="comment">Comment <span className="red-text">*</span></label>
                          </div>
                        </div>

                        <h2>Provider Rating</h2>
                        <p><i>Pick a number from 1 to 10. A higher value represents higher satisfaction with the factor.</i></p>
                        <br/>

                        <div className="row">
                            <div className="input-field col m2 s4 offset-m1">
                                <input id="communication" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.communication } onChange={ this.handleChangeForNumber('communication') }/>
                                <label htmlFor="communication">Communication <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="management" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.management } onChange={ this.handleChangeForNumber('management') }/>
                                <label htmlFor="management">Management <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="integrity" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.integrity } onChange={ this.handleChangeForNumber('integrity') }/>
                                <label htmlFor="integrity">Integrity <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="reliability" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.reliability } onChange={ this.handleChangeForNumber('reliability') }/>
                                <label htmlFor="reliability">Reliability <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="availability" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.availability } onChange={ this.handleChangeForNumber('availability') }/>
                                <label htmlFor="availability">Availability <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <br/>
                        <h2>Service Rating</h2>
                        <p><i>Pick a number from 1 to 10. A higher value represents higher satisfaction with the factor.</i></p>
                        <br/>

                        <div className="row">
                            <div className="input-field col s4">
                                <input id="timeliness" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.timeliness } onChange={ this.handleChangeForNumber('timeliness') }/>
                                <label htmlFor="timeliness">Timeliness <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col s4">
                                <input id="quality" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.quality } onChange={ this.handleChangeForNumber('quality') }/>
                                <label htmlFor="quality">Quality <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col s4">
                                <input id="costs" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.costs } onChange={ this.handleChangeForNumber('costs') }/>
                                <label htmlFor="costs">Costs <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <br/>
                        <h2>Satisfaction</h2>
                        <p><i>Pick a number from 1 to 10. A higher value represents higher overall satisfaction.</i></p>
                        <br/>

                        <div className="row">
                            <div className="input-field col s6 offset-s3">
                                <input id="satisfaction" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.satisfaction } onChange={ this.handleChangeForNumber('satisfaction') }/>
                                <label htmlFor="satisfaction">Satisfaction <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col s12 informative-font-size">
                            <p><span className="red-text">*</span> required field</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <button type="submit" onClick={ this.saveReview.bind(this) } disabled={ !isEnabled } className="waves-effect waves-light btn">Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default AddReview;