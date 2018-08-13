// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";
import BusinessCenter from "@material-ui/icons/BusinessCenter";


// core components/view
import Marketplace from "../views/Marketplace/Marketplace.jsx";
import Workspace from "../views/Workspace/Workspace.jsx";
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
    path: "/workspace",
    sidebarName: "Workspace",
    navbarName: "Workspace",
    icon: BusinessCenter,
    component: Workspace
  },
  {
    path: "/user",
    sidebarName: "Profile",
    navbarName: "Profile",
    icon: Person,
    component: UserProfile
  },

  // These are invisible sidebar items for routing purposes
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
