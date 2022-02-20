const seeder = require('mongoose-seed');
const { MONGO_URI } = require('./constants/mongo');

const data = [
  {
    model: 'transaction',
    documents: [
      {
        id: '5d5c1f747e01cd704f18f863',
        user_id: 'employee4',
        description: 'cleaningsupplies',
        merchant_id: 'walmart',
        debit: true,
        credit: false,
        amount: 150
      },
      {
        id: '5d5c1f747e01cd704f18f864',
        user_id: 'employee3',
        description: 'refund',
        merchant_id: 'walmart',
        debit: false,
        credit: true,
        amount: 250
      },
      {
        id: '5d5c1f747e01cd704f18f865',
        user_id: 'employee5',
        description: 'refund',
        merchant_id: 'walmart',
        debit: false,
        credit: true,
        amount: 100
      }
    ]
  }
];

seeder.connect(MONGO_URI, () => {
  seeder.loadModels(['./data-models/Transaction']);
  seeder.clearModels(['transaction'], () => {
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
