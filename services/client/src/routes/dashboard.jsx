// @material-ui/icons

import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";

// core components/view
import Marketplace from "../views/Marketplace/Marketplace.jsx";
import UserProfile from "../views/UserProfile/UserProfile.jsx";
import PublicProfile from "../views/PublicProfile/PublicProfile.jsx";



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
  {
    path: "/account/:id",
    sidebarName: "Public Profile",
    navbarName: "Public Profile",
    icon: Person, 
    invisible: true,
    component: PublicProfile
  },
  { redirect: true, path: "/", to: "/marketplace", navbarName: "Redirect" }
];

export default dashboardRoutes;
