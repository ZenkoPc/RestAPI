const express = require('express')
const crypto = require('node:crypto')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT ?? 1234

const movies = require('./movies.json')
const { validateMovie, validateParcialMovie } = require('./schemas/movies')

app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            'http://localhost:1234',
            'http://localhost:8080'
        ]

        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true)
        }

        if(!origin){
            return callback(null, true)
        }

        return callback(new Error('Not allowed by CORS'))
    }
}))
app.disable('x-powered-by')
app.use(express.json())

// endpoint de movies
app.get('/movies', (req, res) => {

  // obtener el query del url, http://asd.com/movie?query=asd
  const { genre } = req.query
  if(genre){
    const filteredMovies = movies.filter(
        movie => movie.genre.some(
            g => g.toLowerCase() === genre.toLowerCase()
        )
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if(result.error){
    return res.status(400).json({
        error: JSON.parse(result.error.message)
    })
  }

  // bd
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.get('/movies/:id', (req, res) => {// path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)

  if (movie) return res.json(movie)

  res.status(404).json({
    message: 'Movie not found'
  })
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if(movieIndex === -1){
    res.status(404).json({ message: "Movie not found" })
  }
  
  movies.splice(movieIndex,1)

  res.json({ message: "Movie deleted", id })
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validateParcialMovie(req.body)
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if(!result.success){
    return res.status(404).json({
        message: 'Movie not found'
    })
  }

  if(movieIndex < 0){
    return res.status(404).json({
        message: 'Movie not found'
    })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.listen(PORT, () => {
    console.log('listening on port: ', PORT)
})