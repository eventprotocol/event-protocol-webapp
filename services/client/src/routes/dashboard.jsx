// @material-ui/icons

import Person from "@material-ui/icons/Person";

import Dashboard from "@material-ui/icons/Dashboard";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";

// core components/view
import Marketplace from "../views/Marketplace/Marketplace.jsx";
import UserProfile from "../views/UserProfile/UserProfile.jsx";


const dashboardRoutes = [
  {
    path: "/marketplace",
    sidebarName: "Marketplace",
    navbarName: "Marketplace",
    icon: Dashboard,
    component: Marketplace
  },
  {
    path: "/user",
    sidebarName: "Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },

  { redirect: true, path: "/", to: "/marketplace", navbarName: "Redirect" }

];

export default dashboardRoutes;
