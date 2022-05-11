import { bindPromiseWithOnSuccess } from '@ib/mobx-promise'
import { action, observable, ObservableMap } from 'mobx'
import BlogItem from '../../components/BlogItem'
import PopularReposService from '../../services/PopularReposService'
import ActiveBlogModel from './models/ActiveBlogModel'
import PopularBlogModel from './models/PopularBlogsModel'

class PopularBlogsStore {
   @observable blogsList!: Map<number, PopularBlogModel>
   @observable blogsListApiStatus!: number
   @observable activeBlog!: PopularBlogModel
   @observable activeBlogApiStatus!: number
   popularReposService!: PopularReposService

   constructor(popularReposService: PopularReposService) {
      this.popularReposService = popularReposService
      this.init()
   }

   @action.bound
   init() {
      this.blogsListApiStatus = 0
      this.blogsList = new ObservableMap()
   }

   @action.bound
   getPopularBlogs(): Promise<any> {
      this.blogsListApiStatus = 0
      this.blogsList.clear()
      const popularReposPromiseObj = this.popularReposService.getBlogsData()
      return bindPromiseWithOnSuccess(popularReposPromiseObj)
         .to(
            status => {
               this.blogsListApiStatus = status
            },
            response => {
               if (!response) return
               response.map(eachBlog =>
                  this.blogsList.set(
                     eachBlog.id,
                     new PopularBlogModel(eachBlog)
                  )
               )
            }
         )
         .catch(error => {
            console.log(error)
         })
   }

   @action.bound
   getPopulrBlogDetails(id: number): Promise<any> {
      this.activeBlogApiStatus = 0
      const ActiveBlogPromiseObj = this.popularReposService.getBlogDetails(id)

      return bindPromiseWithOnSuccess(ActiveBlogPromiseObj)
         .to(
            status => {
               this.activeBlogApiStatus = status
            },
            response => {
               if (!response) return
               this.blogsList.set(Number(id), new PopularBlogModel(response))
               this.activeBlog = new PopularBlogModel(response)
            }
         )
         .catch(error => {
            console.log(error)
         })
   }

   @action.bound
   clearStore() {
      this.init()
   }
}

export default PopularBlogsStore
