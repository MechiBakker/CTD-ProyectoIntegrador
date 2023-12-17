
import { BsFillPersonFill } from 'react-icons/bs';
// import { MdLocationOn } from 'react-icons/md';
import '../../styles/vehiclecardcomponent.css'
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';





export const VehicleCardComponent = ({ imageUrl, name, description, nameCategory, passengerCapacity, plate}) => {
  const defaultValues = {
    rate: 5,
    rateDescription: 'Muy bueno',
    category: 'PREMIUM',
    passengerCapacity: 5

  };


  const [rating, setRating] = useState(null);
  const[hover, setHover] = useState(null);
  

  
  return (
    <div className="card-container">
      <section className='img-container'>
        <NavLink to={`/product-details/${plate}`} className='card-content'>
          <div className='img-vehicle' style={{ backgroundImage: `url(${imageUrl})` }}></div>
        </NavLink>
      </section>
      
      <section className='card-content'>
        <div className="rate-content">
          <span>{nameCategory} </span>
          <div className='rate-description'>
            <span className='rate'> {defaultValues.rate} </span>
            <span> {defaultValues.rateDescription} </span>
          </div>
        </div>

        <h1 className='card-title'>{name}</h1>

        <div className='details-container'>
          <div className='details-item'>
            <BsFillPersonFill className='item-icon' />
            <span>Capacidad de pasajeros: </span>
            <span className='item-rate'>{passengerCapacity}</span>
          </div>
        </div>

        <div className='description'>
          <span className='description-text'>{description}</span>
        </div>

        <div className="reating">
        {[...Array(5)].map((star, index) => {
        const currentRating = index + 1;
        return(
          <label>
            <input 
              type="radio" 
              name="rating"
              value={currentRating}
              onClick={() => setRating(currentRating)}
           />
            <FaStar 
              className='star' 
              size={20} 
              color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}

      <p>calificación: {rating}</p>
    </div>

      </section>

    </div>
  )
}