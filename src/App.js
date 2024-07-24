import "./App.css";
import UserRegistration from "./Components/UserRegistration";
import Home from "./Components/Home";
import UserLogin from "./Components/UserLogin";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import GovtView from "./Components/GovtView";
import VehicleRegistration from "./Components/VehicleRegistration";
import Transfer from "./Components/Transfer";

const isUserLoggedIn = () => {
  return !!window.localStorage.getItem("username");
};

const routerDefinition = createRoutesFromElements(
  <Route>
    <Route path="/" element={isUserLoggedIn() ? <Home /> : <UserLogin />} />
    <Route path="/new" element={<VehicleRegistration />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/register" element={<UserRegistration />} />
    <Route path="/govt" element={<GovtView />} />
    <Route path="/transfer" element={<Transfer />} />
    
  </Route>
);

const router = createBrowserRouter(routerDefinition);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
