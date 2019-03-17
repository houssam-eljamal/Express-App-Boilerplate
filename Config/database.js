//----------------------------------------------- Database Config
if (process.env.NODE_ENV === 'production') {
  // Remote Database
  module.exports = {
    mongoURI: 'mongodb://--YourRemoteDatabase--'
  }
} else {
  // Local Database
  module.exports = {
    mongoURI: 'mongodb://localhost/myDatabase'
  }
}