import { validateMovie, validateParcialMovie } from '../schemas/movies.js'

export class MovieController {

    constructor({ movieModel }){
        this.movieModel = movieModel
    }

    getAll = async (req, res) => {
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        
        res.json(movies)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModel.getId({ id })
    
        if (movie) return res.json(movie)
    
        res.status(404).json({ message: 'Movie not found'})
    }

    create = async (req, res) => {
        const result = validateMovie(req.body)
  
        if(result.error){
        return res.status(400).json({
            error: JSON.parse(result.error.message)
        })
        }
    
        // bd
        const newMovie = await this.movieModel.create(result.data)

        if(!newMovie) res.status(500).json({ message: 'Error creating the movie' })
    
        res.status(201).json(newMovie)
    }

    delete = async (req, res) => {
        const { id } = req.params
        const movieIndex = await this.movieModel.delete({ id })
    
        if(!movieIndex){
            res.status(404).json({ message: "Movie not found" })
            return
        }
    
        res.json({ message: "Movie deleted", id })
    }

    update = async (req, res) => {
        const { id } = req.params
        const result = validateParcialMovie(req.body)
        const data = result.data
        
        if(!result.success){
        return res.status(404).json({
            message: 'Movie not found'
        })
        }
        
        const updateMovie = await this.movieModel.update({ id, input: data })
        
        if(!updateMovie){
        return res.status(404).json({
            message: 'Movie not found'
        })
        }
    
        return res.json(updateMovie)
    }

}