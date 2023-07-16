import { useState } from "react"
import { useNavigate } from "react-router-dom";


const SearchOrder = () => {
  const [query,setQuery] = useState()
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if(!query) return
    navigate(`/order/${query}`);
    setQuery("");

  }
  return (
    <form onSubmit={handleSubmit}>

    <input placeholder="Search Order" value={query} onChange={e => setQuery(e.target.value)}/>

    <button>Submit</button>

    </form>

  )
}

export default SearchOrder
