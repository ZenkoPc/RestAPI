import { getJSON } from '../../utils/getJSON.js'
import { randomUUID } from 'node:crypto'

const movies = getJSON('../movies.json')

export class MovieModel {

    static async getAll ({ genre }) {
        if(genre){
            return movies.filter(
                movie => movie.genre.some(
                    g => g.toLowerCase() === genre.toLowerCase()
                )
            )
        }
        return movies
    }

    static async getId ({ id }) {
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create (input) {
        const newMovie = {
            id: randomUUID(),
            ...input
        }
        
        movies.push(newMovie)

        return newMovie
    }

    static async delete ({ id }) {
        const index = movies.findIndex(movie => movie.id === id)

        if(index === -1) return false

        movies.splice(index,1)

        return true
    }

    static async update ({ id, input }) {
        const index = movies.findIndex(movie => movie.id === id)
        if(index === -1) return false
        
        movies[index] = {
            ...movies[index],
            ...input
        }

        return movies[index]
    }

}