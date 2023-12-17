import { useState, useEffect } from "react";
import { VehicleCardComponent } from "./components/Card/VehicleCardComponent";
import './styles/vehiclescomponent.css'
import { SpinnerComponent } from "../../shared/spinner/spinner";


export const VehiclesComponent = ({vehicles}) => {
  const [loadingSppiner, setLoadingSpinner] =  useState(false)
  


  useEffect(() => {
    // setLoadingSpinner(true)
  }, [])

  return (
    <div className="vehicles-list">
       { loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} /> }
      { vehicles.length === 0 ?
        <p className="no-items">No se registra vehiculos</p> :
        vehicles.map((vehicle) => <VehicleCardComponent { ...vehicle } key={ vehicle.plate }/>) }
    </div>
  )

}