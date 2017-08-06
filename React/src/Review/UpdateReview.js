import React, { Component } from 'react';
import { API_URL } from './../constants';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import history from '../history';

class UpdateReview extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            provider_id: '',
            communication: '',
            management: '',
            integrity: '',
            reliability: '',
            availability: '',
            serviceType: '',
            timeliness: '',
            quality: '',
            costs: '',
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
        const { authFetch } = this.props.auth;
        
        authFetch(`${API_URL}` + this.props.location.pathname.replace("/update-review", "/review"))
            .then(data => { 
                this.setState({
                    provider_id: data.provider_id,
                    communication: data.providerRating.communication,
                    management: data.providerRating.management,
                    integrity: data.providerRating.integrity,
                    reliability: data.providerRating.reliability,
                    availability: data.providerRating.availability,
                    serviceType: data.serviceType,
                    timeliness: data.serviceRating.timeliness,
                    quality: data.serviceRating.quality,
                    costs: data.serviceRating.costs,
                    comment: data.comment,
                    satisfaction: data.satisfaction
                });
            })
            .catch(error => this.setState({ review: error }));
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
            authFetch(`${API_URL}` + this.props.location.pathname.replace("/update-review", "/review"), {
                method: "PUT",
                body: JSON.stringify({
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
                    
                    authFetch(`${API_URL}/reviews-aggregate/` + this.state.provider_id)
                        .then(reviewsData => { 
                            this.setState({ reviews: reviewsData });
                            
                            authFetch(`${API_URL}/provider/` + this.state.provider_id, {
                                method: "PUT",
                                body: JSON.stringify({
                                    rating: reviewsData[0].totalAverage
                                })
                            }).then(data => {
                                this.setState({ providers: data });
                                history.replace("/my-reviews");
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
                    <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Update Review</b></Link>
                  </div>
                </div>

                <h1>Update Review</h1>

                <div className="row">
                    <form className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <input id="serviceType" type="text" required="true" aria-required="true" className="validate" 
                                    value={ this.state.serviceType } onChange={ this.handleChangeForString('serviceType') }/>
                                <label htmlFor="serviceType" className={ this.state.serviceType ? 'active' : null }>Type of service <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <textarea id="comment" data-length="500" required="true" aria-required="true" 
                                    value={ this.state.comment } onChange={ this.handleChangeForString('comment') } className="materialize-textarea"></textarea>
                                <label htmlFor="comment" className={ this.state.comment ? 'active' : null }>Comment <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <h2>Provider Rating</h2>
                        <p><i>Pick a number from 1 to 10. A higher value represents higher satisfaction with the factor.</i></p>
                        <br/>

                        <div className="row">
                            <div className="input-field col m2 s4 offset-m1">
                                <input id="communication" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.communication } onChange={ this.handleChangeForNumber('communication') }/>
                                <label htmlFor="communication" className={ this.state.communication ? 'active' : null }>Communication <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="management" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.management } onChange={ this.handleChangeForNumber('management') }/>
                                <label htmlFor="management" className={ this.state.management ? 'active' : null }>Management <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="integrity" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.integrity } onChange={ this.handleChangeForNumber('integrity') }/>
                                <label htmlFor="integrity" className={ this.state.integrity ? 'active' : null }>Integrity <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="reliability" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.reliability } onChange={ this.handleChangeForNumber('reliability') }/>
                                <label htmlFor="reliability" className={ this.state.reliability ? 'active' : null }>Reliability <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col m2 s4">
                                <input id="availability" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.availability } onChange={ this.handleChangeForNumber('availability') }/>
                                <label htmlFor="availability" className={ this.state.availability ? 'active' : null }>Availability <span className="red-text">*</span></label>
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
                                <label htmlFor="timeliness" className={ this.state.timeliness ? 'active' : null }>Timeliness <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col s4">
                                <input id="quality" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.quality } onChange={ this.handleChangeForNumber('quality') }/>
                                <label htmlFor="quality" className={ this.state.quality ? 'active' : null }>Quality <span className="red-text">*</span></label>
                            </div>
                            <div className="input-field col s4">
                                <input id="costs" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.costs } onChange={ this.handleChangeForNumber('costs') }/>
                                <label htmlFor="costs" className={ this.state.costs ? 'active' : null }>Costs <span className="red-text">*</span></label>
                            </div>
                        </div>

                        <h2>Satisfaction</h2>
                        <p><i>Pick a number from 1 to 10. A higher value represents higher overall satisfaction.</i></p>
                        <br/>

                        <div className="row">
                            <div className="input-field col s6 offset-s3">
                                <input id="satisfaction" type="number" required="true" aria-required="true" className="validate" 
                                    value={ this.state.satisfaction } onChange={ this.handleChangeForNumber('satisfaction') }/>
                                <label htmlFor="satisfaction" className={ this.state.satisfaction ? 'active' : null }>Satisfaction <span className="red-text">*</span></label>
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

export default UpdateReview;