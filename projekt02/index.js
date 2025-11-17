import express from "express";
import movies from "./models/movies.js";

const port = 8000;
const app = express();


app.set("view engine", "ejs");
app.set('views', './views');

app.get("/", (req, res) => { 
res.render("filmy",{
    title:"filmy",
    nazwa: movies.mapout(),

});
console.log("GET / działa poprawnie");
});

app.post("/", (req,res)=>{
  console.log("dupa");  
})
app.listen(port,() =>{
    console.log(`Server listening on http://localhost:${port}`);
});
