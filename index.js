const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const port = 443;

app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// Use the routes
app.use('/api/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
