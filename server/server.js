/** Mise en place server EXPRESS */
const express = require('express');
const app = express();

/** Mise en place CORS pour serveur EXPRESS */
const cors = require('cors');
app.use(cors(
  {
    origin: 'http://localhost:8080'
  }
));

app.get('/', (req, res) => {
  res.send('API OK');
});
app.listen(3000, () => {
  console.log('BackEnd Server now running on port 3000');
});
