import React, { Component } from 'react';
class TermsAndPolicy extends Component {
  render() {
    let publicUrl = process.env.PUBLIC_URL
    let imagealt = 'image'

    return (
      <div>
         <div className="news-details-area ">
            <div className="container">
              <div className="row justify-content-center pd-top-120">
                <div className="col-lg-8">
                  <div className="news-details-wrap">
                    <h3 className="title1">They are presented here terms of use of 1SQ</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis enim vel leo laoreet, quis sodales purus blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque blandit justo et erat aliquam, vitae suscipit neque sagittis. Nullam auctor, nisi eu imperdiet vehicula, arcu purus efficitur tellus, nonporttitor velit mi eget magna. Suspendisse a nisi nulla. Nulla luctus porttitor orci, a fermentum diam vehicula sed. Nullam luctus, enim cursus ultricies porta, elit massa pretium lacus, a accumsan odio libero sed dui. Donec vel condimentum metus.</p>
                    <img className="news-details-thumb" src={publicUrl+"assets/img/news/12.png" }alt="img" />
                    <h5 className="title2">Iron ore is Asia’s first truly global commodity. It is also a strategic commodity for China as the country continues to build its second- and third-tier cities. China's internationalization is important in driving a substantial level of interest from physical as well as financial participants.”</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis enim vel leo laoreet, quis sodales purus blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque blandit justo et erat aliquam, vitae suscipit neque sagittis. Nullam auctor, </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis enim vel leo laoreet, quis sodales purus blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque blandit justo et erat aliquam, vitae suscipit neque sagittis. Nullam auctor, nisi eu imperdiet vehicula, arcu purus efficitur tellus, nonporttitor velit mi eget magna. Suspendisse a nisi nulla. Nulla luctus porttitor orci, a fermentum diam vehicula sed. Nullam luctus, enim cursus ultricies porta, elit massa pretium lacus, a accumsan odio libero sed dui. Donec vel condimentum metus.</p>
                    <div className="row news-details-thumb">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <img src={ publicUrl+"/assets/img/news/13.png"} alt={ imagealt } />
                      </div>
                      <div className="col-sm-6">
                        <img src={ publicUrl+"/assets/img/news/14.png" } alt={ imagealt } />
                      </div>
                    </div>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis enim vel leo laoreet, quis sodales purus blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque blandit justo et erat aliquam, vitae suscipit neque sagittis. Nullam auctor, </p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed lobortis enim vel leo laoreet, quis sodales purus blandit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Quisque blandit justo et erat aliquam, vitae suscipit neque sagittis. Nullam auctor, nisi eu imperdiet vehicula, arcu purus efficitur tellus, nonporttitor velit mi eget magna. Suspendisse a nisi nulla. Nulla luctus porttitor orci, a fermentum diam vehicula sed. Nullam luctus, enim cursus ultricies porta, elit massa pretium lacus, a accumsan odio libero sed dui. Donec vel condimentum metus.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default TermsAndPolicy;
