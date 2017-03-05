const axios = require('axios');
const graphql = require('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = graphql;

const API_URL = 'http://localhost:3000';

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { 
      type: CompanyType,
      resolve(parentValue, args) {
        //console.log(parentValue, args);
        return axios
                .get(`${API_URL}/companies/${parentValue.companyId}`)
                .then(res => res.data);
      } 
    },
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
                .get(`${API_URL}/users/${args.id}`)
                .then(resp => resp.data);
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
                .get(`${API_URL}/companies/${args.id}`)
                .then(resp => resp.data);
      }
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
