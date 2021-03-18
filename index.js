const { ApolloServer, PubSub, gql } = require("apollo-server");
const db = require("./db");
const Query = require("./resolver/Query");
const Mutation = require("./resolver/Mutation");
const Subscription = require("./resolver/Subscription");

//スキーマ定義
const typeDefs = gql`
  type Query {
    posts(query: String): [Post!]!
  }

  type Mutation {
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
  }

  # Subscription
  type Subscription {
    post: PostSubscriptionPayload!
  }

  input CreatePostInput {
    title: String!
    author: String!
  }

  input UpdatePostInput {
    title: String
    author: String!
  }

  type Post {
    id: ID!
    title: String!
    author: String!
  }

  ######################
  # Subscriptionで利用
  ######################

  enum MutationType {
    CREATED
    UPDATED
    DELETED
  }

  # Subscriptionのフィールド
  type PostSubscriptionPayload {
    mutation: MutationType!
    data: Post!
  }
`;
//PubSubのインスタンスを作成,Subscriptionが利用可能に！
const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: {
    Query,
    Mutation,
    Subscription,
  },
  context: {
    db,
    pubsub,
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
