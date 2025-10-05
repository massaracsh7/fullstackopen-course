const app = require('./app')
const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
