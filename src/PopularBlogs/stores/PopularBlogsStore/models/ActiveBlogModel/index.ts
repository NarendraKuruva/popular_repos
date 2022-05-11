class ActiveBlogModel {
   title!: string
   imageUrl!: string
   avatarUrl!: string
   author!: string
   content!: string
   constructor(data) {
      this.title = data.title
      this.imageUrl = data.image_url
      this.avatarUrl = data.avatar_url
      this.author = data.author
      this.content = data.content
   }
}

export default ActiveBlogModel
