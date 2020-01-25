let express = require ('express');
let morgan = require ('morgan');
let uuid = require('uuid/v4');

let app = express();
let bodyParser = require( "body-parser" );
let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use( morgan( 'dev' ) );

//Es para habilitar los CORs y permitir que otras personas accedan al servidor
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});


let blogs = [
    {
        id : uuid(),
        title : "Title#1",
        content : "content#1",
        author : "author#1",
        date : new Date('December 23, 1997 04:20:00')
    },
    {
        id : uuid(),
        title : "Title#2",
        content : "content#2",
        author : "author#2",
        date : new Date('December 24, 1997 04:20:00')
    },
    {
        id : uuid(),
        title : "b#3",
        content : "content#3",
        author : "author#3",
        date : new Date('December 25, 1997 04:20:00')
    },
];


app.get( '/blog-api/comentarios', (req, res) =>{
    let author = req.query.author;
    let blogList = [];
    //console.log(author);
    if(!author){
        return res.status(200).json(blogs);
    }

    if(author == ''){
        res.statusMessage = 'Please specify the Author';
        return res.status(406).json({message : "Author Field is Empty", status : 406});
    }
    for(let i = 0; i < blogs.length; i++){
        if(author == blogs[i].author){
            blogList.push(blogs[i]);
        }
    }
    if(blogList.length == 0){
        res.statusMessage = 'Unrecognized author';
        return res.status(404).json({message : "Author does not exist", status : 404});
    }
    return res.status(200).json(blogList);
});


app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    let title = req.body.title;
    let author = req.body.author;
    let content = req.body.content;
    let date = req.body.date;
    
    if(!title || !author || !content || !date){
        res.statusMessage = 'Please specify all the requested parameters';
        return res.status(406).json({
            "error" : "Missing field",
            "status" : 406
        });
    }
    let newBlog = {
        id : uuid(),
        title : title,
        author : author,
        content : content,
        date : date
    };
    blogs.push(newBlog);
    return res.status(201).json(newBlog);
});



app.delete( '/blog-api/remover-comentario/:id', (req, res) => {
    let id = req.params.id;
    console.log('deleting = ' + id);
    if(!id){
        res.statusMessage = 'Please specify the id of the element you want to delete';
        return res.status(404).json({
            error : "Missing field",
            status : 404
        });
    }
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == id){
            blogs.splice(i, 1);
            return res.status(200).json({message : 'item deleted', status : 200});
        }
    }
    res.statusMessage = 'There is no Element with that ID';
    return res.status(404).json({error : "Could not finf element with that id", status : 404});
});



app.put( '/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    let urlID = req.params.id;   
    let bodyID = req.body.id;

    if(!bodyID || bodyID == ''){
        res.statusMessage = 'Missing ID';
        return res.status(406).json({
            error : "Missing ID",
            status : 406
        });
    }
    if(urlID != bodyID){
        res.statusMessage = 'Id do not match';
        return res.status(409).json({
            error : "Id's do not match",
            status : 409
        });
    }
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].id == bodyID){
            if(req.body.title && req.body.title != ''){
                blogs[i].title = req.body.title;
            }
            if(req.body.content && req.body.content != ''){
                blogs[i].content = req.body.content;
            }
            if(req.body.author && req.body.author != ''){
                blogs[i].author = req.body.author;
            }
            if(req.body.date && req.body.date != ''){
                blogs[i].date = req.body.date;
            }
            return res.status(202).json(blogs[i]);
        }
    }
    res.statusMessage = 'No element with the specified id';
    return res.status(404).json({error : "Couldnt find element with that id", status : 404});
});

app.listen('8080', ()=>{
    console.log("App running on localhost:8080");
});