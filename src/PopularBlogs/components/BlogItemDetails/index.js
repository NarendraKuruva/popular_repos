import { observer } from 'mobx-react'
import React, { Component, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import Loader from 'react-loader-spinner'

import { PopularBlogsContext } from '../../../Common/stores/index.context'

import Header from '../Header'

import './index.css'

const BlogItemDetails = observer(() => {
   const { id } = useParams()
   const PopularBlogsContextObj = useContext(PopularBlogsContext)
   const {
      getPopulrBlogDetails,
      getPopularBlogs,
      activeBlogApiStatus,
      blogsList,
      activeBlog,
      clearStore
   } = PopularBlogsContextObj
   useEffect(() => {
      getPopulrBlogDetails(id)
      return () => {
         clearStore()
      }
   }, [])
   const renderBlogItemDetails = () => {
      const { title, imageUrl, content, avatarUrl, author } = activeBlog
      return (
         <div className='blog-container'>
            <Header />
            <div className='blog-item-details'>
               <div className='blog-info'>
                  <h2 className='blog-details-title'>{title}</h2>

                  <div className='author-details'>
                     <img className='author-pic' src={avatarUrl} alt={author} />
                     <p className='details-author-name'>{author}</p>
                  </div>

                  <img className='blog-image' src={imageUrl} alt={title} />
                  <p className='blog-content'>{content}</p>
               </div>
            </div>
         </div>
      )
   }
   const renderLoader = () => (
      <div className='loader-container'>
         {<Loader type='ThreeDots' color='#ffffff' height={30} width={30} />}
      </div>
   )

   switch (activeBlogApiStatus) {
      case 200:
         return renderBlogItemDetails()
      case 400:
         return renderLoader()
      default:
         return renderLoader()
   }
})

export default BlogItemDetails
