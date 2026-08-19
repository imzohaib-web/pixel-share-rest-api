require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./db/db');

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.error('Failed to connect to database:', err.message);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
