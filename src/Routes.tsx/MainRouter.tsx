import { createBrowserRouter } from "react-router-dom";
import HomePage from "../component/HomePage";
import MainLayout from "../layouts/MainLayout";
import NotFound from "../component/NotFound";
import BuyPage from "../component/BuyPage";
import HousePage from "../component/HousePage";
import CondoPage from "../component/CondoPage";
import TownhousePage from "../component/TownhousePage";
import LandPage from "../component/LandPage";
import PropertyDetail from "../component/PropertyDetail";
import MapPage from "../component/MapPage";
import FavoritePage from "../component/FavoritePage";
import Compare from "../component/Compare";

const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "buy",
        element: <BuyPage />,
      },
      {
        path: "house",
        element: <HousePage />,
      },
      {
        path: "condo",
        element: <CondoPage />,
      },
      {
        path: "townhouse",
        element: <TownhousePage />,
      },
      {
        path: "land",
        element: <LandPage />,
      },
      {
        path: "properties/:propertyId",
        element: <PropertyDetail />,
      },
      {
        path: "favorite",
        element: <FavoritePage />,
      },
      {
        path: "compare",
        element: <Compare />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default mainRoute;
