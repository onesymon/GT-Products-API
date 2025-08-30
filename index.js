import express from 'express';

const app = express();

const port = 3000;

app.get('/',(req,res) => {
     res.status(200).send('Hello, World!');
});

// create an endpoint to handle GET requests to /info showing your name,sectoin, and program


app.get('/hello/:name', (req, res) => {
    const id = req.params.name;
    console.log(`Hello ${id}`);
    
    res.status(200).send(`You requested name: ${id}`);
});

app.get('/IT', (req, res) => {
    const body = req.body.superhero;
    console.log(body);
    res.status(200).send('This is an IT endpoint');
});

app.get('/foo',(req,res) => {
    console.log(req.query);
    res.status(200).send('This is a foo endpoint'); 
});

app.get('/info', (req, res) => {
    const studentInfo = {
        name: "One Symon A. Enriquez",
        section: "IT4C",
        program: "Bachelor of Science in Information Technology"
    };
    res.status(200).json(studentInfo);
});     


app.listen(port, () => console.log(`Server is running on port at http://localhost:${port}`));
    
