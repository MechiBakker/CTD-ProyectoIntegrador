import { SearchComponent } from "./components/search"
import { VehiclesComponent } from '../vehicles/VehiclesComponent'
import { CategoriesComponent } from "../categories/categories"
import { useState, useEffect } from "react";
import { getAllVehicles } from '../../services/vehicles.service'

import './styles/main.css'
import { SessionContext, actions } from "../../contexts/session.context"
import { useContext } from "react"

export const MainComponent = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loadingSppiner, setLoadingSpinner] =  useState(true);
  const { dispatch } = useContext(SessionContext);


  useEffect(() => {
    getAllVehicles().then(({ data }) => {
        setVehicles(data);
        setLoadingSpinner(false);
      }).catch(() =>{
        setLoadingSpinner(false);
      });
  }, []);


  return (
    <div className="main-container">
      <section className="search-container">
      <h1 className="title-main">Alquila el mejor auto para ti</h1>
      <SearchComponent />
      </section>
      
      <section className="categories-section">
      <span className="section-item">Categorías</span>
      <CategoriesComponent />
      </section>

      <section className="vehicles-section">
      <span className="section-item">Recomendaciones de autos</span>
      <div className="vehicles-container">
      <VehiclesComponent vehicles={vehicles}/>
      </div>
      </section>
    </div>
  )
}