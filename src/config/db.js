module.exports = {
  url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zimmet',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};