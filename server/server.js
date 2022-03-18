// Boilerplate from V V V:
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment
const express = require('express')
const app = express();
const port = 3000;
const DB_URL = 'postgres://fbpfodhmrvsvvr:0c0e145a05a6aa8f1f9df369fa71ca79a4157849f8daabcb7825cb450ec52797@ec2-3-222-204-187.compute-1.amazonaws.com:5432/d4i3ue53qch5sr'

app.get('/', (req, res) => {
  res.send('Test')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});