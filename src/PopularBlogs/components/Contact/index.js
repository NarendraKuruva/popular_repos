import React from 'react'
import Header from '../Header'
import './index.css'

const Contact = () => (
   <div>
      <Header />
      <div className='contact-container'>
         <img
            src='https://assets.ccbp.in/frontend/react-js/contact-blog-img.png'
            alt='contact'
            className='contact-img'
         />
         <h1 className='contact-heading'>Contact</h1>
      </div>
   </div>
)

export default Contact
