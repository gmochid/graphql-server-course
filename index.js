const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');

class UserAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com/';
  }

  async getUsers() {
    return this.get('users');
  }
}

var restaurants = [
  {
    id: '1',
    name: 'GH Corner Semarang',
    address: 'E-Plaza',
    phone: '08123456789',
    rating: 5,
    position: {
      latitude: 8.12341,
      longitude: 123.3123214,
    },
    price: {
      minimal: 15000,
      maximal: 50000,
    },
  },
  {
    id: '2',
    name: '3/4 Coworking Space',
    address: 'Tembalang',
    phone: '08123456789',
    rating: 5,
    position: {
      latitude: 8.12341,
      longitude: 123.3123214,
    },
    price: {
      minimal: 5000,
      maximal: 50000,
    },
  },
  {
    id: '3',
    name: 'Impala Space',
    address: 'Kota Lama',
    phone: '08123456789',
    rating: 5,
    position: {
      latitude: 8.12341,
      longitude: 123.3123214,
    },
    price: {
      minimal: 25000,
      maximal: 50000,
    },
  },
];

const typeDefs = gql`
  type Price {
    minimal: Int
    maximal: Int
  }

  type Position {
    latitude: Float
    longitude: Float
  }

  type Restaurant {
    id: ID
    name: String
    address: String
    phone: String
    rating: Int
    position: Position
    price: Price
  }

  type User {
    id: Int
    name: String
    username: String
    email: String
  }

  type Home {
    user: User
    restaurant: Restaurant
  }

  type Query {
    restaurants: [Restaurant]
    restaurant(id: ID!): Restaurant

    home: Home

    users: [User]
  }
  
  type Mutation {
    addRestaurant(name: String, address: String): Restaurant
  }
`;

const resolvers = {
  Query: {
    restaurants: () => restaurants,
    restaurant: (source, { id }) => restaurants.filter((restaurant) => id === restaurant.id)[0],
    home: () => restaurants,
    users: (source, args, { dataSources }) => dataSources.userAPI.getUsers(),
  },
  Mutation: {
    addRestaurant: (source, args) => {
      const { name, address } = args;
      const newRestaurant = {
        id: restaurants.length.toString(),
        name,
        address,
      }
      restaurants = [...restaurants, newRestaurant]
      return newRestaurant
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      userAPI: new UserAPI(),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
