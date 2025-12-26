/**
 * GeminiMissionData - Dati storici missioni Gemini
 * Complessità: O(1) per lookup missione
 */
export const GEMINI_MISSIONS = [
  {
    id: 'gemini-3',
    name: 'Gemini 3',
    date: '1965-03-23',
    crew: ['Virgil Grissom', 'John Young'],
    duration: '4h 52m',
    objectives: ['First manned Gemini flight', 'Orbital maneuvers'],
    orbit: {
      apogee: 224,
      perigee: 161,
      inclination: 32.5,
      period: 88.3
    },
    launchSite: { lat: 28.6082, lon: -80.6041 }, // Cape Canaveral
    splashdown: { lat: 22.5, lon: -70.0 }
  },
  {
    id: 'gemini-4',
    name: 'Gemini 4',
    date: '1965-06-03',
    crew: ['James McDivitt', 'Edward White'],
    duration: '4d 1h 56m',
    objectives: ['First US spacewalk', 'Extended duration'],
    orbit: {
      apogee: 282,
      perigee: 162,
      inclination: 32.5,
      period: 88.8
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 27.7, lon: -74.0 }
  },
  {
    id: 'gemini-5',
    name: 'Gemini 5',
    date: '1965-08-21',
    crew: ['Gordon Cooper', 'Charles Conrad'],
    duration: '7d 22h 55m',
    objectives: ['8-day duration record', 'Fuel cell testing'],
    orbit: {
      apogee: 350,
      perigee: 162,
      inclination: 32.5,
      period: 89.5
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 29.7, lon: -69.0 }
  },
  {
    id: 'gemini-6a',
    name: 'Gemini 6A',
    date: '1965-12-15',
    crew: ['Walter Schirra', 'Thomas Stafford'],
    duration: '1d 1h 51m',
    objectives: ['Rendezvous with Gemini 7', 'First space rendezvous'],
    orbit: {
      apogee: 311,
      perigee: 161,
      inclination: 28.9,
      period: 88.7
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 23.6, lon: -67.8 }
  },
  {
    id: 'gemini-7',
    name: 'Gemini 7',
    date: '1965-12-04',
    crew: ['Frank Borman', 'James Lovell'],
    duration: '13d 18h 35m',
    objectives: ['14-day duration record', 'Rendezvous target'],
    orbit: {
      apogee: 328,
      perigee: 161,
      inclination: 28.9,
      period: 89.0
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 25.4, lon: -69.7 }
  },
  {
    id: 'gemini-8',
    name: 'Gemini 8',
    date: '1966-03-16',
    crew: ['Neil Armstrong', 'David Scott'],
    duration: '10h 41m',
    objectives: ['First docking in space', 'Emergency abort'],
    orbit: {
      apogee: 271,
      perigee: 160,
      inclination: 28.9,
      period: 88.6
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 25.2, lon: -136.0 }
  },
  {
    id: 'gemini-9a',
    name: 'Gemini 9A',
    date: '1966-06-03',
    crew: ['Thomas Stafford', 'Eugene Cernan'],
    duration: '3d 0h 21m',
    objectives: ['Docking practice', 'Spacewalk'],
    orbit: {
      apogee: 310,
      perigee: 159,
      inclination: 28.9,
      period: 88.7
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 27.9, lon: -75.0 }
  },
  {
    id: 'gemini-10',
    name: 'Gemini 10',
    date: '1966-07-18',
    crew: ['John Young', 'Michael Collins'],
    duration: '2d 22h 47m',
    objectives: ['Dual rendezvous', 'High altitude flight'],
    orbit: {
      apogee: 763,
      perigee: 159,
      inclination: 28.9,
      period: 95.2
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 26.7, lon: -71.9 }
  },
  {
    id: 'gemini-11',
    name: 'Gemini 11',
    date: '1966-09-12',
    crew: ['Charles Conrad', 'Richard Gordon'],
    duration: '2d 23h 17m',
    objectives: ['High altitude record', 'Tether experiment'],
    orbit: {
      apogee: 1374,
      perigee: 160,
      inclination: 28.9,
      period: 101.5
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 24.3, lon: -70.0 }
  },
  {
    id: 'gemini-12',
    name: 'Gemini 12',
    date: '1966-11-11',
    crew: ['James Lovell', 'Buzz Aldrin'],
    duration: '3d 22h 35m',
    objectives: ['Final Gemini mission', 'Extended spacewalk'],
    orbit: {
      apogee: 301,
      perigee: 161,
      inclination: 28.9,
      period: 88.8
    },
    launchSite: { lat: 28.6082, lon: -80.6041 },
    splashdown: { lat: 24.6, lon: -69.9 }
  }
];

/**
 * Get mission by ID
 * O(1) - lookup costante
 */
export function getMission(id) {
  return GEMINI_MISSIONS.find(m => m.id === id);
}

/**
 * Get all missions sorted by date
 * O(n log n) - sorting
 */
export function getAllMissions() {
  return [...GEMINI_MISSIONS].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
}

