import logo from './logo.svg';
import './App.css';
import Header from './common/Header'
import { BrowserRouter , Routes, Route ,useRoutes} from "react-router-dom";
import Registration from './registration/Registration';
import Pronouncation from './pronouncation/Pronouncation';
import Login from './registration/Login';
import DashBoard from './dashboard/Dashboard';
import Settings from './settings/Settings';

function App() {

const UserDefinedRoutes =()=>{
  return useRoutes([{ path: "/", element: <Login /> },
  { path: "/register", element: <Registration /> },
  { path: "/pronouncation", element: <Pronouncation /> },
  { path: "/dashboard", element: <DashBoard /> },
]);
}


  return (
       <BrowserRouter>
        <Routes >
          <Route path="/" element={<Login/>}>
          </Route>
          <Route path="/register" element={<Registration/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/pronouncation/:country/:name" element={<Pronouncation/>}/>
        </Routes>
        </BrowserRouter>
  );
}

export default App;
