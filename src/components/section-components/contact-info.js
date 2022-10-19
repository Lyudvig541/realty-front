import React, { Component } from 'react';
import {GeolocationControl, Map, Placemark, YMaps} from "react-yandex-maps";

const mapState = {
    center: [40.1776121, 44.6125849],
    zoom: 10,
    yandexMapDisablePoiInteractivity: true,
};
const coordinates = [
    [40.1776121, 44.5125849],
    [40.1776121, 44.5125849]
];
const mapOptions = {
    iconLayout: "default#image",
    iconImageSize: [30, 42],
    iconImageOffset: [-3, -42],
};
class ContactInfo extends Component {


    render() {

    return <div className="contact-area pd-top-100 pd-bottom-65">
        <div className="container">
            <div className="row pd-top-50">
                <div className="col-xl-3 col-sm-6">
                    <div className="single-contact-info">
                        <p><i className="fa fa-phone" />Call Us:</p>
                        <h5>(+374) 99 999 999</h5>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="single-contact-info">
                        <p><i className="fa fa-whatsapp" />Whatsapp:</p>
                        <h5>(+374) 99 999 999</h5>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="single-contact-info">
                        <p><i className="fa fa-envelope" />Have any Question?</p>
                        <h5>example@1sqgmail.com</h5>
                    </div>
                </div>
                <div className="col-xl-3 col-sm-6">
                    <div className="single-contact-info">
                        <p><i className="fa fa-phone" />Address</p>
                        <h5>Armenia Yerevan</h5>
                        <h5>Urdex uzenq 999</h5>
                    </div>
                </div>
            </div>
            <div className="row pd-top-50">
                <div className="col-lg-8">
                    <div style={{height: 474}}>
                        <YMaps width="100%" height="100%" enterprise
                               query={{
                                   apikey: process.env.REACT_APP_Y_API_KEY,
                               }}>
                            <Map state={mapState} width="100%" height="100%">
                                {coordinates.map(coordinate =>
                                    <Placemark geometry={coordinate}
                                               options={mapOptions}
                                               draggable={false}/>)}
                                <GeolocationControl options={{position: {bottom: 50, right: 30}}}/>
                            </Map>
                        </YMaps>
                    </div>
                </div>
                <div className="col-lg-4">
                    <form className="contact-form-wrap contact-form-bg">
                        <h4>Contact Now</h4>
                        <div className="sq-single-input">
                            <input type="text" placeholder="Name" />
                        </div>
                        <div className="sq-single-input">
                            <input type="text" placeholder="Phone" />
                        </div>
                        <div className="sq-single-input">
                            <input type="email" placeholder="Email" />
                        </div>
                        <div className="sq-single-input">
                            <textarea rows={10} placeholder="Message" defaultValue={""} />
                        </div>
                        <div className="btn-wrap text-center">
                            <button className="btn btn-main-color">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

        }
}

export default ContactInfo