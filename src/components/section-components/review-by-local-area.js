import React, {Component} from 'react';
import {YMaps, Map, Placemark} from 'react-yandex-maps';


const mapState = {
    center: [40.205232423495,44.50179792794979],
    zoom: 16,
    yandexMapDisablePoiInteractivity: true,
};
const coordinates = [
    [40.205232423495,44.50179792794979],
];
const mapOptions = {
    preset: "islands#redCircleDotIcon",
    hideIconOnBalloonOpen: false,
    openEmptyBalloon: true,
    open:true,
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42],
};

class ReviewByLocalArea extends Component {

    render() {
        const {t} = this.props;

        return <div className="reviewByLocalArea pd-top-90  pd-bottom-70">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <br/>
                        <h3>{t('reviewByLocal_title')}</h3>
                        <div className="red-line"/>
                        <br/>
                        <p>{t('reviewByLocal_desc1')}</p>
                        <p>{t('reviewByLocal_desc2')}</p>
                        <div className="pd-top-50">
                            <button className="btn btn-main-color">{t('reviewByLocal_btn')}</button>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <YMaps height="510px" width="675px"
                               query={{
                                   apikey: process.env.REACT_APP_Y_API_KEY,
                               }}>
                            <Map width="100%" height="100%" state={mapState} onLoad={(inst)=>{return "sadasd"}}>
                                {coordinates.map((coordinate, i) =>
                                <Placemark key={i}
                                           geometry={coordinate}
                                           options={mapOptions}
                                           draggable={true}
                                           properties={{
                                               balloonContent: "<p><strong>Vahram Papazyan Str, 22</strong></p>",
                                               open:true,
                                           }}
                                           modules={['geoObject.addon.balloon']}
                                />)}
                            </Map>
                        </YMaps>
                    </div>
                </div>
            </div>
        </div>


    }
}

export default ReviewByLocalArea
