import AddProduct from "../../AddProducts/components/AddProduct"
import { useLocation } from "react-router-dom"

export const EditVehicleComponent = () => {
  const location = useLocation().pathname;
  const paths = location.split('/')


  return (
    <AddProduct  isEdit={true} plate={paths[paths.length -1]}/>
  )
}