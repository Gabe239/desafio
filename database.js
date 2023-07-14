import mongoose from 'mongoose';
const mongoUrl = 'mongodb+srv://gurbinaia:yZKkn43U153UYvPw@ecommerce.uguwr0z.mongodb.net/ecommerce';
export function connectToDatabase() {
  mongoose.connect(mongoUrl, (error) => {
    if (error) {
      console.log('Cannot connect to database: ' + error);
      process.exit();
    }
  });


}