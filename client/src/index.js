import { render } from "react-dom";

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink,
  split,
  useSubscription,
  gql,
  useMutation,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

import ActionCable from "actioncable";
import ActionCableLink from "graphql-ruby-client/subscriptions/ActionCableLink";

const wsClient = ActionCable.createConsumer("ws://localhost:4000/graphql");
const wsLink = new ActionCableLink({ cable: wsClient });

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
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
  link: splitLink,
});

//==============================
// MUTATION
//==============================
const CREATE_POST = gql`
  mutation CreatePost($title: String!, $author: String!) {
    createPost(input: { title: $title, author: $author }) {
      post {
        title
        author
      }
    }
  }
`;

const CreatePost = () => {
  let title;
  let author;
  const [createPost] = useMutation(CREATE_POST);

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
    postCreated {
      id
      title
      author
    }
  }
`;

const LatestPost = () => {
  const { data, error, loading } = useSubscription(POST_CREATED);

  if (loading || !data.postCreated) return <p>loading...</p>;
  if (error) return <p>{error.toString()}</p>;

  return <h4>New title: {data.postCreated.title}</h4>;
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
