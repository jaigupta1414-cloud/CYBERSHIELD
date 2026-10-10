export interface LiveLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
  source: 'gps_high' | 'network_wifi' | 'ip_geolocation' | 'manual_city';
  sourceLabel: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  error?: string | null;
}

// Indian Default Coordinates: India Gate / New Delhi
export const DEFAULT_INDIA_LOCATION: LiveLocationData = {
  latitude: 28.613939,
  longitude: 77.209021,
  accuracy: 25,
  altitude: 216,
  heading: null,
  speed: null,
  timestamp: Date.now(),
  source: 'manual_city',
  sourceLabel: 'New Delhi (Default Indian Grid)',
  address: 'Rajpath, India Gate, New Delhi, Delhi 110001, India',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110001',
  country: 'India',
  error: null,
};

// Major Indian Cities for Quick Selection
export const MAJOR_INDIAN_CITIES = [
  { name: 'New Delhi', state: 'Delhi', lat: 28.6139, lon: 77.2090, pincode: '110001' },
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lon: 72.8777, pincode: '400001' },
  { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lon: 77.5946, pincode: '560001' },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lon: 78.4867, pincode: '500001' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707, pincode: '600001' },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639, pincode: '700001' },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567, pincode: '411001' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714, pincode: '380001' },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873, pincode: '302001' },
  { name: 'Chandigarh', state: 'Punjab/Haryana', lat: 30.7333, lon: 76.7794, pincode: '160017' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, pincode: '226001' },
];

// Indian Emergency Dispatch Lines
export interface IndianDispatchLine {
  id: string;
  number: string;
  title: string;
  department: string;
  category: 'all_in_one' | 'cyber' | 'police' | 'medical' | 'fire' | 'women' | 'disaster' | 'other';
  description: string;
  badge: string;
  isNational: boolean;
  color: string;
}

export const INDIAN_DISPATCH_LINES: IndianDispatchLine[] = [
  {
    id: 'in-112',
    number: '112',
    title: '112 - National Emergency Response Support (ERSS)',
    department: 'Ministry of Home Affairs (MHA), Govt. of India',
    category: 'all_in_one',
    description: 'Unified all-in-one emergency number across all states of India for Police, Fire, Ambulance, and Disaster assistance.',
    badge: 'ALL-IN-ONE PRIMARY',
    isNational: true,
    color: 'emerald',
  },
  {
    id: 'in-1930',
    number: '1930',
    title: '1930 - National Cyber Crime Emergency Helpline',
    department: 'Indian Cyber Crime Coordination Centre (I4C), MHA',
    category: 'cyber',
    description: 'Instant financial cyber fraud reporting & account freeze helpline. Reports unauthorized UPI, banking, phishing, or malware extortion attacks.',
    badge: 'CYBER FRAUD & ATTACKS',
    isNational: true,
    color: 'cyan',
  },
  {
    id: 'in-100',
    number: '100',
    title: '100 - Police Emergency Control Room',
    department: 'State & City Police Forces',
    category: 'police',
    description: 'Direct police emergency control dispatch for immediate physical safety, criminal threats, and protection.',
    badge: 'POLICE DISPATCH',
    isNational: true,
    color: 'blue',
  },
  {
    id: 'in-108',
    number: '108',
    title: '108 - Emergency Medical Ambulance & Trauma',
    department: 'National Health Mission (NHM)',
    category: 'medical',
    description: 'Free 24x7 emergency medical trauma ambulance, cardiac response, and hospital transport.',
    badge: 'MEDICAL AMBULANCE',
    isNational: true,
    color: 'rose',
  },
  {
    id: 'in-101',
    number: '101',
    title: '101 - Fire & Rescue Services',
    department: 'Fire & Emergency Services Directorate',
    category: 'fire',
    description: 'Fire suppression, building evacuation, chemical spills, and hazardous rescue operations.',
    badge: 'FIRE & RESCUE',
    isNational: true,
    color: 'amber',
  },
  {
    id: 'in-1091',
    number: '1091',
    title: '1091 / 1090 - Women Safety & Distress Helpline',
    department: 'National Commission for Women / State Police',
    category: 'women',
    description: 'Dedicated 24/7 helpline for women in distress, stalking, harassment, or domestic emergency.',
    badge: 'WOMEN SAFETY',
    isNational: true,
    color: 'purple',
  },
  {
    id: 'in-1078',
    number: '1078',
    title: '1078 - National Disaster Response Force (NDRF)',
    department: 'National Disaster Management Authority (NDMA)',
    category: 'disaster',
    description: 'Emergency control room for floods, earthquakes, cyclones, and severe industrial disasters.',
    badge: 'DISASTER RELIEF',
    isNational: true,
    color: 'orange',
  },
  {
    id: 'in-1075',
    number: '1075',
    title: '1075 - National Health Helpline',
    department: 'Ministry of Health and Family Welfare (MoHFW)',
    category: 'medical',
    description: 'Emergency medical guidance, disease outbreak helpline, and central hospital directory.',
    badge: 'HEALTH HELPLINE',
    isNational: true,
    color: 'teal',
  },
  {
    id: 'in-1098',
    number: '1098',
    title: '1098 - Childline India Emergency',
    department: 'Ministry of Women and Child Development',
    category: 'other',
    description: '24-hour nationwide emergency phone service for children in need of aid and assistance.',
    badge: 'CHILD SAFETY',
    isNational: true,
    color: 'sky',
  },
  {
    id: 'in-1072',
    number: '1072',
    title: '1072 - Indian Railways Emergency & Accident',
    department: 'Ministry of Railways, Govt. of India',
    category: 'other',
    description: 'Direct emergency helpline for train accidents, security on platforms, and railway transit emergencies.',
    badge: 'RAILWAYS DISPATCH',
    isNational: true,
    color: 'indigo',
  },
  {
    id: 'in-1033',
    number: '1033',
    title: '1033 - National Highway Emergency & Trauma (NHAI)',
    department: 'National Highways Authority of India',
    category: 'other',
    description: '24/7 roadside assistance, highway accident ambulance, and crane/patrol support on all Indian National Highways.',
    badge: 'HIGHWAY RESCUE',
    isNational: true,
    color: 'yellow',
  },
];

/**
 * Reverse geocode latitude and longitude to get full Indian address
 */
export async function reverseGeocodeIndia(lat: number, lon: number): Promise<{
  fullAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { 'Accept': 'application/json', 'User-Agent': 'CyberShield-India-Emergency/2.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
      const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'New Delhi';
      const state = addr.state || 'Delhi';
      const pincode = addr.postcode || '';
      const country = addr.country || 'India';
      
      const parts = [road, city, state, pincode ? `PIN: ${pincode}` : '', country].filter(Boolean);
      const fullAddress = parts.join(', ') || data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;

      return { fullAddress, city, state, pincode, country };
    }
  } catch (err) {
    console.warn('Reverse geocode error, using coordinate string:', err);
  }

  return {
    fullAddress: `Coordinates: ${lat.toFixed(5)}° N, ${lon.toFixed(5)}° E, India`,
    city: 'India Location',
    state: 'India',
    pincode: '',
    country: 'India',
  };
}

/**
 * Attempt to get live IP-based location (essential fallback when browser GPS is blocked in iframe/laptop)
 */
export async function fetchLiveIpLocation(): Promise<Partial<LiveLocationData> | null> {
  // Try service 1: ipwho.is (CORS friendly, high accuracy for India)
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 1500, // IP accuracy usually ~1.5km
          city: data.city || 'India',
          state: data.region || 'India',
          pincode: data.postal || '',
          country: data.country || 'India',
          source: 'ip_geolocation',
          sourceLabel: `Live IP Network: ${data.city || 'India'} (${data.connection?.isp || data.ip || 'Broadband'})`,
          address: `${data.city || ''}, ${data.region || ''}, ${data.country || 'India'} ${data.postal || ''}`.trim(),
        };
      }
    }
  } catch (e) {
    // try fallback service
  }

  // Try service 2: freeipapi.com
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (res.ok) {
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 2500,
          city: data.cityName || 'India',
          state: data.regionName || 'India',
          pincode: data.zipCode || '',
          country: data.countryName || 'India',
          source: 'ip_geolocation',
          sourceLabel: `Live Network Location: ${data.cityName || 'India'}`,
          address: `${data.cityName || ''}, ${data.regionName || ''}, ${data.countryName || 'India'}`.trim(),
        };
      }
    }
  } catch (e) {
    // fallback
  }

  return null;
}

/**
 * Multi-Tier Live Location Resolver
 * 1. Tries high accuracy HTML5 GPS (timeout 4s)
 * 2. Tries standard accuracy HTML5 GPS / Wi-Fi (timeout 4s)
 * 3. Falls back to real-time IP Geolocation (returns real user city/coordinates)
 * 4. Falls back to Indian Default (New Delhi)
 */
export async function getLiveIndiaLocation(
  onProgress?: (status: string) => void
): Promise<LiveLocationData> {
  if (typeof window === 'undefined') {
    return DEFAULT_INDIA_LOCATION;
  }

  // Check HTML5 geolocation
  if ('geolocation' in navigator) {
    onProgress?.('Acquiring high-accuracy satellite GPS signal...');

    // Attempt 1: High Accuracy GPS
    const highAccuracyResult = await new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });

    if (highAccuracyResult) {
      onProgress?.('Live GPS lock established! Resolving address...');
      const lat = highAccuracyResult.coords.latitude;
      const lon = highAccuracyResult.coords.longitude;
      const geoInfo = await reverseGeocodeIndia(lat, lon);

      return {
        latitude: lat,
        longitude: lon,
        accuracy: Math.round(highAccuracyResult.coords.accuracy),
        altitude: highAccuracyResult.coords.altitude ? Math.round(highAccuracyResult.coords.altitude) : null,
        heading: highAccuracyResult.coords.heading ? Math.round(highAccuracyResult.coords.heading) : null,
        speed: highAccuracyResult.coords.speed ? Math.round(highAccuracyResult.coords.speed * 3.6) : null,
        timestamp: highAccuracyResult.timestamp,
        source: 'gps_high',
        sourceLabel: 'Live GPS Satellite Lock (High Precision)',
        address: geoInfo.fullAddress,
        city: geoInfo.city,
        state: geoInfo.state,
        pincode: geoInfo.pincode,
        country: geoInfo.country,
        error: null,
      };
    }

    // Attempt 2: Wi-Fi / Cell Triangulation (Normal accuracy)
    onProgress?.('Connecting to Wi-Fi / Mobile Tower network triangulation...');
    const lowAccuracyResult = await new Promise<GeolocationPosition | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        () => resolve(null),
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 10000 }
      );
    });

    if (lowAccuracyResult) {
      onProgress?.('Network triangulation successful! Resolving address...');
      const lat = lowAccuracyResult.coords.latitude;
      const lon = lowAccuracyResult.coords.longitude;
      const geoInfo = await reverseGeocodeIndia(lat, lon);

      return {
        latitude: lat,
        longitude: lon,
        accuracy: Math.round(lowAccuracyResult.coords.accuracy),
        altitude: null,
        heading: null,
        speed: null,
        timestamp: lowAccuracyResult.timestamp,
        source: 'network_wifi',
        sourceLabel: 'Live Wi-Fi / Cellular Triangulation',
        address: geoInfo.fullAddress,
        city: geoInfo.city,
        state: geoInfo.state,
        pincode: geoInfo.pincode,
        country: geoInfo.country,
        error: null,
      };
    }
  }

  // Attempt 3: IP Geolocation (works when iframe denies geolocation)
  onProgress?.('Browser GPS restricted. Querying live IP network location in India...');
  const ipResult = await fetchLiveIpLocation();
  if (ipResult && ipResult.latitude && ipResult.longitude) {
    onProgress?.('Live IP Location identified in India!');
    return {
      latitude: ipResult.latitude,
      longitude: ipResult.longitude,
      accuracy: ipResult.accuracy || 1500,
      altitude: null,
      heading: null,
      speed: null,
      timestamp: Date.now(),
      source: 'ip_geolocation',
      sourceLabel: ipResult.sourceLabel || 'Live Internet Network Location',
      address: ipResult.address || `${ipResult.city}, ${ipResult.state}, India`,
      city: ipResult.city || 'India',
      state: ipResult.state || 'India',
      pincode: ipResult.pincode || '',
      country: ipResult.country || 'India',
      error: null,
    };
  }

  // Attempt 4: Default Indian Grid (New Delhi)
  onProgress?.('Using primary Indian central grid.');
  return DEFAULT_INDIA_LOCATION;
}

/**
 * Generates emergency dispatch script in English & Hindi for Indian dispatchers
 */
export function generateIndianDispatcherScript(
  location: LiveLocationData,
  operatorName: string,
  badge: string
): { english: string; hindi: string; shareLink: string; coordinatesStr: string } {
  const lat = location.latitude.toFixed(6);
  const lon = location.longitude.toFixed(6);
  const acc = location.accuracy ? `±${location.accuracy}m` : '±10m';
  const addr = location.address || `${location.city || 'Delhi'}, ${location.state || 'India'}`;
  const gmapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

  const english = `🚨 EMERGENCY DISPATCH REPORT - INDIA (ERSS 112 / CYBER 1930)
Operator / Reporter: ${operatorName} (${badge})
Current Address: ${addr}
Exact GPS Coordinates: Latitude ${lat}° N, Longitude ${lon}° E (Accuracy: ${acc})
Live Google Maps Location: ${gmapsUrl}
Situation: Emergency assistance requested. Please dispatch nearest response team to these coordinates immediately.`;

  const hindi = `🚨 आपातकालीन सूचना (EMERGENCY DISPATCH):
कृपया तुरंत सहायता भेजें! मेरा वर्तमान स्थान है:
पता (Address): ${addr}
जीपीएस निर्देशांक (GPS Coordinates): अक्षांश ${lat}, देशांतर ${lon} (सटीकता ${acc})
गूगल मैप्स लिंक (Google Maps): ${gmapsUrl}
अधिकारी / रिपोर्टर: ${operatorName} (${badge})`;

  return {
    english,
    hindi,
    shareLink: gmapsUrl,
    coordinatesStr: `${lat}, ${lon}`,
  };
}
