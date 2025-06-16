import api from './api'
export function fetchTagsKids() {
  return api.get('/restaurants/tags')
}
