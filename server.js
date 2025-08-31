const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Read .env
dotenv.config({ path: './config.env' });

// Connect to MongoDB
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

// Turn on server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
