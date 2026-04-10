    import { DatabaseSync } from "node:sqlite";
import { run } from "node:test";
import crypto from "crypto";

    const db_path = "./movies.sqlite";
    const db = new DatabaseSync(db_path, { readBigInts: true });
    const one_hour =  60 * 60 * 1000;
const theme_cookie = "page-theme";

    console.log("Tworzenie tabelki");

    db.exec(
    `CREATE TABLE IF NOT EXISTS  movies (
        movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        synopis TEXT NOT NULL,
        cover TEXT,
        user_id INTEGER
    );`
    );

       db.exec(
    `CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT UNIQUE NOT NULL,
        hash TEXT NOT NULL,
        salt TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      
    );`
    );






    const movie_list = [{name:"Matrix", synopis:"Neo believes that Morpheus, an elusive figure considered to be the most dangerous man alive, can answer his question -- What is the Matrix? Neo is contacted by Trinity, a beautiful stranger who leads him into an underworld where he meets Morpheus. They fight a brutal battle for their lives against a cadre of viciously intelligent secret agents. It is a truth that could cost Neo something more precious than his life.",link:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeHBbHTfcNjyfpwzq-PxSxW35xKZlqZ8g39Q&s"}, 
        { name: "Close Encounters of the Third Kind", synopis:"Science fiction adventure about a group of people who attempt to contact alien intelligence. Roy Neary (Richard Dreyfuss) witnesses an unidentified flying object, and even has a 'sunburn' from its bright lights to prove it. Roy refuses to accept an explanation for what he saw and is prepared to give up his life to pursue the truth about UFOs.",link:"https://cms.ntflxthtrs.com/uploads/close_encounter_of_the_third_kind_EGYPTIAN_POSTER_e01660bddc.jpg"}, 
        {name:"Goonies", synopis:"Old-fashioned yarn about a band of adventurous kids who take on the might of a property developing company which plans to destroy their home to build a country club. When the children discover an old pirate map in the attic, they follow it into an underground cavern in search of lost treasure but come up against plenty of dangerous obstacles along the way.", link: "https://upload.wikimedia.org/wikipedia/en/c/c6/The_Goonies.jpg"}];

    const db_insert = db.prepare('INSERT INTO movies (name, synopis, cover,user_id) VALUES (?, ?, ?,?)');
    const db_select = db.prepare('SELECT * FROM movies');
    const db_delete = db.prepare('DELETE FROM movies WHERE movie_id = ?');
    const db_update = db.prepare(' UPDATE movies SET name = ?, synopis = ?, cover = ? WHERE movie_id = ?');
    const db_users_insert = db.prepare('INSERT INTO users (login, hash,salt) VALUES (?,?,?)');
    const db_users_select = db.prepare('SELECT * FROM users WHERE login = ?');

    if (process.env.POPULATE_DB) {
    console.log("Dodawanie danych testowych");

    for (let movie of movie_list) {
      let item = db_insert.run(movie.name,movie.synopis,movie.link)
      console.log("Stworzono wpis :", movie);
    }
  }
const adminExists = db.prepare('SELECT * FROM users WHERE login = ?').get('admin');

if (!adminExists) {
    const salt = crypto.randomBytes(128).toString('base64');
    const hash = crypto.pbkdf2Sync('haslo123', salt, 100000, 64, 'sha512').toString('hex');

    db.prepare('INSERT INTO users (login, hash, salt, role) VALUES (?, ?, ?, ?)')
      .run('admin', hash, salt, 'admin');
}

    export function addToList(movie,syn,link,user_id) {
        db_insert.run(movie,syn,link || 'https://assets.upflix.pl/media/plakat/2003/barbie-of-swan-lake__300_427.jpg',user_id);

    } 

    export function deleteFromList(movie_id){
        db_delete.run(movie_id)
    }

    export function updateMovieList(movie_id,movie_name,movie_syn,movie_link){
        db_update.run(movie_name,movie_syn,movie_link,Number(movie_id));

    }

    export function mapout(){
    const query =  db_select.all();
    const result = query.map(query => ({
        movie_id : query.movie_id,
        name: query.name,
        synopis: query.synopis,
        link: query.cover
    })) 
    return result;          //funkcja mapout zwraca listę filmów
    }

    export function checkPass(pass,r_pass){
        return pass === r_pass;
    } 
    export function getUser(login){
    return db_users_select.get(login);
}

    export function addPass(login,pass){
        const salt = crypto.randomBytes(128).toString('base64');
        const iterations = 100000;
        const keylen = 64;
        const digest = 'sha512';

        const hash = crypto.pbkdf2Sync(pass, salt, iterations, keylen, digest).toString('hex');

        db_users_insert.run(login, hash, salt);


  

    }

    export function verifyU(login,pass){
        const user_data = db_users_select.get(login);

        if(!user_data){

         return false;
        }
        const hash = crypto.pbkdf2Sync(pass,user_data.salt,100000,64,'sha512').toString('hex');
      

        return hash === user_data.hash; 



    }

    	

export function getMovieById(id){
    return db.prepare('SELECT * FROM movies WHERE movie_id = ?').get(id);
}



export function themeChange(req, res) {
  var theme = req.cookies[theme_cookie];
  if (theme === "pink") {
    theme = "purple";
  } else {
    theme = "pink";
  }
  res.cookie(theme_cookie, theme);

  var next = req.query.next || "/";
  res.redirect(next);
}

export function settings(req) {
  const settings = {
    theme: req.cookies[theme_cookie] || "pink",
  };
  return settings;
}


    export default{
    mapout,
    addToList,
    deleteFromList,
    updateMovieList,
    checkPass,
    addPass,
    verifyU,
    settings,
    themeChange,
    getUser,
    getMovieById
    };