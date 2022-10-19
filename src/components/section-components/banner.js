import React, { Component } from 'react';

class Banner extends Component {

    componentDidMount() {
    const $ = window.$;
    
     if ($('.single-select').length){
            $('.single-select').niceSelect();
        }
  }

    render() {
        const {t} = this.props;
    return <div className="banner-area home-page-banner">
          <div className="container">
            <div className="banner-inner-wrap">
              <div className="row">
                <div className="col-12">
                  <div className="banner-inner">
                    <h4 className="title">{t('banner_title1')} <br/>{t('banner_title2')} </h4>
                      <div className="red-line"/><br/>
                      <p className="bannerText">{t('banner_text1')} <br/>{t('banner_text2')} </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        }
}

export default Banner