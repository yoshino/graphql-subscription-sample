module Mutations
  class CreatePost < BaseMutation
    graphql_name 'CreatePost'

    field :post, Types::PostType, null: true
    field :result, Boolean, null: true

    argument :title, String, required: false
    argument :author, String, required: false

    def resolve(**args)
      post = Post.create!(title: args[:title], author: args[:author])
      RailsServerSchema.subscriptions.trigger('postCreated', {}, post)

      {
        post: post,
        result: post.errors.blank?
      }
    end
  end
end
