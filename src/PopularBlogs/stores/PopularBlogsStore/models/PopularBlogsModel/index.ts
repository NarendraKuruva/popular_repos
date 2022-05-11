interface ApiData {
   id: string
   title: string
   image_url: string
   avatar_url: string
   author: string
   topic: string
   content: string
}

class PopularBlogModel {
   id!: string
   title!: string
   imageUrl!: string
   avatarUrl!: string
   author!: string
   topic!: string
   content!: string
   constructor(data: ApiData) {
      this.id = data.id
      this.title = data.title
      this.imageUrl = data.image_url
      this.avatarUrl = data.avatar_url
      this.author = data.author
      this.topic = data.topic
      if (data.content) {
         this.content = data.content
      } else {
         this.content = ''
      }
   }
}

export default PopularBlogModel
