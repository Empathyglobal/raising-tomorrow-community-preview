// Higher Education System
// Programs, majors, and education ladder

export const MAJORS = [
  { id: 'computer_science', label: 'Computer Science', field: 'stem', emoji: '💻' },
  { id: 'engineering', label: 'Engineering', field: 'stem', emoji: '⚙️' },
  { id: 'aerospace_engineering', label: 'Aerospace Engineering', field: 'stem', emoji: '🚀' },
  { id: 'mathematics', label: 'Mathematics', field: 'stem', emoji: '📐' },
  { id: 'physics', label: 'Physics', field: 'science', emoji: '🔬' },
  { id: 'data_science', label: 'Data Science', field: 'stem', emoji: '📊' },
  
  { id: 'business', label: 'Business Administration', field: 'business', emoji: '💼' },
  { id: 'finance', label: 'Finance', field: 'business', emoji: '💰' },
  { id: 'marketing', label: 'Marketing', field: 'business', emoji: '📣' },
  { id: 'economics', label: 'Economics', field: 'business', emoji: '📈' },
  { id: 'accounting', label: 'Accounting', field: 'business', emoji: '🧮' },
  
  { id: 'biology', label: 'Biology', field: 'science', emoji: '🧬' },
  { id: 'chemistry', label: 'Chemistry', field: 'science', emoji: '⚗️' },
  { id: 'pre_med', label: 'Pre-Med', field: 'health', emoji: '🩺' },
  { id: 'nursing', label: 'Nursing', field: 'health', emoji: '👩‍⚕️' },
  { id: 'public_health', label: 'Public Health', field: 'health', emoji: '🏥' },
  
  { id: 'psychology', label: 'Psychology', field: 'social', emoji: '🧠' },
  { id: 'social_work', label: 'Social Work', field: 'social', emoji: '🤝' },
  { id: 'education', label: 'Education', field: 'education', emoji: '🍎' },
  { id: 'political_science', label: 'Political Science', field: 'law_policy', emoji: '🗳️' },
  { id: 'criminal_justice', label: 'Criminal Justice', field: 'law_policy', emoji: '👮' },
  
  { id: 'communications', label: 'Communications', field: 'arts', emoji: '📡' },
  { id: 'journalism', label: 'Journalism', field: 'arts', emoji: '📰' },
  { id: 'fine_arts', label: 'Fine Arts', field: 'arts', emoji: '🎨' },
  { id: 'graphic_design', label: 'Graphic Design', field: 'arts', emoji: '🖌️' },
  { id: 'music', label: 'Music', field: 'arts', emoji: '🎵' },
  { id: 'theater', label: 'Theater', field: 'arts', emoji: '🎭' },
  
  { id: 'philosophy', label: 'Philosophy', field: 'arts', emoji: '💭' },
];

export const EDUCATION_PROGRAMS = [
  {
    programId: 'community_college',
    levelId: 'associate',
    label: 'Community College (Associate)',
    years: 2,
    tuition: 1200,
    focusTax: 1,
    stress: 1,
    requires: { levelId: 'high_school' },
    requiresMajor: true,
    emoji: '📄'
  },
  {
    programId: 'university',
    levelId: 'bachelors',
    label: "University (Bachelor's)",
    years: 4,
    tuition: 2200,
    focusTax: 1,
    stress: 1,
    requires: { levelId: 'high_school' },
    requiresMajor: true,
    emoji: '🎓'
  },
  {
    programId: 'grad_school',
    levelId: 'masters',
    label: "Graduate School (Master's)",
    years: 2,
    tuition: 3000,
    focusTax: 1,
    stress: 2,
    requires: { levelId: 'bachelors' },
    requiresMajor: true,
    emoji: '🧠'
  },
  {
    programId: 'phd',
    levelId: 'phd',
    label: 'PhD Program',
    years: 4,
    tuition: 2800,
    focusTax: 1,
    stress: 2,
    requires: { levelId: 'masters' },
    requiresMajor: true,
    emoji: '🔬'
  },
  {
    programId: 'law_school',
    levelId: 'jd',
    label: 'Law School (JD)',
    years: 3,
    tuition: 4500,
    focusTax: 1,
    stress: 2,
    requires: { levelId: 'bachelors' },
    requiresMajor: false,
    recommendedMajors: ['political_science', 'philosophy', 'criminal_justice'],
    emoji: '⚖️'
  },
  {
    programId: 'med_school',
    levelId: 'md',
    label: 'Medical School (MD)',
    years: 4,
    tuition: 6000,
    focusTax: 1,
    stress: 3,
    requires: { levelId: 'bachelors' },
    requiresMajor: false,
    recommendedMajors: ['biology', 'chemistry', 'pre_med'],
    emoji: '🩺'
  },
  {
    programId: 'dental_school',
    levelId: 'dds',
    label: 'Dental School (DDS)',
    years: 4,
    tuition: 5800,
    focusTax: 1,
    stress: 3,
    requires: { levelId: 'bachelors' },
    requiresMajor: false,
    recommendedMajors: ['biology', 'chemistry'],
    emoji: '🦷'
  },
  {
    programId: 'vet_school',
    levelId: 'dvm',
    label: 'Veterinary School (DVM)',
    years: 4,
    tuition: 5600,
    focusTax: 1,
    stress: 3,
    requires: { levelId: 'bachelors' },
    requiresMajor: false,
    recommendedMajors: ['biology'],
    emoji: '🐾'
  },
  {
    programId: 'business_school',
    levelId: 'mba',
    label: 'Business School (MBA)',
    years: 2,
    tuition: 5200,
    focusTax: 1,
    stress: 2,
    requires: { levelId: 'bachelors' },
    requiresMajor: false,
    recommendedMajors: ['business', 'economics', 'finance'],
    emoji: '💼'
  },
];

export function getProgramById(programId) {
  return EDUCATION_PROGRAMS.find(p => p.programId === programId) || null;
}

export function getMajorById(majorId) {
  return MAJORS.find(m => m.id === majorId) || null;
}

export function getEligiblePrograms(currentHighestLevelId) {
  const currentRank = EDUCATION_RANK[currentHighestLevelId] || 0;
  
  return EDUCATION_PROGRAMS.filter(program => {
    const requiredRank = EDUCATION_RANK[program.requires.levelId] || 0;
    return currentRank >= requiredRank && currentRank < EDUCATION_RANK[program.levelId];
  });
}

// Import from jobSystem to avoid duplication
import { EDUCATION_RANK } from './jobSystem';