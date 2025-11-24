import express from "express";
import movies from "./models/movies.js";

const port = 8000;
const app = express();


app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.urlencoded());

app.get("/", (req,res) => {
  res.redirect(`/filmy`);
  console.log("GET / działa poprawnie");
})

app.get("/filmy", (req, res) => { 
res.render("filmy",{
    title:"filmy",
    nazwa: movies.mapout(),

});
console.log("GET /filmy działa poprawnie");
});

app.post("/filmy/nowe", (req,res)=>{
movies.addToList(req.body.movie_name);

  res.redirect(`/filmy`);
  console.log("post działa poprawnie"); 
   });
app.listen(port,() =>{
    console.log(`Server listening on http://localhost:${port}`);
});
