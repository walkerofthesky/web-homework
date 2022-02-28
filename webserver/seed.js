const seeder = require('mongoose-seed');
const { MONGO_URI } = require('./constants/mongo');

const data = [
  {
    model: 'transaction',
    documents: [
      {
        user_id: 'employee4',
        description: 'cleaningsupplies',
        merchant_id: 'walmart',
        debit: true,
        credit: false,
        amount: 150
      },
      {
        user_id: 'employee3',
        description: 'refund',
        merchant_id: 'walmart',
        debit: false,
        credit: true,
        amount: 250
      },
      {
        user_id: 'employee5',
        description: 'refund',
        merchant_id: 'walmart',
        debit: false,
        credit: true,
        amount: 100
      }
    ]
  },
  {
    model: 'user',
    documents: [
      {
        // id: 'employee3',
        firstName: 'Leonardo',
        lastName: 'DiCaprio',
        dob: '1974-11-11T07:00:00.000Z'
      },
      {
        // id: 'employee4',
        firstName: 'Jonah',
        lastName: 'Hill',
        dob: '1983-12-20T07:00:00.000Z'
      },
      {
        // id: 'employee5',
        firstName: 'Margo',
        lastName: 'Robbie',
        dob: '1990-07-02T07:00:00.000Z'
      }
    ]
  }
];

seeder.connect(MONGO_URI, () => {
  seeder.loadModels(['./data-models/Transaction', './data-models/User']);
  seeder.clearModels(['transaction', 'user'], () => {
    seeder.populateModels(data, (err, done) => {
      if (err) {
        return console.error('Error while seeding db', err);
      }
      if (done) {
        return console.log('Seed done', done);
      }
      seeder.disconnect();
    });
  });
});
