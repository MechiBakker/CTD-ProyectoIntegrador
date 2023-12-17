import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCategory from '../../categories/category-form/categorieForm';
import { CategoriesComponent } from '../../categories/categories';

export const ManageCategories = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const openForm = () => {
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={openForm}>Agregar una nueva categoría</button>
      {showForm && (
        <div>
          <button onClick={closeForm}>Cerrar</button>
          <AddCategory />
        </div>
      )}
      <CategoriesComponent />
    </div>
  );
};

export default ManageCategories;
