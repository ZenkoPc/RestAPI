import { createApp } from "./app.js";
import { MovieModel } from './modules/mysql/movie.js'

createApp({ movieModel: MovieModel })