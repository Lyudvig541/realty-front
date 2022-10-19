import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Error extends Component {

  componentDidMount() {
     const $ = window.$;
     var preLoder = $("#preloader");
     preLoder.fadeOut(0);
  }
    render() {
    return <div>
           <div className="error-page text-center">
            <div className="container">
              <div className="error-page-wrap d-inline-block">
                <Link to="/">Go Back</Link>
                <h2>404</h2>
              </div>
            </div>
          </div>
        </div>
    }
}

export default Error