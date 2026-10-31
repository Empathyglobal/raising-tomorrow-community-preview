import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { X } from 'lucide-react';
import HomeschoolSupportModal from './HomeschoolSupportModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState, combineDeltas, ACTION_REGISTRY, PARENT_CIVIC_ROLE_DEFS, formatMoney } from '@/components/game/GameStateContext';
import { normalizeSocialMediaState, computeProjectedYearlyIncome, formatFollowersShort } from '@/components/game/socialMediaSystem';
import { pickMissingActionPopup, interpolatePopupText } from './missingActionPopups';
import SupportNetworkModal from './SupportNetworkModal';
import DoctorModal from './DoctorModal';
import PetsModal from './PetsModal';
import DonationModal from './DonationModal';
import MindBodyModal from './MindBodyModal';
import ShopModal from './ShopModal';
import OutingsModal from './OutingsModal';
import OutdoorAdventuresModal from './OutdoorAdventuresModal';
import FaithModal from './FaithModal';
import PlaydatesModal from './PlaydatesModal';
import SchoolModal from './SchoolModal';
import RetirementModal from './RetirementModal';
import HomeStuffModal from './HomeStuffModal';
import SmallBusinessModal from './SmallBusinessModal';
import RealEstateModal from './RealEstateModal';
import ParentStrategiesModal from './ParentStrategiesModal';
import TutorModal from './TutorModal';
import RelationshipsModal from './RelationshipsModal';
import StudentLeadershipModal from './StudentLeadershipModal';
import ParentLeadershipModal from './ParentLeadershipModal';
import PTAIlluminatiModal from './PTAIlluminatiModal';
import SideGigsModal from './SideGigsModal';
import LazySocialMediaModal from '@/components/game/LazySocialMediaModal';
import CareerModal from './CareerModal';
import EducationModal from './EducationModal';
import ImmigrationModal from './ImmigrationModal';
import PoliticsModal from './PoliticsModal';
import RoutinePickerModal from './RoutinePickerModal';
import HobbiesModal from './HobbiesModal';

export default function LifeHubModal({ open, onClose, onOpenTimeline, targetModal, onNavigateToTab }) {
  const navigate = useNavigate();
  const { gameState, addLog, applyDeltas, applyLove, applyStress, useAction, updateState, applyTechniqueBonusesForAction, recordTimelineEntry, emitActionResult, getAvailability, getLocalAmount } = useGameState();
  const { money, actionPoints, maxFocusTokens, scenarioPending, scenarioCompletedThisAge, finished, baliActive, baliStartAge, baliYearsPaid, currentYear, childSickThisAge, pendingModalToOpen } = gameState;

  // Social media summary for tile
  const sm = normalizeSocialMediaState(gameState.socialMedia);
  const activeAccounts = Object.values(sm.accounts || {}).filter(a => a.active);
  const totalFollowers = activeAccounts.reduce((sum, a) => sum + (a.followers || 0), 0);
  const projectedIncome = computeProjectedYearlyIncome(gameState, sm);

  // Auto-navigate to target modal when specified
  React.useEffect(() => {
    if (open && targetModal) {
      navigateFromLifeHub(targetModal);
    }
  }, [open, targetModal]);
  const [supportModalOpen, setSupportModalOpen] = React.useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = React.useState(false);
  const [donationModalOpen, setDonationModalOpen] = React.useState(false);
  const [mindBodyModalOpen, setMindBodyModalOpen] = React.useState(false);
  const [shopModalOpen, setShopModalOpen] = React.useState(false);
  const [petHubModalOpen, setPetHubModalOpen] = React.useState(false);
  const [outingsModalOpen, setOutingsModalOpen] = React.useState(false);
  const [outdoorAdventuresModalOpen, setOutdoorAdventuresModalOpen] = React.useState(false);
  const [faithModalOpen, setFaithModalOpen] = React.useState(false);
  const [playdatesModalOpen, setPlaydatesModalOpen] = React.useState(false);
  const [schoolModalOpen, setSchoolModalOpen] = React.useState(false);
  const [homeStuffModalOpen, setHomeStuffModalOpen] = React.useState(false);
  const [retirementModalOpen, setRetirementModalOpen] = React.useState(false);
  const [smallBusinessModalOpen, setSmallBusinessModalOpen] = React.useState(false);
  const [realEstateModalOpen, setRealEstateModalOpen] = React.useState(false);
  const [parentStrategiesModalOpen, setParentStrategiesModalOpen] = React.useState(false);
  const [tutorModalOpen, setTutorModalOpen] = React.useState(false);
  const [relationshipsModalOpen, setRelationshipsModalOpen] = React.useState(false);
  const [studentLeadershipModalOpen, setStudentLeadershipModalOpen] = React.useState(false);
  const [parentLeadershipModalOpen, setParentLeadershipModalOpen] = React.useState(false);
  const [ptaIlluminatiModalOpen, setPtaIlluminatiModalOpen] = React.useState(false);
  const [sideGigsModalOpen, setSideGigsModalOpen] = React.useState(false);
  const [homeschoolSupportModalOpen, setHomeschoolSupportModalOpen] = React.useState(false);
  const [socialMediaModalOpen, setSocialMediaModalOpen] = React.useState(false);
  const [careerModalOpen, setCareerModalOpen] = React.useState(false);
  const [careerOpenBrowse, setCareerOpenBrowse] = React.useState(false);
  const [educationModalOpen, setEducationModalOpen] = React.useState(false);
  const [immigrationModalOpen, setImmigrationModalOpen] = React.useState(false);
  const [politicsModalOpen, setPoliticsModalOpen] = React.useState(false);
  const [routinePickerOpen, setRoutinePickerOpen] = React.useState(false);
  const [hobbiesModalOpen, setHobbiesModalOpen] = React.useState(false);

  // Cleanup pending modal state when sub-modals close
  React.useEffect(() => {
    const anySubModalOpen = supportModalOpen || doctorModalOpen || donationModalOpen || 
      mindBodyModalOpen || shopModalOpen || petHubModalOpen || outingsModalOpen || 
      outdoorAdventuresModalOpen || faithModalOpen || playdatesModalOpen || schoolModalOpen || homeStuffModalOpen || 
      retirementModalOpen || smallBusinessModalOpen || realEstateModalOpen || sideGigsModalOpen || parentStrategiesModalOpen || tutorModalOpen || relationshipsModalOpen || studentLeadershipModalOpen || parentLeadershipModalOpen || ptaIlluminatiModalOpen || homeschoolSupportModalOpen || socialMediaModalOpen || careerModalOpen || educationModalOpen || immigrationModalOpen || politicsModalOpen || routinePickerOpen || hobbiesModalOpen;
    
    if (!anySubModalOpen && pendingModalToOpen) {
      updateState({ pendingModalToOpen: null });
    }
  }, [supportModalOpen, doctorModalOpen, donationModalOpen, mindBodyModalOpen, shopModalOpen, 
      petHubModalOpen, outingsModalOpen, outdoorAdventuresModalOpen, faithModalOpen, playdatesModalOpen, schoolModalOpen, 
      homeStuffModalOpen, retirementModalOpen, smallBusinessModalOpen, realEstateModalOpen, sideGigsModalOpen, parentStrategiesModalOpen, 
      tutorModalOpen, relationshipsModalOpen, studentLeadershipModalOpen, parentLeadershipModalOpen, ptaIlluminatiModalOpen, homeschoolSupportModalOpen, socialMediaModalOpen, careerModalOpen, educationModalOpen, immigrationModalOpen, politicsModalOpen, routinePickerOpen, hobbiesModalOpen, pendingModalToOpen]);

  const navigateFromLifeHub = (targetModalName) => {
    // Open modal immediately, close Life Hub after
    switch (targetModalName) {
      case 'support':
        setSupportModalOpen(true);
        onClose();
        break;
      case 'doctor':
        setDoctorModalOpen(true);
        onClose();
        break;
      case 'donation':
        setDonationModalOpen(true);
        onClose();
        break;
      case 'mindBody':
        setMindBodyModalOpen(true);
        onClose();
        break;
      case 'hobbies':
        setHobbiesModalOpen(true);
        onClose();
        break;
      case 'shop':
        setShopModalOpen(true);
        onClose();
        break;
      case 'pets':
        setPetHubModalOpen(true);
        onClose();
        break;
      case 'outings':
        setOutingsModalOpen(true);
        onClose();
        break;
      case 'outdoorAdventures':
        setOutdoorAdventuresModalOpen(true);
        onClose();
        break;
      case 'faith':
        setFaithModalOpen(true);
        onClose();
        break;
      case 'playdates':
        setPlaydatesModalOpen(true);
        onClose();
        break;
      case 'school':
        setSchoolModalOpen(true);
        onClose();
        break;
      case 'homeStuff':
        setHomeStuffModalOpen(true);
        onClose();
        break;
      case 'retirement':
        setRetirementModalOpen(true);
        onClose();
        break;
      case 'sideGigs':
        setSideGigsModalOpen(true);
        onClose();
        break;
      case 'smallBusiness':
        setSmallBusinessModalOpen(true);
        onClose();
        break;
      case 'realEstate':
        setRealEstateModalOpen(true);
        onClose();
        break;
      case 'parentStrategies':
        setParentStrategiesModalOpen(true);
        onClose();
        break;
      case 'tutor':
        setTutorModalOpen(true);
        onClose();
        break;
      case 'relationships':
        setRelationshipsModalOpen(true);
        onClose();
        break;
      case 'studentLeadership':
        setStudentLeadershipModalOpen(true);
        onClose();
        break;
      case 'parentLeadership':
        setParentLeadershipModalOpen(true);
        onClose();
        break;
      case 'ptaIlluminati':
        setPtaIlluminatiModalOpen(true);
        onClose();
        break;
      case 'parentTools':
        navigate(createPageUrl('ParentTools'));
        onClose();
        break;
      case 'homeschoolSupport':
        setHomeschoolSupportModalOpen(true);
        onClose();
        break;
      case 'socialMedia':
        setSocialMediaModalOpen(true);
        onClose();
        break;
      case 'career':
        setCareerOpenBrowse(false);
        setCareerModalOpen(true);
        onClose();
        break;
      case 'lookForJob':
        setCareerOpenBrowse(true);
        setCareerModalOpen(true);
        onClose();
        break;
      case 'education':
        setEducationModalOpen(true);
        onClose();
        break;
      case 'immigration':
        setImmigrationModalOpen(true);
        onClose();
        break;
      case 'politics':
        setPoliticsModalOpen(true);
        onClose();
        break;
      case 'routine':
        setRoutinePickerOpen(true);
        onClose();
        break;
      case 'timeline':
        onOpenTimeline();
        onClose();
        break;
      case 'details':
        navigate(createPageUrl('DevelopmentDetails'));
        onClose();
        break;
      case 'passport':
        navigate(createPageUrl('Passport'));
        onClose();
        break;
      case 'toolbox':
        navigate(createPageUrl('Toolbox'));
        onClose();
        break;
      case 'bookshelf':
        navigate(createPageUrl('Bookshelf'));
        onClose();
        break;
      case 'inventory':
        navigate(createPageUrl('Inventory'));
        onClose();
        break;
      case 'collections':
        navigate(createPageUrl('Collections'));
        onClose();
        break;
      case 'trophyCase':
        navigate(createPageUrl('TrophyCase'));
        onClose();
        break;
      case 'tutoringParent':
        updateState({ tutoringDefaultTab: 'parent' });
        navigate(createPageUrl('Tutoring'));
        onClose();
        break;
      case 'strategies':
        navigate(createPageUrl('Strategies'));
        onClose();
        break;
      default:
        onClose();
        break;
    }
  };

  // Block body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);



  const handleMoveToBali = () => {
    updateState({ 
      baliActive: true, 
      baliStartAge: currentYear 
    });
    addLog("🏝️ You move to Bali for Empathy School. The perks start next age. ($500/age)");

    recordTimelineEntry({
      kind: "tool",
      title: "Moved to Bali",
      detail: "Enrolled in Empathy School. Yearly cost: $500. Bonuses begin next age.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: 0,
      stressDelta: 0
    });

    onClose();
  };

  const handleLeaveBali = () => {
    updateState({ baliActive: false });
    addLog("🌧️ You leave Bali. They're furious you took paradise away.");
    applyLove(-2, "Left Bali");

    recordTimelineEntry({
      kind: "tool",
      title: "Left Bali",
      detail: "You leave Bali. They wanted to stay.",
      deltas: null,
      moneyDelta: 0,
      loveDelta: -2,
      stressDelta: 0
    });

    onClose();
  };

  // Get action availability for each action
  const routineAvail = getAvailability("routine");
  const tutorAvail = getAvailability("tutor");
  const parentTutoringAvail = getAvailability("parentTutoring");
  const parentStrategiesAvail = getAvailability("parentStrategies");
  const childStrategiesAvail = getAvailability("childStrategies");
  const supportAvail = getAvailability("support");
  const doctorAvail = getAvailability("doctor");
  const donationAvail = getAvailability("donation");
  const mindBodyAvail = getAvailability("mindBody");
  const hobbiesAvail = getAvailability("hobbies");
  const petsAvail = getAvailability("pets");
  const outingsAvail = getAvailability("outings");
  const outdoorAdventuresAvail = getAvailability("outdoorAdventures");
  const faithAvail = getAvailability("faith");
  const playdatesAvail = getAvailability("playdates");
  const schoolAvail = getAvailability("school");
  const parentLeadershipAvail = getAvailability("parentLeadership");

  const activeParentRoleId = gameState.parentCivic?.activeRoleId;
  const activeParentRole = activeParentRoleId ? PARENT_CIVIC_ROLE_DEFS[activeParentRoleId] : null;
  const activeParentRoleYears = activeParentRoleId ? (gameState.parentCivic?.experienceByRoleId?.[activeParentRoleId] || 0) : 0;

  const doThingsActions = [
    {
      icon: '🕒',
      title: 'Set a Routine',
      subtitle: 'Structure for the year.',
      avail: routineAvail,
      onClick: () => {
        setRoutinePickerOpen(true);
        onClose();
      }
    },
    {
      icon: '📚',
      title: 'Annual Tutor',
      subtitle: gameState.tutorActive && gameState.tutorType !== 'none' 
        ? `Active: ${['int','emp','dis','con'].includes(gameState.tutorType) ? gameState.tutorType.toUpperCase() : 'Tutor'} • $${formatMoney(getLocalAmount(1800))}/year`
        : `$${formatMoney(getLocalAmount(1800))}/year • +1 stat per year`,
      avail: tutorAvail,
      onClick: () => navigateFromLifeHub('tutor')
    },
    {
      icon: '👨‍🏫',
      title: 'Parent Tutoring',
      subtitle: 'Spend time instead of money.',
      avail: parentTutoringAvail,
      onClick: () => navigateFromLifeHub('tutoringParent')
    },
    {
      icon: '🧘',
      title: 'Parent Strategies',
      subtitle: 'Reset, Mini Break, Reflect, Protect Sleep.',
      avail: parentStrategiesAvail,
      onClick: () => navigateFromLifeHub('parentStrategies')
    },
    {
      icon: '🌿',
      title: 'Child Strategies',
      subtitle: 'Intentional moves that cost Focus.',
      avail: childStrategiesAvail,
      onClick: () => navigateFromLifeHub('strategies')
    },
    {
      icon: '🤝',
      title: 'Support Network',
      subtitle: 'Get help when you can.',
      avail: supportAvail,
      onClick: () => navigateFromLifeHub('support')
    },
    {
      icon: '🩺',
      title: 'Health (Doctor)',
      subtitle: (gameState.childSickThisAge || gameState.playerSickThisAge || gameState.partnerSickThisAge) ? '🤒 Sick week active' : 'Check-ups and care.',
      avail: doctorAvail,
      onClick: () => navigateFromLifeHub('doctor')
    },
    {
      icon: '🩸',
      title: 'Donate Blood/Plasma',
      subtitle: 'Role model generosity.',
      avail: donationAvail,
      onClick: () => {
        setDonationModalOpen(true);
        onClose();
      }
    },
    {
      icon: '🧠',
      title: 'Mind & Body (Classes)',
      subtitle: 'Build skills through activities.',
      avail: mindBodyAvail,
      onClick: () => navigateFromLifeHub('mindBody')
    },
    {
      icon: '🎭',
      title: 'Hobbies & Clubs',
      subtitle: 'Pick an age‑appropriate hobby. Costs 1 Focus. Lowers your stress.',
      avail: hobbiesAvail,
      onClick: () => navigateFromLifeHub('hobbies')
    },
    {
      icon: '🐾',
      title: 'Pets',
      subtitle: (gameState.pets?.length || 0) > 0 ? `Pets (${gameState.pets.length})` : 'Adopt a pet',
      avail: petsAvail,
      onClick: () => {
        setPetHubModalOpen(true);
        onClose();
      }
    },
    {
      icon: '🎬',
      title: 'Outings (Movies)',
      subtitle: 'Go to the movie theater.',
      avail: outingsAvail,
      onClick: () => navigateFromLifeHub('outings')
    },
    {
      icon: '🏕️',
      title: 'Outdoor Adventures',
      subtitle: 'Take your child outside for a fun memory. Costs 1 Focus (some trips cost money).',
      avail: outdoorAdventuresAvail,
      onClick: () => navigateFromLifeHub('outdoorAdventures')
    },
    {
      icon: '🙏',
      title: 'Faith (Prayer)',
      subtitle: 'Choose tradition & attend service.',
      avail: faithAvail,
      onClick: () => {
        setFaithModalOpen(true);
        onClose();
      }
    },
    {
      icon: '🤝',
      title: 'Playdates',
      subtitle: 'Schedule playdates with friends.',
      avail: playdatesAvail,
      onClick: () => navigateFromLifeHub('playdates')
    },
    {
      icon: '💞',
      title: 'Relationships',
      subtitle: 'Connect with family & loved ones.',
      avail: { enabled: true, reasonCode: null, reasonText: null },
      onClick: () => {
        setRelationshipsModalOpen(true);
        onClose();
      }
    },
    {
      icon: '📣',
      title: 'Parent Leadership',
      subtitle: activeParentRole
        ? `Active: ${activeParentRole.label} • Years: ${activeParentRoleYears} • 1 Focus/age at age start`
        : 'PTA leadership + volunteering (1 Focus/age)',
      avail: parentLeadershipAvail,
      onClick: () => {
        setParentLeadershipModalOpen(true);
        onClose();
      }
    },
    {
      icon: '🎒',
      title: 'School',
      subtitle: 'Choose school type.',
      avail: schoolAvail,
      onClick: () => {
        setSchoolModalOpen(true);
        onClose();
      }
    }
  ];

  // Get availability for review actions
  const timelineAvail = getAvailability("timeline");
  const detailsAvail = getAvailability("details");
  const passportAvail = getAvailability("passport");
  const toolboxAvail = getAvailability("toolbox");
  const bookshelfAvail = getAvailability("bookshelf");
  const inventoryAvail = getAvailability("inventory");
  const collectionsAvail = getAvailability("collections");
  const trophyCaseAvail = getAvailability("trophyCase");

  const reviewActions = [
    {
      icon: '🕰️',
      title: 'Just What Happened',
      subtitle: 'Year-by-year timeline.',
      avail: timelineAvail,
      onClick: () => navigateFromLifeHub('timeline')
    },
    {
      icon: '📊',
      title: 'Development Details',
      subtitle: 'Full stats, tiers, PB.',
      avail: detailsAvail,
      onClick: () => navigateFromLifeHub('details')
    },
    {
      icon: '🛂',
      title: 'Passport',
      subtitle: `Travel stamps: ${gameState.passportStamps?.length || 0}`,
      avail: passportAvail,
      onClick: () => navigateFromLifeHub('passport')
    },
    {
      icon: '🧠',
      title: 'Toolbox',
      subtitle: `Tools unlocked.`,
      avail: toolboxAvail,
      onClick: () => navigateFromLifeHub('toolbox')
    },
    {
      icon: '📚',
      title: 'Bookshelf',
      subtitle: `Modules studied: ${gameState.studiedItems?.length || 0}`,
      avail: bookshelfAvail,
      onClick: () => navigateFromLifeHub('bookshelf')
    },
    {
      icon: '🎒',
      title: 'Inventory',
      subtitle: `Items owned: ${gameState.inventory?.items?.length || 0}`,
      avail: inventoryAvail,
      onClick: () => navigateFromLifeHub('inventory')
    },
    {
      icon: '🗂️',
      title: 'Collections',
      subtitle: `Books • Games`,
      avail: collectionsAvail,
      onClick: () => navigateFromLifeHub('collections')
    },
    {
      icon: '🏆',
      title: 'Trophy Case',
      subtitle: 'Your unlocked achievements.',
      avail: trophyCaseAvail,
      onClick: () => navigateFromLifeHub('trophyCase')
    }
  ];

  // Get availability for lifestyle actions
  const shoppingAvail = getAvailability("shopping");
  const homeStuffAvail = getAvailability("homeStuff");
  const phoneAvail = getAvailability("phone");
  const retirementAvail = getAvailability("retirement");
  const baliAvail = getAvailability("bali");
  const businessAvail = getAvailability("business");
  const realEstateAvail = getAvailability("realEstate");
  const sideGigsAvail = getAvailability("sideGigs");
  const moveAbroadAvail = getAvailability("moveAbroad");

  const hasUnseenCrypto = gameState.urnCrypto?.lastMarketRecap?.unseen === true;

  const lifestyleActions = [
    {
      icon: '⚱️',
      title: 'Urn',
      subtitle: 'Crypto bags (sell to cash out).',
      badge: hasUnseenCrypto ? 'NEW' : null,
      avail: { enabled: true },
      onClick: () => {
        navigate('/crypto');
        onClose();
      }
    },
    {
      icon: '🛍️',
      title: 'Shopping',
      subtitle: 'Buy items that unlock activities.',
      avail: shoppingAvail,
      onClick: () => navigateFromLifeHub('shop')
    },
    {
      icon: '🎒',
      title: 'Home & Stuff',
      subtitle: 'View your owned items.',
      avail: homeStuffAvail,
      onClick: () => navigateFromLifeHub('homeStuff')
    },
    {
      icon: '📵',
      title: 'Phone',
      subtitle: 'Give or take away the phone.',
      avail: phoneAvail,
      onClick: () => navigateFromLifeHub('parentTools')
    },
    {
      icon: '🧑‍💻',
      title: 'Side Gigs',
      subtitle: 'Trade Focus for quick cash. Stress always goes up.',
      avail: sideGigsAvail,
      onClick: () => navigateFromLifeHub('sideGigs'),
      hidden: gameState.disableSideGigs
    },
    {
      icon: '📱',
      title: 'Social Media',
      subtitle: activeAccounts.length > 0 ? `Total followers: ${formatFollowersShort(totalFollowers)} • ~$${formatMoney(projectedIncome)}/yr` : 'Build a following, get verified, monetize.',
      avail: { enabled: true, reasonCode: null, reasonText: null },
      onClick: () => navigateFromLifeHub('socialMedia')
    },
    {
      icon: '💼',
      title: 'Career',
      subtitle: 'Your job, promotions, and job search.',
      avail: { enabled: true, reasonCode: null, reasonText: null },
      onClick: () => navigateFromLifeHub('career'),
      hidden: gameState.disableCareer
    },
    {
      icon: '🎓',
      title: 'Higher Education',
      subtitle: 'Degrees, majors, and professional schools.',
      avail: { enabled: true, reasonCode: null, reasonText: null },
      onClick: () => navigateFromLifeHub('education')
    },
    {
      icon: '🏦',
      title: 'Savings',
      subtitle: 'Savings for University or my Retirement.',
      avail: retirementAvail,
      onClick: () => {
        onClose();
        setTimeout(() => setRetirementModalOpen(true), 10);
      }
    },
    {
      icon: '🏝️',
      title: baliActive ? 'Living in Bali (Empathy School)' : 'Move to Bali (Empathy School)',
      subtitle: baliActive 
        ? `Active. $500/age at age start. Years paid: ${baliYearsPaid}.`
        : 'Costs $500 each age while active. Each age: INT +1, EMP +1, CON +1.',
      buttonText: baliActive ? 'Leave Bali' : 'Move to Bali',
      avail: baliAvail,
      onClick: baliActive ? handleLeaveBali : handleMoveToBali
    },
    {
      icon: '💼',
      title: 'Small Business',
      subtitle: gameState.businessAttempted && gameState.businessStatus !== 'failed' && gameState.businessStatus !== 'none'
        ? `Manage your business (+$${formatMoney(getLocalAmount(gameState.businessIncomePerYear || 0))}/yr).`
        : 'Start a business ($20,000 startup).',
      avail: businessAvail,
      onClick: () => navigateFromLifeHub('smallBusiness')
    },
    {
      icon: '🏠',
      title: 'Real Estate',
      subtitle: 'Buy, rent, renovate, and sell properties.',
      avail: realEstateAvail,
      onClick: () => navigateFromLifeHub('realEstate')
    },
    {
      icon: '🧳',
      title: 'Move Abroad',
      subtitle: 'Move countries (sell houses first). Inventory doesn\'t come with you.',
      avail: moveAbroadAvail,
      onClick: () => navigateFromLifeHub('immigration')
    }
    ];

  return (
    <>
      <AnimatePresence>
        {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100]"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-sm rounded-t-2xl">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Life</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Money: ${money} • Focus: {actionPoints}/{maxFocusTokens}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 pb-8">
                {/* Do Things Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Do Things
                  </h4>
                  <div className="space-y-2">
                    {doThingsActions.map((action, idx) => (
                      <div key={idx}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          disabled={!action.avail.enabled}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            !action.avail.enabled
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                              <div className="text-xs text-slate-600">{action.subtitle}</div>
                            </div>
                          </div>
                        </button>
                        {!action.avail.enabled && (
                          <div className="text-[10px] text-slate-400 mt-1 ml-14">
                            {action.avail.reason || "Unavailable right now"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Review
                  </h4>
                  <div className="space-y-2">
                    {reviewActions.map((action, idx) => (
                      <div key={idx}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          disabled={!action.avail.enabled}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            !action.avail.enabled
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                              <div className="text-xs text-slate-600">{action.subtitle}</div>
                            </div>
                          </div>
                        </button>
                        {!action.avail.enabled && (
                          <div className="text-[10px] text-slate-400 mt-1 ml-14">
                            {action.avail.reason || "Unavailable right now"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lifestyle Section */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Lifestyle
                  </h4>
                  <div className="space-y-2">
                    {lifestyleActions.filter(a => a.title !== 'Move Abroad' && !a.hidden).map((action, idx) => (
                      <div key={idx}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          disabled={!action.avail.enabled}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            !action.avail.enabled
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                              <div className="text-xs text-slate-600 mb-2">{action.subtitle}</div>
                              {action.buttonText && (
                                <div className="text-xs font-medium text-purple-600">
                                  → {action.buttonText}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        {!action.avail.enabled && (
                          <div className="text-[10px] text-slate-400 mt-1 ml-14">
                            {action.avail.reason || "Unavailable right now"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Section */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Other
                  </h4>
                  <div className="space-y-2">
                    {lifestyleActions.filter(a => a.title === 'Move Abroad').map((action, idx) => (
                      <div key={idx}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                          }}
                          disabled={!action.avail.enabled}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            !action.avail.enabled
                              ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                              : 'border-slate-200 bg-white hover:border-purple-400 hover:bg-purple-50/50 active:scale-[0.98]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 mb-0.5">{action.title}</div>
                              <div className="text-xs text-slate-600 mb-2">{action.subtitle}</div>
                              {action.buttonText && (
                                <div className="text-xs font-medium text-purple-600">
                                  → {action.buttonText}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                        {!action.avail.enabled && (
                          <div className="text-[10px] text-slate-400 mt-1 ml-14">
                            {action.avail.reason || "Unavailable right now"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>

      {/* Sub-modals render outside the Life menu so they can stay open after Life closes */}
      <SupportNetworkModal
            open={supportModalOpen}
            onClose={() => {
              setSupportModalOpen(false);
              onClose();
            }}
          />

          <DoctorModal
            open={doctorModalOpen}
            onClose={() => {
              setDoctorModalOpen(false);
              onClose();
            }}
          />

          <DonationModal
            open={donationModalOpen}
            onClose={() => setDonationModalOpen(false)}
          />

          <MindBodyModal
            open={mindBodyModalOpen}
            onClose={() => {
              setMindBodyModalOpen(false);
              onClose();
            }}
          />

          <ShopModal
            open={shopModalOpen}
            onClose={() => {
              setShopModalOpen(false);
              onClose();
            }}
          />

          <OutingsModal
            open={outingsModalOpen}
            onClose={() => {
              setOutingsModalOpen(false);
              onClose();
            }}
          />

          <OutdoorAdventuresModal
            open={outdoorAdventuresModalOpen}
            onClose={() => {
              setOutdoorAdventuresModalOpen(false);
              onClose();
            }}
          />

          <FaithModal
            open={faithModalOpen}
            onClose={() => setFaithModalOpen(false)}
          />

          <PetsModal
            open={petHubModalOpen}
            onClose={() => {
              setPetHubModalOpen(false);
              onClose();
            }}
          />

          <PlaydatesModal
            open={playdatesModalOpen}
            onClose={() => {
              setPlaydatesModalOpen(false);
              onClose();
            }}
          />

          <SchoolModal
            open={schoolModalOpen}
            onClose={() => setSchoolModalOpen(false)}
          />

          <HomeStuffModal
            open={homeStuffModalOpen}
            onClose={() => {
              setHomeStuffModalOpen(false);
              onClose();
            }}
          />

          <RetirementModal
            open={retirementModalOpen}
            onClose={() => setRetirementModalOpen(false)}
          />

          <SmallBusinessModal
            open={smallBusinessModalOpen}
            onClose={() => {
              setSmallBusinessModalOpen(false);
              onClose();
            }}
          />

          <RealEstateModal
            open={realEstateModalOpen}
            onClose={() => {
              setRealEstateModalOpen(false);
              onClose();
            }}
          />

          <SideGigsModal
            open={sideGigsModalOpen}
            onClose={() => {
              setSideGigsModalOpen(false);
              onClose();
            }}
          />

          <ParentStrategiesModal
            open={parentStrategiesModalOpen}
            onClose={() => {
              setParentStrategiesModalOpen(false);
              onClose();
            }}
          />

          <TutorModal
            open={tutorModalOpen}
            onClose={() => {
              setTutorModalOpen(false);
              onClose();
            }}
          />

          <RelationshipsModal
            open={relationshipsModalOpen}
            onClose={() => setRelationshipsModalOpen(false)}
            onViewChildProfile={() => navigateFromLifeHub('details')}
          />
          
          <StudentLeadershipModal
            open={studentLeadershipModalOpen}
            onClose={() => setStudentLeadershipModalOpen(false)}
          />

          <ParentLeadershipModal
            open={parentLeadershipModalOpen}
            onClose={() => setParentLeadershipModalOpen(false)}
          />

          <PTAIlluminatiModal
            open={ptaIlluminatiModalOpen}
            onClose={() => setPtaIlluminatiModalOpen(false)}
          />

          <HomeschoolSupportModal
            open={homeschoolSupportModalOpen}
            onClose={() => setHomeschoolSupportModalOpen(false)}
          />

          <LazySocialMediaModal
            open={socialMediaModalOpen}
            onClose={() => setSocialMediaModalOpen(false)}
          />

          <CareerModal
            open={careerModalOpen}
            initialBrowsingJobs={careerOpenBrowse}
            onClose={() => { setCareerModalOpen(false); setCareerOpenBrowse(false); }}
          />

          <EducationModal
            open={educationModalOpen}
            onClose={() => setEducationModalOpen(false)}
          />

          <ImmigrationModal
            open={immigrationModalOpen}
            onClose={() => setImmigrationModalOpen(false)}
            onNavigateToLifeHub={navigateFromLifeHub}
          />

          <PoliticsModal
            open={politicsModalOpen}
            onClose={() => setPoliticsModalOpen(false)}
          />

          <RoutinePickerModal
            open={routinePickerOpen}
            onClose={() => {
              setRoutinePickerOpen(false);
              onClose();
            }}
          />
          
          <HobbiesModal
            open={hobbiesModalOpen}
            onClose={() => {
              setHobbiesModalOpen(false);
              onClose();
            }}
          />
          </>
          );
          }