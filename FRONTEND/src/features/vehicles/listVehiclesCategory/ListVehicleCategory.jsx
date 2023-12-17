import React, { useEffect, useState } from "react";
import { listVehiclesCategory } from "../../../services/vehicles.service";
import { useParams } from "react-router-dom";
import { VehiclesComponent } from "../VehiclesComponent";
import { SpinnerComponent } from "../../../shared/spinner/spinner";
import './ListVehicleCategory.css';


export const ListVehicleCategory = () => {


    const { title } = useParams();
    const [vehicles, setVehicles] = useState([]);
    const [loadingSpinner, setLoadingSpinner] = useState(true);


    useEffect(() => {

    listVehiclesCategory(title)
    .then(({data}) => {
        
        setVehicles(data);
        setLoadingSpinner(false);

        
    })
    .catch((error) => {
        console.log('error', error);
    });
}, []);

    return(
        
        <div>
            {loadingSpinner && <SpinnerComponent isOpened={loadingSpinner} />}
            <p>{title}</p>
            <VehiclesComponent vehicles={vehicles} />
        </div>

    )
}