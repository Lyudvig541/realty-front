import React from 'react';
import ReactStars from "react-rating-stars-component";
import {useSelector} from "react-redux";


const Comments = (props) => {
    let data = useSelector(state => state.agent.agent);
    const {t} = props;

    let imagealt = 'image'
    const apiUrl = process.env.REACT_APP_PUBLIC_API_URL;

    return (
        <div>
            <div className="comments-area">
                <h4 className="comments-title">{t('feedback')}</h4>
                <ul className="comment-list">
                    {data.comments && data.comments.map((item,key)=>{
                       return <li key={key}>
                            <div className="single-comment-wrap">
                                <div className="row" style={{width: '100%'}}>
                                    <div className="thumb">
                                        <img src={apiUrl + "storage/uploads/users/"+item.user.avatar} alt={imagealt}/>
                                    </div>
                                    <div className="content">
                                        <h4 className="title">{item.user.first_name} {item.user.last_name}</h4>
                                    </div>
                                    <div className='reviews-rating'>
                                        <ReactStars
                                            value={5}
                                            count={5}
                                            size={24}
                                            activeColor="#FAA61A"
                                            emptyIcon={<i className="far fa-star"/>}
                                            halfIcon={<i className="fa fa-star-half-alt"/>}
                                            fullIcon={<i className="fa fa-star"/>}
                                            isHalf={true}
                                            edit={false}
                                        />
                                    </div>
                                </div>

                                <div className='reviews-text'>
                                    {item.text}
                                </div>
                            </div>
                        </li>

                    })}




                </ul>
            </div>
        </div>
    )
}

export default Comments;
