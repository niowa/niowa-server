const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3010;

app.listen(port, () => {
    console.log(`Application server started at http://localhost:${port}`);
});
