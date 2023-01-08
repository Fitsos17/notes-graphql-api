const graphql = require("graphql");
const _ = require("lodash");

// Dummy data
const USERS_DATA = [
  {
    id: "1",
    name: "Nick",
    age: 15,
  },
  {
    id: "2",
    name: "George",
    age: 45,
  },
  {
    id: "3",
    name: "Andrew",
    age: 32,
  },
  {
    id: "4",
    name: "Maria",
    age: 18,
  },
  {
    id: "5",
    name: "Athina",
    age: 27,
  },
];

const LISTS_DATA = [
  {
    id: "1",
    name: "Shopping",
    userId: "1",
  },
  {
    id: "2",
    name: "Work",
    userId: "2",
  },
  {
    id: "3",
    name: "Programming",
    userId: "3",
  },
  {
    id: "4",
    name: "Gaming",
    userId: "4",
  },
  {
    id: "5",
    name: "Studying",
    userId: "5",
  },
];

// TODO: NOTES_DATA : {id, listsId}

// Types
const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "UserType",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
  }),
});

const RootQuery = new graphql.GraphQLObjectType({
  name: "RootQuery",
  description: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return _.find(USERS_DATA, { id: args.id });
      },
    },
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve() {
        return USERS_DATA;
      },
    },

    // TODO: list, lists, note, notes
  },
});

// Mutations
// Add user, lists, notes mutations

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
});
