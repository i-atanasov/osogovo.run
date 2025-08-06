import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { signUpHandler } from './signUpHandler';

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.post('/register', signUpHandler.post);

// Start the server
app.listen(process.env.PORT || 4000, () => {
    console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
