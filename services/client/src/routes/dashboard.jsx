// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Dashboard from "@material-ui/icons/Dashboard";
import Book from "@material-ui/icons/Book";
import Calendar from "@material-ui/icons/CalendarViewDay";

// core components/view
import Marketplace from "../views/Marketplace/Marketplace.jsx";
// import Workspace from "../views/Workspace/Workspace.jsx";
import UserProfile from "../views/UserProfile/UserProfile.jsx";
import PublicProfile from "../views/PublicProfile/PublicProfile.jsx";
import Wallet from "../views/Wallet/Wallet.jsx";
// import Team from "../views/Team/Team.jsx";
import Contracts from "../views/MyContracts/MyContracts.jsx";
import ChatRoom from "../views/ChatRoom/ChatRoom.jsx";

const dashboardRoutes = [
  {
    path: "/marketplace",
    sidebarName: "Marketplace",
    navbarName: "Marketplace",
    icon: Dashboard,
    loginRequired: false,
    component: Marketplace
  },
  {
    path: "/user",
    sidebarName: "Profile",
    navbarName: "Profile",
    icon: Person,
    loginRequired: true,
    component: UserProfile
  },
  // {
  //   path: "/workspace",
  //   sidebarName: "Workspace",
  //   navbarName: "Workspace",
  //   icon: BusinessCenter,
  //   loginRequired: true,
  //   component: Workspace
  // },
  {
    path: "/contracts",
    sidebarName: "Contracts",
    navbarName: "Contracts",
    icon: Calendar,
    loginRequired: true,
    component: Contracts
  },
  {
    path: "/wallet",
    sidebarName: "Wallet",
    navbarName: "Wallet",
    icon: Book,
    loginRequired: true,
    component: Wallet
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
  {
    path: "/chatroom/:id",
    sidebarName: "Chatroom",
    navbarName: "Chatroom",
    icon: Person,
    invisible: true,
    component: ChatRoom
  },
  { redirect: true, path: "/", to: "/marketplace", navbarName: "Redirect" }
];

export default dashboardRoutes;
