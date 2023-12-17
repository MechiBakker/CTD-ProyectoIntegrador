import "./App.css";
import { MainComponent } from "./features/main/main";
import { HeaderComponent } from "./features/header/header";
import { FooterComponent } from "./features/footer/footer";
import AddProduct from "./features/AddProducts/components/AddProduct";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminComponent } from "./features/pages/admin/admin";
import AddCategory from "./features/categories/category-form/categorieForm";
import { EditVehicleComponent } from "./features/EdirProducts/components/EditVehicle";
import { CreateAcount } from "./form/components/create_User/createAcount";
import ProductDetails from "./features/ProductDetails/ProductDetails";
import { LoginForm } from "./form/components/login/Loginform";
import { ListVehicleCategory } from "./features/vehicles/listVehiclesCategory/ListVehicleCategory";
import { SessionProvider } from "./contexts/session.context";
import { Profile } from "./features/pages/users/profile";
import ManageProducts from "./features/management/product/ManageProducts";
import { ManageRolesComponent } from "./features/management/role/ManageRole";
import ManageCategories from "./features/management/managementCategories/ManageCategories";
import {GetAllBookingsForEmail} from "./features/bookings/BookingScreen";
import { UserConfirmComponent } from "./features/UserConfirm/UserConfirm";
import { ManageUsersComponent } from "./features/management/users/ManageUsers";



export const App = () => {

  return (
    <>
      <SessionProvider>
      <BrowserRouter>
        <section className="header-content">
          <HeaderComponent />
        </section>
        <section className="main">
          <main>
            <Routes>
              <Route path="/" element={<MainComponent />}></Route>
              <Route path="/admin" element={<AdminComponent />}></Route>
              <Route path="/home" element={<MainComponent />}></Route>
              <Route path="/add-vehicle" element={<AddProduct />}></Route>
              <Route path="/add-category" element={<AddCategory/>}></Route>
              <Route path="/product-details/:plate" element={<ProductDetails />}></Route>
              <Route path="/edit-vehicle/:plate" element={<EditVehicleComponent />}></Route>
              <Route path="/create-account" element={<CreateAcount />}></Route>
              <Route path="/users/confirmation/:token" element={<UserConfirmComponent /> }></Route>
              <Route path="/login" element={<LoginForm />}></Route>
              <Route path="/admin/manage-products" element={<ManageProducts />}></Route>
              <Route path="/admin/manage-users" element={<ManageUsersComponent />}></Route>              
              <Route path="/admin/manage-roles" element={<ManageRolesComponent />}></Route>
              <Route path="/admin/manage-categories" element={<ManageCategories />}></Route>
              <Route path="/list-vehicle-category/:title" element={<ListVehicleCategory/>}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/my-bookings" element={<GetAllBookingsForEmail/>}></Route>
              <Route path="*" element={<div>ruta no definida</div>}></Route>
            </Routes>
          </main>
          <section className="footer-container">
            <FooterComponent />
          </section>
        </section>
      </BrowserRouter>
      </SessionProvider>
    </>
  );
}

export default App;
