const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const API_URL = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`${API_URL}/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType,
      resolve(parentValue, args) {
        //console.log(parentValue, args);
        return axios.get(`${API_URL}/companies/${parentValue.companyId}`)
                    .then(resp => resp.data);
      } 
    },
  })
});

const query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      description: 'Returns all users',
      resolve(){
        return axios.get(`${API_URL}/users`)
                    .then(resp => resp.data);
      }
    },
    getUser: {
      type: UserType,
      description: 'Returns a User with given id',
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${API_URL}/users/${args.id}`)
                    .then(resp => resp.data);
      }
    },
    getAllCompanies: {
      type: new GraphQLList(CompanyType),
      description: 'Returns all Companies',
      resolve() {
        return axios.get(`${API_URL}/companies`)
                    .then(resp => resp.data);
      }
    },
    getCompany: {
      type: CompanyType,
      description: 'Returns a Company with given id',
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${API_URL}/companies/${args.id}`)
                    .then(resp => resp.data);
      }
    }
  },
});


const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        return axios.post(`${API_URL}/users`, { firstName, age })
                    .then(resp => resp.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${API_URL}/users/${id}`)
                    .then(resp => resp.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios.patch(`${API_URL}/users/${args.id}`, args)
                    .then(resp => resp.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
