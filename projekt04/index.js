import express from "express";
import morgan from "morgan";
import movies, { checkPass } from "./models/movies.js";
import session from "express-session";
import cookieParser from "cookie-parser";

const port = 8000;
const app = express();

app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"));
app.use(cookieParser());

const sRouter = express.Router();
sRouter.use("/changeTheme", movies.themeChange);
app.use("/movies", sRouter);

function settings(req, res, next) {
  res.locals.app = movies.settings(req);
  res.locals.page = req.path;
  next();
}
app.use(settings);



app.get("/",(req,res)=> {
    res.render("login");
   
});

app.get("/login_site",(req,res) => {
    res.render("login");
});

app.get("/signup_site",(req,res) =>{
 res.render("signup");
});


app.get("/filmy",  (req, res) => {
    res.render("filmy", {
        title: "filmy",
        nazwa: movies.mapout()
    });
});



app.get("/add_movie",(req,res)=>{
    res.render("add_movie", { title: "Dodaj film" });
});

app.post("/sign_up",(req,res) => {

    if(!movies.checkPass(req.body.password,req.body.r_password)){
        return  res.render("signup", {
            error: "hasla nie sa takie same"
        });
       
    }else{
        movies.addPass(req.body.login,req.body.password);
       
        res.redirect("/filmy")

    }
});
app.post("/log_in", (req,res)=>{
    if(!movies.verifyU(req.body.login,req.body.password)){
        return      res.render("login", {
            error: "Niepoprawne dane"
        });
    }else{
       

        res.redirect('/filmy');
    };
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