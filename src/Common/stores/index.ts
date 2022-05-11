import { networkCallWithFetch } from '../utils/APIUtils'
import PopularBlogsStore from '../../PopularBlogs/stores/PopularBlogsStore'
import PopularReposService from '../../PopularBlogs/services/PopularReposService/index.api'
import CounterStore from './CounterStore'

const counterStore = new CounterStore()
const popularBlogsService = new PopularReposService(networkCallWithFetch)
const popularBlogsStore = new PopularBlogsStore(popularBlogsService)

export default {
   counterStore,
   popularBlogsStore
}
