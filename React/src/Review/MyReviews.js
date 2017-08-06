import React, { Component } from 'react';
import { API_URL } from './../constants';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Moment from 'react-moment';
import history from '../history';

class MyReviews extends Component {
    componentDidMount() {
        $(document).ready(function(){
            $('.collapsible').collapsible();
            // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
            $('.modal').modal();
        });
    }
    componentWillMount() {
        this.setState({ reviews: [{
            providerRating: [],
            serviceRating: []
            }]
        });
        this.setState({ profile: {} });
        
        const { authFetch } = this.props.auth;

        const { userProfile, getProfile } = this.props.auth;
        if (!userProfile) {
            getProfile((err, profile) => {
                this.setState({ profile });

                authFetch(`${API_URL}/userReviews/` + profile.sub)
                    .then(data => {
                        this.setState({ reviews: data });
                        
//                        for(var i = 0; i < data.length; i++) {
//                            this.mountModals(i+1);
//                        }
                        
                    })
                    .catch(error => this.setState({ reviews: error }));
            });
        } else {
            this.setState({ profile: userProfile });;
        }
    }
//    mountModals(key) {
//        $(document).ready(function(){
//            $('#modal' + key).modal({
//                dismissible: false,
//                ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
//                    $('.collapsible').collapsible('close', 0);
//                    $('.collapsible').collapsible('destroy');
//                },
//                complete: function() { $('.collapsible').collapsible(); } // Callback for Modal close
//            });
//        });
//        
//    }
    openModal(key) {
        $(document).ready(function(){;
            $('#modal' + key).modal('open');
        });
    }
    removeReview(review_id, provider_id) {
        const { authFetch } = this.props.auth;
        
        authFetch(`${API_URL}/review/` + review_id, {
            method: "DELETE",
            body: JSON.stringify({
                review_id: review_id
            })
        }).then(data => {
            authFetch(`${API_URL}/reviews-aggregate/` + provider_id)
                .then(reviewsData => { 
                    authFetch(`${API_URL}/provider/` + provider_id, {
                        method: "PUT",
                        body: JSON.stringify({
                            rating: reviewsData.length !== 0 ? reviewsData[0].totalAverage : 0
                        })
                    }).then(data => {
                        history.replace(this.props.location.pathname);
                    }).catch(error => this.setState({ reviews: error }));
                })
                .catch(error => this.setState({ reviews: error }));
            
        }).catch(error => this.setState({ reviews: error }));
    }
    render() {
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
                        <div>
                            <div className="hide-on-med-and-up right">
                                <Link to={ '/update-review/' + review._id }>
                                    <i className="material-icons teal-text hoverable">edit</i>
                                </Link>
                                <a href={"#modal"+key} onClick={ this.openModal.bind(this, key) } ><i className="material-icons red-text hoverable">clear</i></a>
                                <br/>
                            </div>
                            
                            <b>{ key + '. ' + review.serviceType }</b> - created <Moment format="D. M. YYYY - HH:mm">{ review.createdAt }</Moment>
                            
                            <div className="right hide-on-small-only">
                                <Link to={ '/update-review/' + review._id }>
                                    <i className="material-icons teal-text hoverable">edit</i>
                                </Link>
                                <a href={"#modal"+key} onClick={ this.openModal.bind(this, key) } ><i className="material-icons red-text hoverable">clear</i></a>
                            </div>
                        </div>
   
                        <div id={"modal"+key} className="modal">
                            <div className="modal-content">
                              <h4>Delete Review</h4>
                              <p>Are you sure you want to delete this review?</p>
                            </div>
                            <div className="modal-footer">
                                <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat">Disagree</a>
                                <a href="#!" onClick={ this.removeReview.bind(this, review._id, review.provider_id) } className="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
                            </div>
                        </div>
                    
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
                { reviewNodes.length === 0 && 
                    <div className="progress">
                        <div className="indeterminate"></div>
                    </div> 
                }
                <br/>
                <div className="nav-wrapper nav-breadcrumbs white">
                    <div className="col s12">
                        <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                        <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>My Reviews</b></Link>
                    </div>
                </div>
                
                <div className="row valign-wrapper">
                    <div className="col s12">
                        <h1>My Reviews</h1>
                    </div>
                </div>

                <ul className="collapsible popout" data-collapsible="expandable">
                    { reviewNodes.length !== 0 ? reviewNodes : <span className="teal-text">No reviews yet.</span> }
                </ul><br/>
            </div>
        );
    }
}

export default MyReviews;