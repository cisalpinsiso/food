import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [food, setFood] = useState([])
  const [tab, setTab] = useState('foods')
  const [favorites, setFavorites] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    console.log('scrollY', scrollY)
  }, [scrollY])

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
    alert('Added to favorites')
    setFavorites([...favorites, meal])
  }

  const removeFavorite = async (id) => {
    await axios.delete(`/api/favorites/${id}`)
    alert('Removed from favorites')
    setFavorites(favorites.filter(f => f.idMeal !== id))
  }

  return (
    <>
      {selectedFood ? (
        <div className="modal" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedFood.strMeal}</h2>
            <img src={selectedFood.strMealThumb} alt={selectedFood.strMeal} />
            <p>{selectedFood.strInstructions}</p>
            <form onSubmit={e => e.preventDefault()}>
              <button onClick={() => addFavorite(selectedFood)}>Add to favorites</button>
              <button onClick={() => setSelectedFood(null)}>Close</button>
            </form>
          </div>
        </div>
      ) :
        (
          <>
            <h1>Food</h1>
            <div className="tabs">
              <button onClick={() => setTab('foods')} className={tab === 'foods' ? 'active' : ''}>Foods</button>
              <button onClick={() => setTab('favorites')} className={tab === 'favorites' ? 'active' : ''}>Favorites</button>
            </div>
            <div className='arrows'>
              <button className={`arrowUp ${scrollY === 0 && "hidden"}`} onClick={() => window.scrollTo(0, 0)}>↑</button>
              <button className={`arrowDown ${scrollY > 0 && "hidden"}`} onClick={() => window.scrollTo(0, document.body.scrollHeight)}>↓</button>
            </div>
            {
              tab === 'foods' ? (
                <>
                  <form onSubmit={searchFood}>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                    <button>Search</button>
                  </form>
                  <div className="food">
                    {food.length === 0 && <p>No food to display</p>}
                    {food.map((f, i) => (
                      <div key={i} className="card">
                        <img src={f.strMealThumb} alt={f.strMeal} onClick={() => setSelectedFood(f)} />
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
              )
                :
                (
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
    </>
  )
}

export default App