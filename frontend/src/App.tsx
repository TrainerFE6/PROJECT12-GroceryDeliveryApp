import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)


// import { GlobalDebug } from "./remove-console.js";

import Loader from './common/Loader';
import PageTitle from './componentsBackoffice/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';

import Layout from './Components/Layout/Layout';

import Home from './pages/Landing/Home';
import Products from './pages/Landing/Products';
import ProductLanding from './pages/Landing/Product';
import DashboardLanding from './pages/Landing/Dashboard';
import DashboardTransactionDetailLanding from './pages/Landing/components/Transaction/Detail';
import CheckoutContext from './pages/Landing/Cart';

import Category from './pages/Master/Category';
import Product from './pages/Master/Product';
import ProductImage from './pages/Master/ProductImage';
import React from 'react';
import Customer from './pages/Master/Customer';
import Transaction from './pages/Transaction/List';
import TransactionDetail from './pages/Transaction/Detail';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  const GlobalDebug = (function () {
    var savedConsole = console;
    /**
    * @param {boolean} debugOn
    * @param {boolean} suppressAll
    */
    return function (debugOn, suppressAll) {
      var suppress = suppressAll || false;
      if (debugOn === false) {
        // supress the default console functionality
        console = {};
        console.log = function () {};
        // supress all type of consoles
        if (suppress) {
          console.info = function () {};
          console.warn = function () {};
          console.error = function () {};
        } else {
          console.info = savedConsole.info;
          console.warn = savedConsole.warn;
          console.error = savedConsole.error;
        }
      } else {
        console = savedConsole;
      }
    };
  })();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    GlobalDebug(false, false);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        {/* {START Gocery User} */}
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/product/:id' element={<ProductLanding />} />
          <Route path='/dashboard' element={<DashboardLanding />} />
          <Route path='/dashboard/detail/:id' element={<DashboardTransactionDetailLanding />} />
          <Route path='/cart' element={<CheckoutContext />} />
        </Route>
        {/* {END Gocery User} */}

        <Route
          // index
          path="/backoffice"
          element={
            <>
              <PageTitle title="eCommerce Grocery" />
              <ECommerce />
            </>
          }
        />
        <Route path='/backoffice'>
          <Route path='master'>
            <Route
              path='customer'
              element={
                <>
                  <PageTitle title="Pelanggan" />
                  <Customer />
                </>
              }
            />
            <Route
              path='category'
              element={
                <>
                  <PageTitle title="Kategori" />
                  <Category />
                </>
              }
            />
            <Route
              path='product'
              element={
                <>
                  <PageTitle title="Produk" />
                  <Product />
                </>
              }
            />
            <Route
              path='product-image/:id'
              element={
                <>
                  <PageTitle title="Gambar Produk" />
                  <ProductImage />
                </>
              }
            />
          </Route>
          <Route
            path='transaction'
            element={
              <>
                <PageTitle title="Transaksi" />
                <Transaction />
              </>
            }
          />
          <Route
            path='transaction/detail/:id'
            element={
              <>
                <PageTitle title="Transaksi Detail" />
                <TransactionDetail />
              </>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="eCommerce Grocery" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PageTitle title="eCommerce Grocery" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
