module Types
  class SubscriptionType < Types::BaseObject
    field :postCreated, Types::PostType, null: false, description: 'A new post was created!'

    def post_created; end
  end
end
