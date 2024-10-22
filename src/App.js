import { useEffect, useState } from "react";
import "./assets/css/index.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "react-bootstrap/Pagination";

export const api = "https://pokeapi.co/api/v2/pokemon";

function App() {
  const [page, setPage] = useState(1);
  const [originalPokemonList, setOriginalPokemonList] = useState([]);
  const [pokemonList, setPokemonList] = useState([]);
  const [showElement, setShowElement] = useState(false);
  const [pokemon, setPokemon] = useState({});

  // Call API
  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1302:`)
      .then((res) => {
        return res.data.results;
      })
      .then((res) => {
        const subAPI = res.map((item) => item.url);
        return Promise.all(subAPI.map((url) => axios.get(url)));
      })
      .then((res) => {
        setOriginalPokemonList(res.map((item) => item.data));
      });
  }, []);

  const itemsPerPage = 20; // Số lượng mục mỗi trang

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    setPokemonList(originalPokemonList.slice(startIndex, endIndex));
  }, [page, originalPokemonList]);

  // Pagination
  const handlePageChange = (e) => {
    const pageValue = Number(e.currentTarget.textContent);
    setPage(pageValue);
  };

  const handleShowProperties = (item) => {
    setPokemon(item);
    setShowElement(true);
  };

  const handleHideProperties = () => {
    setShowElement(false);
  };

  const searchPorkemons = (e) => {
    const value = e.target.value;
    console.log(value);
    const filteredPokemons = originalPokemonList.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setPokemonList(filteredPokemons);
  };

  return (
    <>
      <header id="header" className="container mt-5">
        <div className="row">
          <div className="col-12 col-lg-6">
            <h2 className="title fw-bold">Pokedéx</h2>
            <p className="m-0">
              Search for Pokémon by name or using the National Pokédex number
            </p>
          </div>
          <div className="col-12 col-lg-6">
            <form action="" className="mt-3">
              <input
                type="text"
                name="search"
                placeholder="What Pokémon are you looking for?"
                onChange={searchPorkemons}
              />
            </form>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="row g-3">
          {pokemonList.map((item, index) => {
            return (
              <div key={index} className="col-12 col-md-6 col-lg-4 col-xxl-3">
                <div
                  className={`card-pokemon d-flex justify-content-between bg-${item.types[0].type.name}`}
                  onClick={() => handleShowProperties(item)}
                >
                  <div>
                    <span className="fw-medium">{`# ${
                      index + 1 + 20 * (page - 1)
                    }`}</span>
                    <h5 className="card-title text-white fw-bold text-capitalize">
                      {item.name}
                    </h5>
                    <ul className="card-type_properties list-unstyled d-flex">
                      {item.types.map((type, index) => (
                        <li
                          key={index}
                          className={`text-white text-center text-capitalize ${type.type.name}_type`}
                        >
                          {type.type.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <img
                      src={item.sprites.front_default}
                      alt={item.name}
                      className="card-img-top object-fit-contain"
                      width={96}
                      height={96}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <footer
        id="footer"
        className="d-flex align-items-center justify-content-center mt-5"
      >
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          <Pagination.Item onClick={handlePageChange}>{1}</Pagination.Item>
          <Pagination.Item onClick={handlePageChange}>{2}</Pagination.Item>
          <Pagination.Item onClick={handlePageChange}>{3}</Pagination.Item>
          <Pagination.Item onClick={handlePageChange}>{4}</Pagination.Item>
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </footer>

      {showElement && (
        <div
          className="properties-pokemon d-flex align-items-center justify-content-center"
          onClick={handleHideProperties}
        >
          <div className="card-properties_pokemon">
            <div className="card-properties__body h-100">
              <div className="row h-100">
                <div className={`col-6 bg-${pokemon.types[0].type.name}`}>
                  <div className="card-properties__abilities text-center">
                    <h2 className="card-abilities__name text-capitalize text-white fw-bold m-0">
                      {pokemon.name}
                    </h2>
                    <img
                      className="card-abilities__img object-fit-cover"
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                    />
                    <h3 className="card-abilities__h3 text-white m-0 fw-bold">
                      Abilities
                    </h3>
                    <ul className="card-abilities__list list-unstyled mb-0">
                      {pokemon.abilities.map((ability, index) => (
                        <li
                          key={index}
                          className={`card-abilities__item text-capitalize text-white ${pokemon.types[0].type.name}_type`}
                        >
                          {ability.ability.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-6 ">
                  <div className="card-properties__stats">
                    <h3 className="card-stats__h3 fw-bold">Basic Stats</h3>
                    <ul className="card-stats__list list-unstyled">
                      {pokemon.stats.map((stat, index) => (
                        <li
                          key={index}
                          className="card-stats__item text-capitalize"
                        >
                          {stat.stat.name.replaceAll("-", " ")} {stat.base_stat}
                          <div
                            className="card-stats__ruler"
                            style={{ "--ruler-width": `${stat.base_stat}px` }}
                          ></div>
                        </li>
                      ))}
                    </ul>
                    <strong>Total: </strong>{" "}
                    {pokemon.stats.reduce(
                      (acc, curr) => acc + curr.base_stat,
                      0
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
