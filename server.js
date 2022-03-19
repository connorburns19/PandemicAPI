// Boilerplate from V V V:
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Test')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});