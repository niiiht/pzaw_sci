const movie_list = [{name:"Matrix"}, { name: "Bliskie spotkanie trzeciego stopnia"}, {name:"Goonies"}];
export function addToList(movie) {
movie_list.push({name:movie});

} 
export function mapout(){
return movie_list.map(movie => ({ name: movie.name }));
}
export default{
mapout,
addToList
};