interface PopularReposService {
   getBlogsData(): Promise<any>
   getBlogDetails(id: number): Promise<any>
}

export default PopularReposService
