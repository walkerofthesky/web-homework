const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType } = graphql;
const { TransactionModel } = require('../data-models/Transaction');
const TransactionType = require('./transaction-type');

const TransactionInput = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: {
    user_id: { type: GraphQLString },
    description: { type: GraphQLString },
    merchant_id: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve(parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return new TransactionModel({ user_id, description, merchant_id, debit, credit, amount }).save();
      }
    },
    editTransaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString },
        updateData: { type: TransactionInput }
      },
      async resolve(parentValue, { id, updateData }) {
        try {
          const updatedTransaction = await TransactionModel.findByIdAndUpdate(id, updateData, { new: true });
          return {
            ...updatedTransaction._doc,
            id: updatedTransaction._id
          };
        } catch (err) {
          console.err('error finding and updating transaction', err);
        }
      }
    },
    deleteTransaction: {
      type: TransactionType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(parentValue, { id }) {
        try {
          const deletedTransaction = await TransactionModel.findByIdAndDelete(id);
          return { id: deletedTransaction._id };
        } catch (err) {
          console.err('error deleting transaction', err);
        }
      }
    }
  }
});

module.exports = mutation;
