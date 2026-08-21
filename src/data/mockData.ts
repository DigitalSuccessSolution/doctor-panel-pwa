export function maskPhoneNumber(phone?: string): string {
  if (!phone) return "+91 98765-XXXX";
  const trimmed = phone.trim();
  let count = 0;
  const chars = trimmed.split("");
  for (let i = chars.length - 1; i >= 0; i--) {
    if (/\d/.test(chars[i])) {
      chars[i] = "X";
      count++;
      if (count === 4) break;
    }
  }
  return chars.join("");
}

export interface Shift {
  startTime: string;
  endTime: string;
  _id?: string;
}

export interface DayAvailability {
  dayOfWeek: string;
  shifts: Shift[];
  _id?: string;
}

export interface DoctorProfile {
  fullName: string;
  title: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
  hospital: string;
  phone: string;
  email: string;
  bio: string;
  avatar: string;
  availableDays: string;
  availableHours: string;
  consultationFee?: number;
  clinicAddress?: string;
  degrees?: string[];
  qualifications?: string[];
  languagesSpoken?: string[];
  bankDetails?: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
  };
  about?: string;
  availability?: DayAvailability[];
}

export const DEFAULT_DOCTOR_PROFILE: DoctorProfile = {
  fullName: "",
  title: "",
  specialization: "",
  licenseNumber: "",
  experience: "",
  hospital: "",
  phone: "",
  email: "",
  bio: "",
  avatar: "/doctor_female.png",
  availableDays: "Mon - Sat",
  availableHours: "09:00 AM - 05:00 PM",
  availability: [
    { dayOfWeek: "Monday", shifts: [{ startTime: "09:00", endTime: "17:00" }] },
    { dayOfWeek: "Tuesday", shifts: [{ startTime: "09:00", endTime: "17:00" }] },
    { dayOfWeek: "Wednesday", shifts: [{ startTime: "09:00", endTime: "17:00" }] },
    { dayOfWeek: "Thursday", shifts: [{ startTime: "09:00", endTime: "17:00" }] },
    { dayOfWeek: "Friday", shifts: [{ startTime: "09:00", endTime: "17:00" }] },
    { dayOfWeek: "Saturday", shifts: [{ startTime: "09:00", endTime: "13:00" }] }
  ]
};

export interface Patient {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'private' | 'Boy' | 'Girl';
  dateOfBirth: string;
  ageInMonths?: number;
  prematureDays?: number;
  weight?: number | string; // Weight in kg
  height?: number | string; // Height in cm
  medicalCondition?: string;
  diet?: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | string;
  allergies?: string[];
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentAddress?: string;
  assignedDoctorId?: string;
  avatar?: string;

  // Optional UI helper properties
  code?: string;
  age?: string;
  status?: string;
  statusText?: string;
  growthScore?: number;
  growthTrend?: string;
  bmi?: number;
  heightCm?: number;
  weightKg?: number;
  dob?: string;
  doctorName?: string;
  lastVisit?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  parentId?: string;
  parentName: string;
  parentPhone?: string;
  doctorId?: string;
  doctorName?: string;
  time: string;
  date: string;
  type: 'OPD Checkup' | 'Vaccination' | 'Follow-up' | 'Diet Plan' | 'Emergency' | string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'In-Progress' | string;
  notes?: string;
  doctorNotes?: string;
  meetingLink?: string;
  cancellationReason?: string;
}

export interface MealItem {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  time: string;
  title: string;
  description: string;
  tags: string[];
  iconType: 'sun' | 'utensils' | 'moon' | 'apple';
}

export interface NutritionPlan {
  patientId: string;
  targetCalories: number;
  targetProtein: number;
  targetIron: number;
  targetAchievementPercent: number;
  focusText: string;
  focusImage: string;
  meals: MealItem[];
}

export interface GrowthDataPoint {
  month: number;
  monthLabel: string;
  medianWeight: number;
  p3Weight: number;
  p97Weight: number;
  patientWeight?: number;
  medianHeight: number;
  p3Height: number;
  p97Height: number;
  patientHeight?: number;
}

export interface Milestone {
  id: string;
  title: string;
  achievedAge?: string;
  expectedAge: string;
  status: 'achieved' | 'pending' | 'delayed';
}

export interface MedicalNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  category: 'SOAP Note' | 'Follow-up' | 'Vaccination' | 'Dietary Advisory';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  parentName?: string;
  parentPhone?: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  medicines?: PrescriptionItem[];
  doctorName: string;
  doctorSpecialization?: string;
  fileUrl?: string;
  vitals?: {
    weight?: string;
    temperature?: string;
    bp?: string;
  };
  nextVisitDate?: string;
  nutritionRecommendations?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'growth_alert' | 'report' | 'system';
  read: boolean;
  priority: 'high' | 'normal';
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: '67a0010189ab123456789011',
    name: 'Child 1',
    gender: 'boy',
    dateOfBirth: '2025-10-14',
    ageInMonths: 4,
    prematureDays: 0,
    weight: 6.4,
    height: 62,
    weightKg: 6.4,
    heightCm: 62,
    bmi: 16.2,
    code: '2842-P',
    age: '4 Months',
    dob: 'Born Oct 14, 2025',
    status: 'Stable',
    growthScore: 85,
    growthTrend: '+2.4% this week',
    medicalCondition: 'Healthy growth & routine progress',
    diet: 'Breast milk & Iron-fortified formula',
    bloodType: 'O+',
    allergies: ['None'],
    parentId: '67a0010189ab123456789001',
    parentName: 'Parent 1',
    parentPhone: '+91 98765 43201',
    parentEmail: 'parent1@example.com',
    parentAddress: 'Flat 101, Sunshine Apartments, Mumbai',
    avatar: '/child_avatar_1.png',
  },
  {
    id: '67a0010189ab123456789012',
    name: 'Child 2',
    gender: 'girl',
    dateOfBirth: '2026-05-28',
    ageInMonths: 2,
    prematureDays: 14,
    weight: 4.1,
    height: 54,
    weightKg: 4.1,
    heightCm: 54,
    bmi: 14.0,
    code: '1102-P',
    age: '2 Months',
    dob: 'Born May 28, 2026',
    status: 'Attention',
    growthScore: 48,
    growthTrend: '-1.2% this week',
    medicalCondition: 'Routine pediatric checkup',
    diet: 'Hydrolyzed formula supplement',
    bloodType: 'A+',
    allergies: ['None'],
    parentId: '67a0010189ab123456789002',
    parentName: 'Parent 2',
    parentPhone: '+91 98765 43202',
    parentEmail: 'parent2@example.com',
    parentAddress: 'Flat 202, Green Avenue, Mumbai',
    avatar: '/child_avatar_2.png',
  },
  {
    id: '67a0010189ab123456789013',
    name: 'Child 3',
    gender: 'boy',
    dateOfBirth: '2025-11-02',
    ageInMonths: 8,
    prematureDays: 0,
    weight: 9.1,
    height: 71,
    weightKg: 9.1,
    heightCm: 71,
    bmi: 18.0,
    code: '9042-P',
    age: '8 Months',
    dob: 'Born Nov 02, 2025',
    status: 'Stable',
    growthScore: 92,
    growthTrend: '+4.1% this week',
    medicalCondition: 'Active milestone development',
    diet: 'Solid purées & whole milk blend',
    bloodType: 'B+',
    allergies: ['Peanuts'],
    parentId: '67a0010189ab123456789003',
    parentName: 'Parent 3',
    parentPhone: '+91 98765 43203',
    parentEmail: 'parent3@example.com',
    parentAddress: 'Flat 303, Sea Breeze Towers, Mumbai',
    avatar: '/child_avatar_3.png',
  },
  {
    id: '67a0010189ab123456789014',
    name: 'Child 4',
    gender: 'girl',
    dateOfBirth: '2026-06-30',
    ageInMonths: 1,
    prematureDays: 0,
    weight: 3.8,
    height: 51,
    weightKg: 3.8,
    heightCm: 51,
    bmi: 14.6,
    code: '3310-P',
    age: '1 Month',
    dob: 'Born Jun 30, 2026',
    status: 'Recovering',
    growthScore: 72,
    growthTrend: '+0.8% this week',
    medicalCondition: 'Post-natal routine follow up',
    diet: 'Exclusive Breastfeeding',
    bloodType: 'AB+',
    allergies: ['None'],
    parentId: '67a0010189ab123456789004',
    parentName: 'Parent 4',
    parentPhone: '+91 98765 43204',
    parentEmail: 'parent4@example.com',
    parentAddress: 'Flat 404, Palm Grove Enclave, Mumbai',
    avatar: '/child_avatar_4.png',
  },
  {
    id: '67a0010189ab123456789015',
    name: 'Child 5',
    gender: 'boy',
    dateOfBirth: '2026-01-15',
    ageInMonths: 6,
    prematureDays: 0,
    weight: 7.5,
    height: 66,
    weightKg: 7.5,
    heightCm: 66,
    bmi: 17.2,
    code: '5510-P',
    age: '6 Months',
    dob: 'Born Jan 15, 2026',
    status: 'Stable',
    growthScore: 88,
    growthTrend: '+1.5% this week',
    medicalCondition: 'Normal development & growth evaluation',
    diet: 'Mixed cereal & milk blend',
    bloodType: 'O-',
    allergies: ['None'],
    parentId: '67a0010189ab123456789005',
    parentName: 'Parent 5',
    parentPhone: '+91 98765 43205',
    parentEmail: 'parent5@example.com',
    parentAddress: 'Flat 505, Royal Heights, Mumbai',
    avatar: '/child_avatar_5.png',
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const WHO_GROWTH_DATA: GrowthDataPoint[] = [
  { month: 0, monthLabel: 'Birth', medianWeight: 3.3, p3Weight: 2.5, p97Weight: 4.4, patientWeight: 3.2, medianHeight: 49.9, p3Height: 46.1, p97Height: 53.7, patientHeight: 50 },
  { month: 2, monthLabel: '3m', medianWeight: 5.6, p3Weight: 4.3, p97Weight: 7.1, patientWeight: 5.3, medianHeight: 58.4, p3Height: 54.4, p97Height: 62.4, patientHeight: 57 },
  { month: 4, monthLabel: '6m', medianWeight: 7.0, p3Weight: 5.5, p97Weight: 8.8, patientWeight: 6.8, medianHeight: 63.8, p3Height: 59.6, p97Height: 68.0, patientHeight: 63 },
  { month: 6, monthLabel: '9m', medianWeight: 7.9, p3Weight: 6.3, p97Weight: 9.9, patientWeight: 7.7, medianHeight: 67.6, p3Height: 63.2, p97Height: 72.0, patientHeight: 67 },
  { month: 8, monthLabel: '12m', medianWeight: 8.6, p3Weight: 6.9, p97Weight: 10.7, patientWeight: 8.4, medianHeight: 70.6, p3Height: 66.1, p97Height: 75.1, patientHeight: 71 },
  { month: 10, monthLabel: '15m', medianWeight: 9.2, p3Weight: 7.4, p97Weight: 11.5, patientWeight: undefined, medianHeight: 73.3, p3Height: 68.6, p97Height: 78.0, patientHeight: undefined },
  { month: 12, monthLabel: '18m', medianWeight: 9.6, p3Weight: 7.8, p97Weight: 12.0, patientWeight: undefined, medianHeight: 75.7, p3Height: 70.9, p97Height: 80.5, patientHeight: undefined }
];

export const LEO_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Sitting without support', achievedAge: '6.5 months', expectedAge: '6-7 months', status: 'achieved' },
  { id: 'm2', title: 'Transfers objects between hands', achievedAge: '7.2 months', expectedAge: '7-8 months', status: 'achieved' },
  { id: 'm3', title: 'Crawling', expectedAge: '8-10 months', status: 'pending' },
  { id: 'm4', title: 'First words', expectedAge: '10-12 months', status: 'pending' }
];

export const SAMPLE_NUTRITION_PLAN: NutritionPlan = {
  patientId: '1',
  targetCalories: 1850,
  targetProtein: 65,
  targetIron: 12,
  targetAchievementPercent: 85,
  focusText: 'Emphasis on iron-rich foods and high bioavailability for developmental support.',
  focusImage: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=800',
  meals: [
    {
      id: 'meal-1',
      meal: 'Breakfast',
      time: '08:00 AM',
      title: 'Oatmeal with fortified iron',
      description: 'Oatmeal with fortified iron, sliced bananas, and a dash of cinnamon.',
      tags: ['HIGH IRON', 'FIBER'],
      iconType: 'sun'
    },
    {
      id: 'meal-2',
      meal: 'Lunch',
      time: '12:30 PM',
      title: 'Quinoa & roasted sweet potato bowl',
      description: 'Quinoa and roasted sweet potato bowl with lean chicken breast strips.',
      tags: ['PROTEIN+', 'CLEAN'],
      iconType: 'utensils'
    },
    {
      id: 'meal-3',
      meal: 'Dinner',
      time: '06:30 PM',
      title: 'Steamed salmon with baby spinach',
      description: 'Steamed salmon with baby spinach and brown rice. Light lemon dressing.',
      tags: ['OMEGA 3', 'VITAMINS'],
      iconType: 'moon'
    },
    {
      id: 'meal-4',
      meal: 'Snacks',
      time: 'As needed',
      title: 'Sliced apple with almond butter',
      description: 'Sliced apple with almond butter or low-fat yogurt with seeds.',
      tags: ['QUICK', 'HEALTHY'],
      iconType: 'apple'
    }
  ]
};

export const INITIAL_NOTES: MedicalNote[] = [
  {
    id: 'note-1',
    patientId: '1',
    patientName: 'Leo Henderson',
    date: '2026-07-20',
    category: 'SOAP Note',
    subjective: 'Parent reports baby is sleeping well, taking 6 feeds a day.',
    objective: 'Weight: 6.4 kg (78th percentile), Height: 62 cm (82nd percentile). Normal heart rate.',
    assessment: 'Healthy development, appropriate weight velocity.',
    plan: 'Continue iron-fortified cereals. Schedule 6-month checkup.'
  },
  {
    id: 'note-2',
    patientId: '2',
    patientName: 'Maya Chen',
    date: '2026-07-28',
    category: 'Dietary Advisory',
    subjective: 'Frequent regurgitation post-feeding.',
    objective: 'Weight drop to 4.1 kg (-1.2% this week). mild dehydration signs.',
    assessment: 'Mild failure to thrive due to feeding intolerance.',
    plan: 'Switch to hydrolyzed formula, weekly weight check.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Attention: Maya Chen',
    message: 'Growth score dropped to 48 (Low Weight alert). Immediate diet review advised.',
    timestamp: '10 min ago',
    type: 'growth_alert',
    read: false,
    priority: 'high'
  },
  {
    id: 'notif-2',
    title: 'Upcoming Appointment',
    message: 'Aarav Mehta at 09:30 AM for General Checkup.',
    timestamp: '30 min ago',
    type: 'appointment',
    read: false,
    priority: 'normal'
  },
  {
    id: 'notif-3',
    title: 'Monthly Pediatrics Summary Ready',
    message: 'July 2026 clinical report has been compiled and is ready for export.',
    timestamp: '2 hours ago',
    type: 'report',
    read: true,
    priority: 'normal'
  }
];
