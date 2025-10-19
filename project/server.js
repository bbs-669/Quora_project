const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid"); 
//requiring method override to handle patch requests 
const methodOverride = require("method-override");


app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
//handling patch request if the client side cannot send a patch request such that if any post request comes with a query string stating that _method="PATCH" we have to consider the POST request as PATCH request.
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const userData = 
    [
        {id:uuidv4(),
        user:"BBS",
        post:"Hello All I am new to Quora"},

        {id:uuidv4(),
        user:"sastra",
        post:"Sastra deemed university"},

        {
        id:uuidv4(),
        user:"kingmaker",
        post:"Kingmaker is gonna fight his battle"}
    ];
    

app.listen(8080,()=>{
    console.log("App listening on the port 8080");
});

app.get("/posts",(req,res)=>{
    res.render("index",{userData});
});

app.get("/posts/new",(req,res)=>{
    res.render("new.ejs");
});

app.post("/posts",(req,res)=>{
    let {username,content}= req.body;
    userData.push({id:uuidv4(),user:username,post:content});
     res.redirect("/posts");
});

app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let data = userData.find((p)=>id === p.id);
    res.render("post.ejs",{data});
});

app.patch("/posts/:id",(req,res)=>{
    let{id} = req.params;
    let newPost = req.body.post;
    let Post = userData.find((p)=>id===p.id);
    Post.post = newPost;
    res.redirect("/posts");
});

app.get("/posts/:id/edit",(req,res)=>{
    let {id} = req.params;
    let post = userData.find((p)=>p.id === id);
    res.render("edit.ejs",{post});
});

app.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let toDeletePost = userData.find((p)=>id===p.id);
    let deleteIndex = userData.indexOf(toDeletePost);
    if(deleteIndex!==-1){
        userData.splice(deleteIndex,1);
    }
    res.redirect("/posts");
});

app.use("/",(req,res)=>{
    res.send("Error");
});