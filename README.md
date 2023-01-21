# Graphql API

This is a note taking graphql API.

## Types

- User
- List
- Note

## Queries

- user (query a user by an id)
- users (get all users)
- list (query all lists by id)
- lists (query all lists)
- note (query a note by an id)
- notes (query all notes)

## Mutations

- createUser (create a user. Args: name, email, age)
- deleteUser (delete a user. Args: userId)
- createList (create a list. Args: name, userId)
- deleteList (delete a list. Args: listId)
- createNote (create a note. Args: name, description, listId)
- deleteNote (delete a note. Args: noteId)
