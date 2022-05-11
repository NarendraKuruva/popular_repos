import { observer } from 'mobx-react'
import React, { Component, useContext, useEffect } from 'react'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import { PopularBlogsContext } from '../../../Common/stores/index.context'

import BlogItem from '../BlogItem'

import './index.css'

const BlogsList = observer(() => {
   const popularBlogsStore = useContext(PopularBlogsContext)
   const { getPopularBlogs, blogsList, clearStore } = popularBlogsStore
   useEffect(() => {
      getPopularBlogs()
      return clearStore
   }, [])

   const blogsArray = Array.from(blogsList.values())
   const renderLoader = () => (
      <div className='loader-container'>
         {<Loader type='ThreeDots' color='blue' height={40} width={40} />}
      </div>
   )
   const renderBlogsList = () => (
      <div>
         <div className='blog-list-container'>
            {blogsArray.map(item => (
               <BlogItem blogData={item} key={item.id} />
            ))}
         </div>
      </div>
   )

   console.log(popularBlogsStore.blogsListApiStatus)

   switch (popularBlogsStore.blogsListApiStatus) {
      case 200:
         return renderBlogsList()
      default:
         return renderLoader()
   }
})

export default BlogsList
