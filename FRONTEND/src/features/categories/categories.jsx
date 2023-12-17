import { useState, useEffect } from "react";
import { CategoryCardComponent } from "./components/category-card/category-card";
import './categories.css'
import { getAllCategories } from "../../services/categories.service";
import { SpinnerComponent } from "../../shared/spinner/spinner";
import {v4 as uuidv4} from "uuid";



export const CategoriesComponent = () => {

  const [categories, setCategory] = useState([]);
  const [loadingSppiner, setLoadingSpinner] =  useState(false)
  const v4Id = uuidv4();
  
  
  useEffect(() => {
    setLoadingSpinner(true)
    getAllCategories().then(({ data }) => { 
      setCategory(data)
      setLoadingSpinner(false)
    }).catch(() =>{
      setLoadingSpinner(false)
    })
  }, [])


return (
  <div className="categories-container" >
    
     { loadingSppiner && <SpinnerComponent isOpened={loadingSppiner} /> }
    { categories.length === 0 ?
      <p className="no-items">No registra categorias</p> :
      categories.map((category) => <CategoryCardComponent { ...category } key={category.title}/>) }
  </div>
)
}
