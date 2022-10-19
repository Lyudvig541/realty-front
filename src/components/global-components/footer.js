import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {textPages} from "../../actions/resources";


const Footer = (props) => {

    const dispatch = useDispatch();

    useEffect(() => {
        async function getData() {
            await dispatch(textPages());
        }
        getData();
    }, [dispatch])
    const {t} = props;
    const page_data = useSelector(state => state.resources.text_pages);

    let publicUrl = process.env.PUBLIC_URL
    let imageAlt = "Footer logo"

    return <footer className="footer-area">
        <div className="container">
            <div className="footer-top">
                <div className="row">
                    <div className="col-12 col-lg-12 col-sm-12 col-md-12 col-xl-3">
                        <div className="widget widget_nav_menu">
                            <ul>
                                <li className="sq-top" key="1">
                                    <a className="footer-logo" href="/">
                                        <img src={publicUrl + "/assets/img/footer-logo-black.png"} alt={imageAlt}/>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-sm-6 col-md-4 col-xl-3">
                        <div className="widget widget_nav_menu">
                            <h4 className="widget-title">{t('basic_info')}</h4>
                            <ul>
                                {page_data.map((item, i) =>
                                    <li className="sq-top" key={i + 10}>
                                        {item.translations.map((i, key) => {return <Link to={"/page/" + item.slug}
                                                         key={key}>{(localStorage.i18nextLng === 'us' && i.locale === 'en') || (i.locale === localStorage.i18nextLng) ? i.title : ""}</Link>
                                        })}
                                    </li>
                                )}

                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-sm-6 col-md-4 col-xl-3">
                        <div className="widget widget_nav_menu">
                            <h4 className="widget-title">{t('other')}</h4>
                            <ul>
                                <li className="sq-top" key="1"><Link to="/announcements">{t('footer_announcements')}</Link></li>
                                <li className="sq-top" key="2"><Link to="/from-construction">{t('construction')}</Link></li>
                                <li className="sq-top" key="3"><Link to="/agencies-list">{t('footer_agencies')}</Link></li>
                                <li className="sq-top" key="4"><Link to="/agents-list">{t('find_agent')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4 col-sm-12 col-md-4 col-xl-3">
                        <div className="widget widget_nav_menu">
                            <h4 className="widget-title">{t('contacts')}</h4>
                            <ul >
                                <li className="sq-top footer-contact-info" key="1"><i className="fa fa-map-marker"/>&nbsp;&nbsp;{t('address_1sq')}</li>
                                <li className="sq-top footer-contact-info" key="2"><i className="fa fa-phone"/>&nbsp;&nbsp;{'(+374) 44 80 04 55'}</li>
                                <li className="sq-top footer-contact-info" key="3"><i className="fa fa-envelope"/>&nbsp;&nbsp;{'info@1sq.realty'}</li>
                                <li className="sq-top mt-4" key="4">
                                    <div className="footer-social">
                                        <ul className="social-icon">
                                            <li key="1">
                                                <a href="https://www.facebook.com/1sqrealty-740580109987010" target="_blank" rel="noreferrer"><i className='fa fa-facebook-square'/></a>
                                            </li>
                                            <li key="2">
                                                <a href="https://www.instagram.com/1sq.realty" target="_blank" rel="noreferrer"><i className='fa fa-instagram'/></a>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="copy-right text-center">
            © {t('copyright')}
        </div>
        <div className="copy-right text-center">
            <span>{t('powered_by')}</span><a href='https://www.sofastsolutions.com' target='_blank' rel="noreferrer"><span>{t('sofast')}</span></a><span>{t('suffix_for_powered')}</span>
        </div>
    </footer>
}


export default Footer