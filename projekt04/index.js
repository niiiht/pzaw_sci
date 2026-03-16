import express from "express";
import morgan from "morgan";
import movies, { checkPass } from "./models/movies.js";
const port = 8000;


const app = express();

app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));

app.get("/",(req,res)=> {
    res.render("login");
   
});

app.get("/login_site",(req,res) => {
    res.render("login");
});

app.get("/signup_site",(req,res) =>{
 res.render("signup");
});


app.get("/filmy", (req, res) => { 
res.render("filmy",{
    title:"filmy",
    nazwa: movies.mapout(),

});

});

app.get("/add_movie",(req,res)=>{
    res.render("add_movie", { title: "Dodaj film" });
});

app.post("/sign_up",(req,res) => {
    if(!checkPass(req.body.password,req.body.r_password)){
        console.log("passwords arent same");
        res.redirect("/signup_site");
       
    }else{
        res.redirect("/filmy");
    }
     

})

app.post("/movies/new",(req,res)=>{
    movies.addToList(req.body.movie_name,req.body.movie_synopis);
    console.log(req.body)
    
      res.redirect('/filmy');
    

    
});

app.post("/movies/delete", (req,res)=> {
    movies.deleteFromList(req.body.movie_id);
    console.log(req.body.movie_id);

    res.redirect('/filmy');
});

app.post("/movies/update", (req,res)=> {
   
    const movie = movies.mapout().find( m => m.movie_id == req.body.movie_id);
    console.log(movie);
    res.render('update_movie', {movie});

});

app.post("/movies/set_update", (req,res) =>{
    movies.updateMovieList(req.body.movie_id,req.body.movie_name,req.body.movie_synopis,req.body.movie_cover);
    res.redirect('/filmy');
});

app.listen(port, () => { 
  console.log(`Server listening on http://localhost:${port}`);
});