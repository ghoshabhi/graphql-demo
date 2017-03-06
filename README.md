# GraphQL Demo
A simple app to demonstrate GraphQL 😎

## How to run ?
Make sure you have node version > **`6`**. If you have `nvm` installed on your machine type `nvm use` in the the root project directory.

1. `git clone https://github.com/ghoshabhi/graphql-demo.git`
2.  `cd graphql-demo/users`
3.  Install dependencies:

    `npm install` or

    `yarn`
4. To run the mock json-server run the following command: 

   `npm run json:server`
   
5. To run the GraphQL server:

   `npm run dev`

## Sample Query: 

1. Get All Users:

```js
query {
  getAllUsers {
    id
    firstName
    age
    company {
      name
      description
    }
  }
}
```

2. Fetch one User:

```js
query {
  getUser(id: "1") {
    firstName,
    age
  }
}
```

3. Fetch All Companies and its employees/users: 
```js
query {
  getAllCompanies {
    name
    description
    users{
      firstName,
      age
    }
  }
}
```

## Sample Mutations

1. Add User: 
```js
mutation {
  addUser(firstName: "John Doe", age: 24) {
    id
    firstName
    age
  }
}
```

2. Update User: 
```js
mutation updateInfo ($id: String!, $name: String, $age: Int){
  updateUser(id: $id, firstName: $name, age: $age) {
    id
    firstName
    age
  }
}
```
And in `Query Variables` add the following: 
```js
{
  "id": "1",
  "name": "Updated Name"
  "age": 23
}
```
