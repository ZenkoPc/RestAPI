import { corsMiddleware } from './middlewares/cors.js'
import { createMovieRouter } from './routes/movies.js'
import express, { json } from 'express'
import { config } from 'dotenv'
config()

export const createApp = ({ movieModel }) => {

  const app = express()
  const PORT = process.env.PORT ?? 1234

  app.use(corsMiddleware())
  app.disable('x-powered-by')
  app.use(json())

  // endpoint de movies
  app.use('/movies', createMovieRouter({ movieModel}))

  app.listen(PORT, () => {
      console.log('listening on port: ', PORT)
  })

}