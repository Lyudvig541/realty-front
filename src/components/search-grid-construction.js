import React, {Component} from 'react';
import sectiondata from '../../data/sections.json';
import {Link} from 'react-router-dom';
import {Map, YMaps} from "react-yandex-maps";

const mapData = {
  center: [55.751574, 37.573856],
  zoom: 5,
};


class SearchGridConstruction extends Component {


  componentDidMount() {

    const $ = window.$;

    if ($('.single-select').length){
      $('.single-select').niceSelect();
    }
  }

  render() {

    let publicUrl = process.env.PUBLIC_URL
    let data = sectiondata.searchgrid


    return <div className="search-page-wrap mg-top-30">
      <div className="search-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="row justify-content-center">
                {data.items.map((item, i) =>
                    <div key={i} className="col-xl-6 col-sm-6">
                      <div className="single-feature">
                        <div className="thumb">
                          <img src={publicUrl + item.image} alt="img"/>
                        </div>
                        <div className="details">
                          <h4 className="author"><i className="fa fa-user"/> {item.authorname}</h4>
                          <h6 className="readeal-top"><Link
                              to={item.url}><i className="fa fa-map-marker"/> {item.title}</Link></h6>
                          <h6 className="price">{item.newerprice}</h6>
                          <ul className="info-list">
                            {item.features.map((features, i) =>
                                <li key={i}><i className={features.icon}/> {features.title}
                                </li>
                            )}
                          </ul>

                        </div>

                      </div>
                    </div>
                )}

              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 mapCss" >
              <YMaps height="100%" width="100%">
                <Map width="100%" height="100%" defaultState={mapData}/>
              </YMaps>
            </div>
          </div>
        </div>
      </div>
    </div>

  }
}

export default SearchGridConstruction