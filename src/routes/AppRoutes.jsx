import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout'; 
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';


import POList from '../pages/POList';
import POCreate from '../pages/POCreate';


import PRList from '../pages/PRList';       
import PRCreate from '../pages/PRCreate';   
import PRDetail from '../pages/PRDetail';   
import PREdit from '../pages/PREdit';      

import GoodsReceiptCreate from '../pages/GoodsReceiptCreate';

import StockInquiry from '../pages/StockInquiry'; 
import StockCard from '../pages/StockCard';       

import GRList from '../pages/GRList';
import GICreate from '../pages/GICreate'; 
import GIList from '../pages/GIList';

import GTList from '../pages/GTList';      
import GTCreate from '../pages/GTCreate';

import ItemList from '../pages/ItemList';     
import ItemCreate from '../pages/ItemCreate'; 
import ItemEdit from '../pages/ItemEdit';    


import PODetail from '../pages/PODetail'; 
import GRDetail from '../pages/GRDetail'; 
import GIDetail from '../pages/GIDetail';
import GTDetail from '../pages/GTDetail'; 


const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}> 
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
    
          <Route path="/purchasing/requests" element={<PRList />} />
          <Route path="/purchasing/requests/create" element={<PRCreate />} />
          <Route path="/purchasing/requests/:id" element={<PRDetail />} />
          <Route path="/purchasing/requests/:id/edit" element={<PREdit />} />
          
          <Route path="/purchasing/orders" element={<POList />} />
          <Route path="/purchasing/orders/create" element={<POCreate />} /> 
          <Route path="/purchasing/orders/:id" element={<PODetail />} /> 

          <Route path="/inventory/goods-receipt" element={<GRList />} />
          <Route 
            path="/inventory/goods-receipt/create" 
            element={<GoodsReceiptCreate />} 
          />
          <Route path="/inventory/goods-receipt/:id" element={<GRDetail />} /> 


          <Route path="/inventory/goods-transfer" element={<GTList />} />
          <Route path="/inventory/goods-transfer/create" element={<GTCreate />} />
          <Route path="/inventory/goods-transfer/:id" element={<GTDetail />} /> 

          <Route path="/inventory/stock" element={<StockInquiry />} />
          <Route path="/inventory/stock-card/:itemId/:warehouseId" element={<StockCard />} />

          <Route path="/inventory/goods-issue" element={<GIList />} />
          <Route path="/inventory/goods-issue/create" element={<GICreate />} />
          <Route path="/inventory/goods-issue/:id" element={<GIDetail />} /> 

          <Route path="/master/items" element={<ItemList />} />
          <Route path="/master/items/create" element={<ItemCreate />} />
          <Route path="/master/items/:id/edit" element={<ItemEdit />} />
        </Route>
      </Route>
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;