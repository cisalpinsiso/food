import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [food, setFood] = useState([])
  const [tab, setTab] = useState('foods')
  const [favorites, setFavorites] = useState([])

  const searchFood = async (e) => {
    e.preventDefault()
    const fetch = async () => {
      const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
      if (!data.meals) return setFood([])
      setFood(data.meals)
    }
    fetch()
  }

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get('/api/favorites')
      setFavorites(data)
    }
    fetch()
  }, [])

  const addFavorite = async (meal) => {
    await axios.post('/api/favorites', meal)
    setFavorites([...favorites, meal])
  }

  const removeFavorite = async (id) => {
    await axios.delete(`/api/favorites/${id}`)
    setFavorites(favorites.filter(f => f.idMeal !== id))
  }

  return (
    <>
      <h1>Food</h1>
      <div className="tabs">
        <button onClick={() => setTab('foods')} className={tab === 'foods' ? 'active' : ''}>Foods</button>
        <button onClick={() => setTab('favorites')} className={tab === 'favorites' ? 'active' : ''}>Favorites</button>
      </div>
      {tab === 'foods' && (
        <>
          <form onSubmit={searchFood}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            <button>Search</button>
          </form>
          <div className="food">
            {food.length === 0 && <p>No food to display</p>}
            {food.map((f, i) => (
              <div key={i} className="card">
                <img src={f.strMealThumb} alt={f.strMeal} />
                <h2>{f.strMeal}</h2>
                <button onClick={() => addFavorite(f)}>Add to favorites</button>
              </div>
            ))}
          </div>
          <div className="alphabet">
            {
              'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => (
                <button key={i} onClick={() => {
                  setSearch(letter);
                  searchFood({ preventDefault: () => { } });
                }}>{letter}</button>
              ))
            }
          </div>
        </>
      )}
      {tab === 'favorites' && (
        <div className="food">
          {favorites.length === 0 && <p>No favorite to display</p>}
          {favorites.map((f, i) => (
            <div key={i} className="card">
              <img src={f.strMealThumb} alt={f.strMeal} />
              <h2>{f.strMeal}</h2>
              <button onClick={() => removeFavorite(f.idMeal)}>Remove from favorites</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default App