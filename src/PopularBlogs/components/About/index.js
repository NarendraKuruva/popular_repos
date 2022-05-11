import React from 'react'
import Header from '../Header'
import './index.css'

const About = () => (
   <div>
      <Header />
      <div className='about-container'>
         <img
            src='https://assets.ccbp.in/frontend/react-js/about-blog-img.png'
            alt='about'
            className='about-img'
         />
         <h1 className='about-heading'>About</h1>
         <p className='about-paragraph'>
            All about Blogs of frontend developers
         </p>
      </div>
   </div>
)

export default About
