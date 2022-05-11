import { ApisauceInstance, create } from 'apisauce'
import { apiMethods } from '../../../Common/constants/APIConstants'
import PopularReposService from '.'

class PopularReposServiceApi implements PopularReposService {
   networkCallWithFetch: (
      api: any,
      url: string,
      requestObject: Record<string, any>,
      type?: any
   ) => Promise<any>
   api: ApisauceInstance
   AppBaseUrl!: string
   token!: string
   constructor(networkCallWithFetch) {
      this.networkCallWithFetch = networkCallWithFetch
      this.api = create({ baseURL: 'https://apis.ccbp.in' })
      this.AppBaseUrl = this.api.getBaseURL()
   }
   getBlogsData() {
      return this.networkCallWithFetch(this.api, '/blogs', {}, apiMethods.get)
   }

   getBlogDetails(id: number) {
      return this.networkCallWithFetch(
         this.api,
         `/blogs/${id}`,
         {},
         apiMethods.get
      )
   }
}

export default PopularReposServiceApi
