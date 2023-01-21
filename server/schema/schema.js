const graphql = require("graphql");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

// Dummy data
let users = [
  {
    id: "1",
    name: "Nick",
    age: 15,
    email: "nick@gmail.com",
  },
  {
    id: "2",
    name: "George",
    age: 45,
    email: "george@gmail.com",
  },
  {
    id: "3",
    name: "Andrew",
    age: 32,
    email: "andrew@gmail.com",
  },
  {
    id: "4",
    name: "Maria",
    age: 18,
    email: "maria@gmail.com",
  },
  {
    id: "5",
    name: "Athina",
    age: 27,
    email: "athina@gmail.com",
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
    title: "Buy a jacket",
    description: "Hello world!",
    listId: "1",
  },
  {
    id: "2",
    title: "Do the laundry",
    description: "Hello world!",
    listId: "2",
  },
  {
    id: "3",
    title: "Deploy the project",
    description: "Hello world!",
    listId: "3",
  },
  {
    id: "4",
    title: "Do the laundry",
    description: "Hello world!",
    listId: "4",
  },
  {
    id: "5",
    title: "Complete biology homework",
    description: "Hello world!",
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
    email: { type: graphql.GraphQLString },

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
      type: new graphql.GraphQLList(NoteType),
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
    id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
    title: { type: graphql.GraphQLString },
    description: { type: graphql.GraphQLString },
    listId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
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
        email: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
      },
      resolve(parent, args) {
        let newUser = {
          id: uuidv4(),
          name: args.name,
          age: args.age,
          email: args.email,
        };

        if (_.find(users, { email: args.email }))
          return new Error(`Email already exists.`);

        users.push(newUser);
        return newUser;
      },
    },
    deleteUser: {
      type: graphql.GraphQLString,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        const newUser = _.find(users, { id: args.id });

        if (!newUser)
          return new Error(`User with id ${args.id} doesn't exist.`);

        const index = users.indexOf(newUser);

        users.splice(index, 1);

        return `User ${newUser.name} deleted successfully!`;
      },
    },
    createList: {
      type: ListType,
      args: {
        name: { type: graphql.GraphQLString },
        userId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        if (_.find(lists, { name: args.name }))
          return new Error("List already exists.");
        else if (!_.find(users, { id: args.userId }))
          return new Error(`User doesn't exist.`);

        const newList = {
          id: uuidv4(),
          name: args.name,
          userId: args.userId,
        };

        lists.push(newList);

        return newList;
      },
    },
    deleteList: {
      type: graphql.GraphQLString,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        const list = _.find(lists, { id: args.id });
        if (!list) {
          return new Error(`List with id ${args.id} doesn't exist.`);
        }

        const index = lists.indexOf(list);
        lists.splice(index, 1);

        return "List deleted successfully";
      },
    },
    createNote: {
      type: NoteType,
      args: {
        title: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        listId: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        const newNote = {
          id: uuidv4(),
          title: args.title,
          description: args.description,
          listId: args.listId,
        };

        if (_.find(notes, { title: args.title, listId: args.listId }))
          return new Error(`Note exists in list with id: ${args.listId}`);
        else if (!_.find(lists, { id: args.listId }))
          return new Error(`List with id: ${agrs.id} doesn't exist.`);

        notes.push(newNote);

        return newNote;
      },
    },
    deleteNote: {
      type: graphql.GraphQLString,
      args: {
        id: { type: new graphql.GraphQLNonNull(graphql.GraphQLID) },
      },
      resolve(parent, args) {
        const note = _.find(notes, { id: args.id });
        if (!note) return new Error("Note doesn't exist");

        const index = notes.indexOf(note);

        notes.splice(index, 1);

        return "Note deleted successfully";
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
