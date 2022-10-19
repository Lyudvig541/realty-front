import React from 'react';

const ComingSoon = () => {
    window.scrollTo(0, 0)
    const publicUrl = process.env.PUBLIC_URL;

    return <div className="coming_soon" style={{backgroundImage: 'url(/assets/img/coming-soon.png)', height: '100vh',backgroundColor:'rgb(243 238 238)'}}>
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center">
                        <img src={publicUrl + "/assets/img/logo_coming_soon.png"} alt="logo"/>
                        <h2>We Are Coming Soon !</h2>
                        <div className="partner-red-line"/>
                        <h4>Follow Us</h4>
                        <div className="footer-social">
                            <ul className="social-icon">
                                <li key="1">
                                    <a href="https://www.facebook.com/1sqrealty-740580109987010" target="_blank"
                                       rel="noopener noreferrer" ><i className='fa fa-facebook-square'/></a>
                                </li>
                                <li key="2">
                                    <div className="feature-logo-social">
                                        <a href="https://www.instagram.com/1sq.estate" target="_blank"
                                           rel="noopener noreferrer" ><i className='fa fa-instagram'/></a>
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default ComingSoon

