import React, { useState, useEffect } from "react";
import { render } from "react-dom";

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink,
  split,
  useSubscription,
  gql,
  ApolloLink,
  useMutation,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink]),
});

//==============================
// MUTATION
//==============================
const CREATE_POST = gql`
  mutation CreatePost($title: String!, $author: String!) {
    createPost(data: { title: $title, author: $author }) {
      title
      author
    }
  }
`;

const CreatePost = () => {
  let title;
  let author;
  const [createPost, { data }] = useMutation(CREATE_POST);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost({
            variables: { title: title.value, author: author.value },
          });
          title.value = "";
          author.value = "";
        }}
      >
        <label>
          title:
          <input
            ref={(node) => {
              title = node;
            }}
          />
        </label>
        <br />
        <label>
          author:
          <input
            ref={(node) => {
              author = node;
            }}
          />
        </label>
        <br />
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
};

//==============================
// SUBSCRIPTION
//==============================
const POST_CREATED = gql`
  subscription {
    post {
      mutation

      data {
        title
        author
      }
    }
  }
`;

const LatestPost = () => {
  const { data, error, loading } = useSubscription(POST_CREATED);

  if (loading) return <p>loading</p>;
  if (error) return <p>{error.toString()}</p>;

  return <h4>New title: {data.post.data.title}</h4>;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>Mutation</h2>
        <CreatePost />
        <h2>Subscription</h2>
        <LatestPost />
      </div>
    </ApolloProvider>
  );
}

render(<App />, document.getElementById("root"));
