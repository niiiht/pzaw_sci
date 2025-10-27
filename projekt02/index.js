import express from "express";
const port = 8000;
const app = express();


app.set("view engine", "ejs");
app.set('views', './views');

app.get("/", (req, res) => { 
res.render('index');
console.log("GET / działa poprawnie")
});


app.listen(port,() =>{
    console.log(`Server listening on http://localhost:${port}`);
});