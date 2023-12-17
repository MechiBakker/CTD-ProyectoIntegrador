import './category-card.css'
import { useNavigate } from 'react-router-dom';

export const CategoryCardComponent = ({ title, description, imageUrl }) => {
  const navigate = useNavigate();


  const clickCategoriesHandler = (e) => {
    // e.preventDefault();
    navigate(`/list-vehicle-category/${title}`)

  }
  
  return (
    <div className='category-container' onClick={clickCategoriesHandler}>
        

        <section className='container-img' >
          <div className='category-img' style={{ backgroundImage: `url(${imageUrl})` }}></div>
        </section>
        <p className='category-title'>{title}</p>
      
    </div>
  )
} 