export function getGenres(all_genres, all_movies_genres, movies, movie_genres){
    const result_movies = []

    movie_genres.length !== 0 ?
    movies.map((movie) => {
        if(movie_genres.find(genre => genre.movie_id === movie.id)){
            
            const genresIndex = []
            const genres = []

            all_movies_genres.map((genre) => {
                if(genre.movie_id === movie.id){
                    genresIndex.push(genre.genre_id)
                }
            })

            genresIndex.map((index) => {
                all_genres.map((genre) => {
                    if(index === genre.id){
                        genres.push(genre.name)
                    }
                })
            })
            
            result_movies.push({
                ...movie,
                genres
            })
        }
    })
    : 
    movies.map((movie) => {
        const genresIndex = []
        const genres = []

        all_movies_genres.map((genre) => {
            if(genre.movie_id === movie.id){
                genresIndex.push(genre.genre_id)
            }
        })

        genresIndex.map((index) => {
            all_genres.map((genre) => {
                if(index === genre.id){
                    genres.push(genre.name)
                }
            })
        })
            
        result_movies.push({
            ...movie,
            genres
        })
    })

    if(result_movies.length === 0) return []

    return result_movies
}