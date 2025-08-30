import express from 'express';

const app = express();  

const port = 3000;

app.use(express.json()); // Middleware to parse JSON bodies

let products = [{"id": 1, "name": "Laptop", "price": 1000}, 
    {"id": 2, "name": "Smartphone", "price": 500},
    {"id": 3, "name": "Tablet", "price": 300}
];

app.listen(port,()=> console.log(`Server is running on at http://localhost:${port}`));

app.post(`/products`, (req,res) => {
    const newID = Math.max(...products.map(p => p.id)) + 1;
    
    const newProduct = {
        id: newID,
        name: req.body.name,
        price: req.body.price

    };
    products.push(newProduct);
    res.status(201).json(newProduct);

    });

    app.put('/products/:id', (req,res) => {
        const id = parseInt(req.params.id);
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }
        products[productIndex].name = req.body.name;
        products[productIndex].price = req.body.price;

        res.status(200).json(products[productIndex]);

    });

    app.delete('/products/:id' , (req,res) => {
        const id = parseInt (req.params.id);
        const productIndex = products.findIndex(p => p.id === id);

        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }
        products.splice(productIndex, 1);
        res.status(204).send();
    })
    
    //endpoint toget all products
app.get('/products', (req, res) => {
    res.status(200).json(products); 
});

//create a validation for the product id
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).send('Invalid product ID');
    }
    
    const searchProduct = products.find(product => product.id === id);
    
    if (!searchProduct) {
        return res.status(404).send('Product not found');
    }
    
    console.log(searchProduct);
    res.status(200).json(searchProduct);
}); 

//searching product by id
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const searchProduct = products.find(product => product.id === id);
    console.log(searchProduct)

    res.status(200).json(searchProduct);

    
});

/*
app.listen(port, () => console.log(`Server is running on port at http://localhost:${port}`));   

*/