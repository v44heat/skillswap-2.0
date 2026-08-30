// ─────────────────────────────────────────────────────────────
// IMPORTANT: Set this to your PC's local IP address.
//
// How to find it on Windows:
//   1. Open Command Prompt
//   2. Type: ipconfig
//   3. Look for "IPv4 Address" e.g. 192.168.1.105
//   4. Set: http://192.168.1.105:8080/api
//
// Options:
//   Physical device (Android/iOS) → http://YOUR_PC_IP:8080/api
//   Android emulator               → http://10.0.2.2:8080/api
//   iOS simulator                  → http://localhost:8080/api
// ─────────────────────────────────────────────────────────────
export const API_BASE_URL = ' https://target-decency-tulip.ngrok-free.dev/api';


export const CATEGORIES = [
  'Programming', 'Mathematics', 'Languages', 'Design',
  'Music', 'Writing', 'Science', 'Business', 'Other',
];

export const PROFICIENCY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export const YEARS_OF_STUDY = [
  { value: 1, label: '1st Year' },
  { value: 2, label: '2nd Year' },
  { value: 3, label: '3rd Year' },
  { value: 4, label: '4th Year' },
  { value: 5, label: '5th Year+' },
];

export const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'English', 'History', 'Economics', 'Design',
  'Music', 'Business', 'Engineering', 'Other',
];
