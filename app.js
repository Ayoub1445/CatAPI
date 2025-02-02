const express = require ('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var methodOverride = require('method-override')
app.use(methodOverride('X-HTTP-Method-Override'))


mongoose.connect('mongodb://127.0.0.1:27017/Cats');
const Cat = mongoose.model('Cat', { name: String });


app.get('/api', (req,res)=>{
    res.send('Welcom to our Restful API')
})
//Get
app.get('/api/cats', (req, res) => {
    Cat.find({})
        .then(cats => res.json(cats)) // Si tout va bien, renvoie les chats
        .catch(err => {
            console.error(`There was an error: ${err}`); // Affiche l'erreur dans la console
            res.status(500).send('An error occurred while fetching cats'); // Renvoie une erreur au client
        });
});
//Post
app.post('/api/cats/create',(req,res)=>{
    const cat = new Cat({name: req.body.name})
    cat.save().then(()=>{
        res.send('data added successfully')
    })
})
//Put
// app.put('/api/cats/update/:_id', (req, res) => {
//     const id = req.params._id; // Récupère l'ID depuis le chemin
//     Cat.findByIdAndUpdate(id, { name: req.body.name }, (err) => {
//         if (err) {
//             console.log(`There is an error: ${err}`);
//             res.status(500).send('An error occurred while updating the data');
//         } else {
//             res.send('Data updated successfully');
//         }
//     });
// });
app.put('/api/cats/update/:_id', async (req, res) => {
    try {
        const id = req.params._id; // Récupérer l'ID depuis l'URL
        const updatedCat = await Cat.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

        if (!updatedCat) {
            return res.status(404).send('Cat not found'); // Si aucun chat trouvé, retourner une erreur 404
        }

        res.send('Data updated successfully');
    } catch (err) {
        console.error(`There was an error: ${err}`);
        res.status(500).send('An error occurred while updating the data');
    }
});

//Delete 
app.delete('/api/cats/remove/:_id',async (req,res)=>{
    try{
        const id = req.params._id;
        const deletedCat = await Cat.findByIdAndDelete(id);
        if(!deletedCat){
            return res.status(404).send('Cat not found');
        }

        res.send('Data deleted successfully')
    }catch(err){
        console.log(`There was an error:${err}`)
        res.status(500).send('An error occurred while deleting the data')
    }
    
})




let jwt = require('jsonwebtoken');

let token = jwt.sign({name:'test'},'mySecreteKey');
console.log(token);




// let fs = require('fs');

// let priveateKey = fs.readFileSync('private.key');
// let token = jwt.sign({name:'test'},priveateKey);
// console.log(token);



app.listen(3000, () => console.log("Server is running on port 3000"))

































//Get
// app.get('/api/cats',(req,res)=>{
//     Cat.find({},(err,cats)=>{
//         if(err){
//             console.log(`There was en error:${err}`)
//         }else{
//             res.json(cats)
//         }
//     })
// })