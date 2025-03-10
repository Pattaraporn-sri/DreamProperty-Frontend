import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Map from "./component/Map";
import HomePage from "./component/HomePage";
import MainLayout from "./layouts/MainLayout";
import "./App.css";
import BuyPage from "./component/BuyPage";
import HousePage from "./component/HousePage";
import CondoPage from "./component/CondoPage";
import TownhousePage from "./component/TownhousePage";
import LandPage from "./component/LandPage";
import PropertyList from "./component/BuyPage";
import PropertyDetail from "./component/PropertyDetail";
import MapPage from "./component/MapPage";
import FavoritePage from "./component/FavoritePage";
import { FavoriteProvider } from "./component/FavoriteContext";
import AgentList from "./component/AgentList";
import Compare from "./component/Compare";

const App = () => {
  return (
    <FavoriteProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="map" element={<MapPage />} />
            <Route path="buy" element={<BuyPage />} />
            <Route path="house" element={<HousePage />} />
            <Route path="condo" element={<CondoPage />} />
            <Route path="townhouse" element={<TownhousePage />} />
            <Route path="land" element={<LandPage />} />
            <Route path="/" element={<PropertyList />} />
            <Route
              path="/properties/:propertyId"
              element={<PropertyDetail />}
            />
            <Route path="favorite" element={<FavoritePage />} />
            <Route index element={<HomePage />} />
            <Route element={<AgentList />} />
            <Route path="/favorite/compare" element={<Compare />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FavoriteProvider>
  );
};

export default App;
// latlng={""}
