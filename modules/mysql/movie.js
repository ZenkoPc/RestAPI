import mysql from 'mysql2/promise'
import { getGenres } from '../../utils/getGenres.js'

const config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORTBD,
    password: process.env.MYSQL_PASSWORDBD,
    database: process.env.MYSQL_SELECTEDBD
}

const connection = await mysql.createConnection(config)

export class MovieModel {

    static async getAll ({ genre }) {

        const [all_genres] = await connection.query(
            `SELECT id, name FROM genre;`
        )

        const [all_movies_genres] = await connection.query(
            `SELECT BIN_TO_UUID(movie_id) movie_id, genre_id FROM movie_genres;`
        )

        if(genre){
            const genreLower = genre.toLowerCase()

            const [genres] = await connection.query(
                `SELECT id, name FROM genre WHERE LOWER(name) =?;`, [genreLower]
            )

            if(genres.length === 0) return []

            const [{ id }] = genres
            
            const [movie_genres] = await connection.query(
                `SELECT BIN_TO_UUID(movie_id) movie_id FROM movie_genres WHERE genre_id = ?`, [id]
            )
            
            const [movies] = await connection.query(
                `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;`
            )

            if(movies.length === 0) return []

            const result_movies = getGenres(all_genres, all_movies_genres, movies, movie_genres)

            if(result_movies.length === 0) return []

            return result_movies
        }

        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;'
        )

        if(movies.length === 0) return []

        const result_movies = getGenres(all_genres, all_movies_genres, movies, [])
        
        return result_movies
    }

    static async getId ({ id }) {
        
        const [movies] = await connection.query(
            'SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);',
            [id]
        )

        if(movies.length === 0) return null

        return movies[0]

    }

    static async create (input) {
        
        const {
            genre: genreInput,
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidRes] = await connection.query(`SELECT UUID() uuid`)
        const [{ uuid }] = uuidRes

        try{
            await connection.query(
                `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
                (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
                [uuid, title, year, director, duration, poster, rate]
            )
        }catch(e){
            //throw new Error('Error creating movie')
            return false
        }

        const [newMovie] = await connection.query(
            `SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie 
            WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        )

        return newMovie[0]

    }

    static async delete ({ id }) {

        try{
            const [movie] = await connection.query(
                `SELECT title FROM movie WHERE id = UUID_TO_BIN(?);`,
                [id]
            )
    
            if(movie.length !== 1){
                return false
            }

            await connection.query(
                `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
                [id]
            )
        }catch(e){
            return false
        }

        const [deletedMovie] = await connection.query(
            `SELECT title FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
        )
        
        if(deletedMovie.length === 1) return false

        return true
    }

    static async update ({ id, input }) {
        
        const [selectedMovie] = await connection.query(
            `SELECT title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);`,
            [id]
        )

        if(selectedMovie.length === 0) return false

        const updatedMovie = {
            ...selectedMovie[0],
            ...input
        }
        
        try{
            await connection.query(
                `UPDATE movie 
                SET title=?, year=?, director=?, duration=?, poster=?, rate=?
                WHERE id = UUID_TO_BIN(?);`,
                [updatedMovie.title, updatedMovie.year, updatedMovie.director,
                updatedMovie.duration, updatedMovie.poster, updatedMovie.rate, id]
            )
        }catch(e){
            return false
        }

        return updatedMovie

    }

}