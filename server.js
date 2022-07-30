const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/recipe-repository'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/recipe-repository/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
