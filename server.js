const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// خواندن متغیرهای env
dotenv.config({ path: './config.env' });

// اتصال به MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

// روشن کردن سرور
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
