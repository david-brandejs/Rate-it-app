import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Docs extends Component {
    render() {
        return (
            <div className="container">
                <br/>
                <div className="nav-wrapper nav-breadcrumbs white">
                    <div className="col s12">
                        <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                        <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Docs</b></Link>
                    </div>
                </div>
                
                <div className="row valign-wrapper">
                    <div className="col s12">
                        <h1>Docs</h1>
                    </div>
                </div>
                
                <div className="card-panel">
                    <div className="row valign-wrapper">
                        <div className="col s12 red-text lighten-3">
                            <b>Home page</b>
                        </div>
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col s12">
                            The home page lists all of the IT providers that were entered by the users. IT provider can be anyone that offers 
                            services concerning information technology. That includes web site/app development and design, digital marketing, 
                            custom software, internet services providers and others. Each provider has his own card that displays his basic 
                            information - name, description, address and overall rating. Any user can open a provider card to reveal 
                            more information about him and his reviews.
                        </div>
                    </div>
                    <div className="divider"></div><br/>
                    <div className="row valign-wrapper">
                        <div className="col s12 red-text lighten-3">
                            <b>Provider page</b>
                        </div>
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col s12">
                            The provider page displays information about a provider and lists each of his reviews. The provider card contains 
                            following information - the name of the provider, description of his services, additional information, website 
                            and his address. The review cards contain information about user's experiences with the provider. The reviews 
                            include the type of service provided, overall satisfaction, provider rating, service rating and 
                            a comment regarding how the service was provided along with any other information.
                        </div>
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col s12">
                            Provider rating consists of five factors (communication, management, integrity, reliability, availability) 
                            that are used to rate the characteristics of the provider. 
                        </div>
                    </div>    
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s5"><b>Communication</b></div> 
                        <div className="col l10 m9 s7">
                            How the provider communicated with the customer, e.g. explaining technical documentation, 
                            interpreting his needs
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s5"><b>Management</b></div> 
                        <div className="col l10 m9 s7">
                            How the provider handled provision of a service, e.g. involving the customer into the entire process, 
                            managing the activities
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s5"><b>Integrity</b></div> 
                        <div className="col l10 m9 s7">
                            How accurate and complete were the information supplied by the provider, e.g. interpreted customer 
                            requirements, technical documentation, agreements between provider and customer
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s5"><b>Reliability</b></div> 
                        <div className="col l10 m9 s7">
                            How reliable was the customer and how appropriate was information provided by him, e.g. holding to 
                            arranged obligations, providing relevant information concerning the development of a product/service
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s5"><b>Availability</b></div> 
                        <div className="col l10 m9 s7">
                            How available was the provider during the provision of service, e.g. responding to customer's 
                            changing needs, making all required information available
                        </div>        
                    </div><br/>
                            
                    Service rating consists of three factors (timeliness, quality, costs) that are used to rate the characteristics of the 
                    provided service.
                    
                    <br/><br/>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s4"><b>Timeliness</b></div> 
                        <div className="col l10 m9 s8">
                            How satisfied was the customer with the final schedule
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s4"><b>Quality</b></div> 
                        <div className="col l10 m9 s8">
                            How satisfied was the customer with the quality and the scope of the final service
                        </div>        
                    </div>
                    <div className="row valign-wrapper">
                        <div className="col l2 m3 s4"><b>Costs</b></div> 
                        <div className="col l10 m9 s8">
                            How satisfied was the customer with the final costs
                        </div>        
                    </div> 

                </div>
            </div>
        );
    }
};

export default Docs;