import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';

import Start from './Start';
import Game from './Game';
import Outcome from './Outcome';
import StudyHub from './StudyHub';
import StudyHistory from './StudyHistory';
import IncomeExpenses from './IncomeExpenses';
import DevelopmentDetails from './DevelopmentDetails';
import Journal from './Journal';
import About from './About';
import Challenges from './Challenges';
import Bond from './Bond';
import Bookshelf from './Bookshelf';
import Collections from './Collections';
import Dashboard from './Dashboard';
import Endgame from './Endgame';
import Growth from './Growth';
import HowToPlay from './HowToPlay';
import Inventory from './Inventory';
import Life from './Life';
import Mind from './Mind';
import ParentTools from './ParentTools';
import Passport from './Passport';
import Strategies from './Strategies';
import Study from './Study';
import Toolbox from './Toolbox';
import ToolsSection from './ToolsSection';
import TrophyCase from './TrophyCase';
import Tutoring from './Tutoring';
import Death from './Death';
import Wellbeing from './Wellbeing';
import Popups from './Popups';
import Crypto from './Crypto';

export default function Pages() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Start />} />

          <Route path="/start" element={<Start />} />
          <Route path="/game" element={<Game />} />
          <Route path="/outcome" element={<Outcome />} />
          <Route path="/studyhub" element={<StudyHub />} />
          <Route path="/studyhistory" element={<StudyHistory />} />
          <Route path="/incomeexpenses" element={<IncomeExpenses />} />
          <Route path="/income-expenses" element={<Navigate to="/incomeexpenses" replace />} />
          <Route path="/income-&-expenses" element={<Navigate to="/incomeexpenses" replace />} />
          <Route path="/income-and-expenses" element={<Navigate to="/incomeexpenses" replace />} />
          <Route path="/developmentdetails" element={<DevelopmentDetails />} />
          <Route path="/journal" element={<Journal />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/bond" element={<Bond />} />

          <Route path="/wellbeing" element={<Wellbeing />} />

          <Route path="/mind" element={<Mind />} />

          <Route path="/growth" element={<Growth />} />

          <Route path="/study" element={<Study />} />
          <Route path="/study-section" element={<Study />} />

          <Route path="/life" element={<Life />} />

          <Route path="/endgame" element={<Endgame />} />

          <Route path="/tools" element={<ToolsSection />} />
          <Route path="/toolssection" element={<ToolsSection />} />

          <Route path="/parenttools" element={<ParentTools />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/strategies" element={<Strategies />} />

          <Route path="/passport" element={<Passport />} />
          <Route path="/toolbox" element={<Toolbox />} />
          <Route path="/bookshelf" element={<Bookshelf />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/trophycase" element={<TrophyCase />} />

          <Route path="/challenges" element={<Challenges />} />
          <Route path="/Challenges" element={<Challenges />} />

           <Route path="/about" element={<About />} />
          <Route path="/howtoplay" element={<HowToPlay />} />

          <Route path="/death" element={<Death />} />
          <Route path="/popups" element={<Popups />} />
          <Route path="/crypto" element={<Crypto />} />

          {/* Backward compatibility */}
          <Route path="/Start" element={<Start />} />
          <Route path="/Game" element={<Game />} />
          <Route path="/Outcome" element={<Outcome />} />
          <Route path="/StudyHub" element={<StudyHub />} />
          <Route path="/StudyHistory" element={<StudyHistory />} />
          <Route path="/DevelopmentDetails" element={<DevelopmentDetails />} />
          <Route path="/Journal" element={<Journal />} />
          <Route path="/Death" element={<Death />} />

          {/* Case-insensitive aliases */}
          <Route path="/Popups" element={<Popups />} />
          <Route path="/Challenges" element={<Challenges />} />
          <Route path="/Crypto" element={<Crypto />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}