import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Author extends Component {
    render() {
        return (
            <div className="container">
                <br/>
                <div className="nav-wrapper nav-breadcrumbs white">
                    <div className="col s12">
                        <Link to={'/'} className="breadcrumb teal-text lighten-2">Home</Link>
                        <Link to={ this.props.location.pathname } className="breadcrumb teal-text lighten-2"><b>Author</b></Link>
                    </div>
                </div>
                
                <div className="row valign-wrapper">
                    <div className="col s12">
                        <h1>Author</h1>
                    </div>
                </div>
                
                <div className="card-panel">
                    <div className="row valign-wrapper">
                        <div className="col s12 red-text lighten-3">
                            <h2 className="center">Ing. David Brandejs</h2>
                        </div>
                    </div>
                    
                    <div className="row valign-wrapper">
                        <div className="col s6"></div>
                        <img src="../author.jpg" alt="Author" width="200px" className="circle responsive-img"/>
                        <div className="col s6"></div>
                    </div>
                    
                    <br/>
                    <div className="divider"></div><br/>
                    
                    <div className="row valign-wrapper">
                        <div className="col s12 center">
                            <h3>A graduate of Business Informatics with enthusiasm for web development and IT justification. 
                            I'm also a sucker for piano music and TV shows.</h3>
                        </div>
                    </div>
                    
                    <div className="row valign-wrapper red-text lighten-3">
                        <div className="col s3"></div>
                        <div className="col s6 center-align"><h3><i className="card-icon material-icons prefix">mail_outline</i> david.brandejs@gmail.com</h3></div>
                        <div className="col s3"></div>
                    </div>
                    <br/>
                    <div className="row valign-wrapper">
                        <div className="col s6"></div>
                        <a href="https://www.linkedin.com/in/davidbrandejs/"><img src="../linkedin.png" alt="Author" width="50px" className="responsive-img"/></a>
                        <div className="col s6"></div>
                    </div>
                </div>
            </div>
        );
    }
};

export default Author;