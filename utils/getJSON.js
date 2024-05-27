import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export function getJSON(path){
    return require(path)
}