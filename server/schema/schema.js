const graphql = require("graphql");
const _ = require("lodash");
const { v4 } = require("uuid");

// Dummy data
let users = [
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

let lists = [
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
    name: "House",
    userId: "4",
  },
  {
    id: "5",
    name: "Studying",
    userId: "5",
  },
];

let notes = [
  {
    id: "1",
    note: "Buy a jacket",
    listId: "1",
  },
  {
    id: "2",
    note: "Do the laundry",
    listId: "2",
  },
  {
    id: "3",
    note: "Deploy the project",
    listId: "3",
  },
  {
    id: "4",
    note: "Do the laundry",
    listId: "4",
  },
  {
    id: "5",
    note: "Complete biology homework",
    listId: "5",
  },
];

// Types
const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "UserType",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    age: { type: graphql.GraphQLInt },
    lists: {
      type: new graphql.GraphQLList(ListType),
      resolve(parent) {
        return _.filter(lists, { userId: parent.id });
      },
    },
  }),
});

const ListType = new graphql.GraphQLObjectType({
  name: "List",
  description: "ListType",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    user: {
      type: UserType,
      resolve(parent) {
        return _.find(users, { id: parent.userId });
      },
    },
    notes: {
      type: NoteType,
      resolve(parent) {
        return _.filter(notes, { listId: parent.id });
      },
    },
  }),
});

const NoteType = new graphql.GraphQLObjectType({
  name: "NoteType",
  description: "NoteType",
  fields: () => ({
    id: { type: graphql.GraphQLID },
    note: { type: graphql.GraphQLString },
    list: {
      type: ListType,
      resolve(parent) {
        return _.find(lists, { id: parent.listId });
      },
    },
  }),
});

// Root Query
const RootQuery = new graphql.GraphQLObjectType({
  name: "RootQuery",
  description: "RootQuery",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return _.find(users, { id: args.id });
      },
    },
    users: {
      type: new graphql.GraphQLList(UserType),
      resolve() {
        return users;
      },
    },

    list: {
      type: ListType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return _.find(lists, { id: args.id });
      },
    },
    lists: {
      type: new graphql.GraphQLList(ListType),
      resolve() {
        return lists;
      },
    },

    note: {
      type: NoteType,
      args: { id: { type: graphql.GraphQLID } },
      resolve(parent, args) {
        return _.find(notes, { id: args.id });
      },
    },
    notes: {
      type: new graphql.GraphQLList(NoteType),
      resolve() {
        return notes;
      },
    },
  },
});

// Mutations
const Mutation = new graphql.GraphQLObjectType({
  name: "Mutation",
  description: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: graphql.GraphQLString },
        age: { type: graphql.GraphQLInt },
      },
      resolve(parent, args) {
        let new_user = {
          id: v4(),
          name: args.name,
          age: args.age,
        };

        users.push(new_user);

        return new_user;
      },
    },
    // TODO:  Add lists, notes mutations  and configure uuid to use incremental numbers
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
