const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String
        phone: String
        address: String
        username: String!
        password: String!
        created_by: String!
        created_at: String
        update_by: String
        update_at: String
        status: Int
    }

    type Product {
        id: ID!
        name: String!
        price: Int!
        oldPrice: Int!
        thumbnail: String!
        description: String!
        stock: Int!
        reviews: [String]
        images: [String]
        size: [String]
        count_sold: Int  
        category: Category!
        brand: String!
        rating: Int
        created_by: String!
        created_at: String
        update_by: String
        update_at: String
        view: Int
        status: Int
    }

    type Category {
        id: ID!
        name: String!
        description: String
        created_at: String
        updated_at: String
    }

    type Order {
        id: ID!
        user: User!
        products: [OrderProduct!]!
        totalAmount: Int!
        status: String
        created_by: String!
        created_at: String
        updated_at: String
    }

    type OrderProduct {
        product: Product!
        quantity: Int!
    }

    type Query {
        users: [User]
        user(id: ID!): User
        products: [Product]
        product(id: ID!): Product
        orders: [Order]
        order(id: ID!): Order
        categories: [Category]
        category(id: ID!): Category
        searchProductsByName(name: String!): [Product]
    }

    type Mutation {
        createUser(name: String!, email: String, phone: String, address: String, username: String!, password: String!, created_by: String!): User
        loginUser(username: String!, password: String!): User
        loginCustomer(username: String!, password: String!): User
        createProduct(
            name: String!,
            price: Int!,
            oldPrice: Int!,
            thumbnail: String!,
            description: String!,
            stock: Int!,
            category: ID!,
            brand: String!,
            created_by: String!
        ): Product
        createOrder(userId: ID!, products: [OrderProductInput!]!, totalAmount: Int!): Order
        createCategory(name: String!, description: String): Category
        deleteUser(id: ID!): User!
        updateUser(id: ID!, name: String, email: String, phone: String, address: String): User!
        deleteProduct(id: ID!): Product!
        updateProduct(id: ID!, name: String, price: Int, oldPrice: Int, thumbnail: String, description: String, stock: Int, category: ID, brand: String, updated_by: String): Product
        deleteCategory(id: ID!): Category!
        updateCategory(id: ID!, name: String, description: String): Category!
          deleteOrder(id: ID!): Order!
    }

    input OrderProductInput {
        productId: ID!
        quantity: Int!
    }
`;

module.exports = typeDefs;
