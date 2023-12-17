import '../styles/search.css'
import { MdLocationOn } from 'react-icons/md'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { DateRangePickerComponent } from '../../utils/components/datepicker/datepicker'

export const SearchComponent = () => {

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Dispatch event search")
  }

  return (
    <form className="container" onSubmit={handleSubmit} >
      <section className='section-content'>
      <div className='search-item'>
        <div className='icon-container'>
          <MdLocationOn className='search-icon' />
        </div>
        <input type="text" placeholder='Buscar ubicación para mostrar los coches disponibles ...' />
        <div className='divider'></div>
        <div className='dropdown-container'>
          <RiArrowDropDownLine />
        </div>
      </div>
      </section>

      <section className='date-container'>
        <div className='section-content'>
        <DateRangePickerComponent />
        </div>
      
      </section>

      <input type='submit' className='search-button' value="Buscar" />
    </form>
  )
}