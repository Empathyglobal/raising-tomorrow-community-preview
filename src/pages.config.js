/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import App from './pages/App';
import Bond from './pages/Bond';
import Bookshelf from './pages/Bookshelf';
import Challenges from './pages/Challenges';
import Collections from './pages/Collections';
import Crypto from './pages/Crypto';
import Dashboard from './pages/Dashboard';
import Death from './pages/Death';
import DevelopmentDetails from './pages/DevelopmentDetails';
import Endgame from './pages/Endgame';
import Game from './pages/Game';
import Growth from './pages/Growth';
import HowToPlay from './pages/HowToPlay';
import IncomeExpenses from './pages/IncomeExpenses';
import Inventory from './pages/Inventory';
import Journal from './pages/Journal';
import Layout from './pages/Layout';
import Life from './pages/Life';
import MetaBadgesTest from './pages/MetaBadgesTest';
import Mind from './pages/Mind';
import OnlineMultiplayer from './pages/OnlineMultiplayer';
import Outcome from './pages/Outcome';
import ParentTools from './pages/ParentTools';
import Passport from './pages/Passport';
import Popups from './pages/Popups';
import RareMomentsAlbum from './pages/RareMomentsAlbum';
import Start from './pages/Start';
import Strategies from './pages/Strategies';
import Study from './pages/Study';
import StudyHistory from './pages/StudyHistory';
import StudyHub from './pages/StudyHub';
import Toolbox from './pages/Toolbox';
import ToolsSection from './pages/ToolsSection';
import TrophyCase from './pages/TrophyCase';
import Tutoring from './pages/Tutoring';
import Wellbeing from './pages/Wellbeing';
import YoungAdultStart from './pages/YoungAdultStart';
import index from './pages/index';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "App": App,
    "Bond": Bond,
    "Bookshelf": Bookshelf,
    "Challenges": Challenges,
    "Collections": Collections,
    "Crypto": Crypto,
    "Dashboard": Dashboard,
    "Death": Death,
    "DevelopmentDetails": DevelopmentDetails,
    "Endgame": Endgame,
    "Game": Game,
    "Growth": Growth,
    "HowToPlay": HowToPlay,
    "IncomeExpenses": IncomeExpenses,
    "Inventory": Inventory,
    "Journal": Journal,
    "Layout": Layout,
    "Life": Life,
    "MetaBadgesTest": MetaBadgesTest,
    "Mind": Mind,
    "OnlineMultiplayer": OnlineMultiplayer,
    "Outcome": Outcome,
    "ParentTools": ParentTools,
    "Passport": Passport,
    "Popups": Popups,
    "RareMomentsAlbum": RareMomentsAlbum,
    "Start": Start,
    "Strategies": Strategies,
    "Study": Study,
    "StudyHistory": StudyHistory,
    "StudyHub": StudyHub,
    "Toolbox": Toolbox,
    "ToolsSection": ToolsSection,
    "TrophyCase": TrophyCase,
    "Tutoring": Tutoring,
    "Wellbeing": Wellbeing,
    "YoungAdultStart": YoungAdultStart,
    "index": index,
}

export const pagesConfig = {
    mainPage: "Start",
    Pages: PAGES,
    Layout: __Layout,
};