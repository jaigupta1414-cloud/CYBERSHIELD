import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Radio, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  Phone,
  ShieldAlert, 
  Navigation, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle,
  X,
  Copy,
  Check,
  MessageSquare,
  Volume1,
  LifeBuoy,
  Compass,
  ArrowRight,
  Shield
} from 'lucide-react';
import { GeoLocationState, EmergencyContact, OperatorProfile } from '../types';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface EmergencySosViewProps {
  operator: OperatorProfile;
  emergencyContacts: EmergencyContact[];
  onAddContact?: (contact: EmergencyContact) => void;
  onDeleteContact?: (id: string) => void;
}

export const EmergencySosView: React.FC<EmergencySosViewProps> = ({ 
  operator, 
  emergencyContacts,
  onAddContact,
  onDeleteContact,
}) => {
  const [geoState, setGeoState] = useState<GeoLocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    altitude: null,
    heading: null,
    speed: null,
    timestamp: null,
    error: null,
    trackingActive: false,
  });

  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [sosBroadcastSent, setSosBroadcastSent] = useState(false);
  const [copiedBeacon, setCopiedBeacon] = useState(false);

  // High-Contrast Help Modal State for Non-Technical Users
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [activeHelpTab, setActiveHelpTab] = useState<'contacts' | 'location' | 'script'>('contacts');
  const [copiedLocation, setCopiedLocation] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [customPhone, setCustomPhone] = useState<string>('');
  const [isSpeakingLocation, setIsSpeakingLocation] = useState<boolean>(false);
  const [contrastTheme, setContrastTheme] = useState<'gold' | 'yellow' | 'white'>('gold');

  const [showAddContactModal, setShowAddContactModal] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactRole, setNewContactRole] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');

  const countdownTimerRef = useRef<any>(null);
  const geoWatchIdRef = useRef<number | null>(null);

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
        headers: { 'Accept': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const road = data.address?.road || '';
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
          const state = data.address?.state || '';
          const shortAddr = [road, city, state].filter(Boolean).join(', ') || data.display_name;
          setGeoState((prev) => ({ ...prev, address: shortAddr }));
        }
      }
    } catch {
      // Ignore geocode error
    }
  };

  // Initialize Geolocation Tracking
  useEffect(() => {
    startLocationTracking();
    return () => {
      stopLocationTracking();
      sound.stopEmergencySiren();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard shortcut to dismiss Help Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHelpModal) {
        setShowHelpModal(false);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          setIsSpeakingLocation(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelpModal]);

  const startLocationTracking = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGeoState((prev) => ({ ...prev, trackingActive: true, error: null }));

      // Immediate position
      navigator.geolocation.getCurrentPosition(
        (pos) => updateGeo(pos),
        (err) => {
          setGeoState((prev) => ({
            ...prev,
            error: `GPS Error (${err.code}): ${err.message}. Defaulting to Base Station Grid.`,
            latitude: 37.7749,
            longitude: -122.4194,
            accuracy: 12,
            timestamp: Date.now(),
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Continuous watch
      try {
        geoWatchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => updateGeo(pos),
          (err) => console.warn('Geo watch error:', err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
        );
      } catch (e) {
        console.warn('Geolocation watch not permitted in this frame', e);
      }
    } else {
      setGeoState((prev) => ({
        ...prev,
        error: 'HTML5 Geolocation is not supported on this device. Using Base Station Grid.',
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 15,
        timestamp: Date.now(),
      }));
    }
  };

  const stopLocationTracking = () => {
    if (geoWatchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }
    setGeoState((prev) => ({ ...prev, trackingActive: false }));
  };

  const updateGeo = (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    setGeoState((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
      accuracy: Math.round(pos.coords.accuracy),
      altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
      heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
      speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null, // km/h
      timestamp: pos.timestamp,
      error: null,
      trackingActive: true,
    }));
    fetchAddress(lat, lon);
  };

  // SOS Countdown & Activation Logic
  const initiateSosCountdown = () => {
    sound.playWarning();
    setCountdown(5);

    let current = 5;
    countdownTimerRef.current = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
        sound.playBeep(880, 0.1, 'square');
      } else {
        clearInterval(countdownTimerRef.current);
        setCountdown(null);
        triggerFullSosAlert();
      }
    }, 1000);
  };

  const cancelSosCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
    sound.playBeep(440, 0.1);
  };

  const triggerFullSosAlert = () => {
    setSosActive(true);
    setSirenPlaying(true);
    setSosBroadcastSent(true);
    sound.startEmergencySiren();

    const coordsStr = geoState.latitude && geoState.longitude
      ? `${geoState.latitude.toFixed(5)}, ${geoState.longitude.toFixed(5)} (±${geoState.accuracy}m)`
      : 'UNKNOWN';

    notificationService.send(
      'EMERGENCY SOS BROADCAST ACTIVE',
      `Operator ${operator.badgeNumber} triggered emergency distress beacon at coordinates: ${coordsStr}`,
      'sos'
    );
  };

  const disarmSos = () => {
    setSosActive(false);
    setSirenPlaying(false);
    setCountdown(null);
    sound.stopEmergencySiren();
    sound.playSuccess();
    notificationService.send('SOS Distress Disarmed', 'Emergency distress beacon silenced by authenticated operator.');
  };

  const toggleSirenMute = () => {
    if (sirenPlaying) {
      sound.stopEmergencySiren();
      setSirenPlaying(false);
    } else {
      sound.startEmergencySiren();
      setSirenPlaying(true);
    }
  };

  const getBeaconPayload = () => {
    return JSON.stringify({
      protocol: 'CYBERSHIELD-SOS-RFC4094',
      badge: operator.badgeNumber,
      callsign: operator.callsign,
      level: `LEVEL-${operator.clearanceLevel}`,
      gps: {
        lat: geoState.latitude,
        lon: geoState.longitude,
        acc_meters: geoState.accuracy,
      },
      time: new Date().toISOString(),
      map_url: geoState.latitude && geoState.longitude
        ? `https://www.google.com/maps?q=${geoState.latitude},${geoState.longitude}`
        : '',
    }, null, 2);
  };

  const handleCopyBeacon = () => {
    navigator.clipboard.writeText(getBeaconPayload());
    setCopiedBeacon(true);
    sound.playBeep(900, 0.05);
    setTimeout(() => setCopiedBeacon(false), 2000);
  };

  const getPlainEnglishEmergencyText = () => {
    const lat = geoState.latitude ? geoState.latitude.toFixed(6) : '37.774929';
    const lon = geoState.longitude ? geoState.longitude.toFixed(6) : '-122.419416';
    const acc = geoState.accuracy ? `within ${geoState.accuracy} meters` : 'within 10 meters';
    const mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
    const addressLine = geoState.address ? `\n🏢 Physical Address: ${geoState.address}` : '';
    return `🚨 EMERGENCY: I need immediate assistance!\n📍 GPS coordinates: Latitude ${lat}, Longitude ${lon} (Accurate ${acc})${addressLine}\n🗺️ Tap for location pin: ${mapUrl}\n👤 Operator / Reporter: ${operator.callsign} (${operator.badgeNumber})`;
  };

  const handleCopyLocation = () => {
    const text = getPlainEnglishEmergencyText();
    navigator.clipboard.writeText(text);
    setCopiedLocation(true);
    sound.playSuccess();
    notificationService.send('Location Copied', 'Coordinates and Google Maps link copied to your clipboard. You can paste it into SMS, email, or chat.');
    setTimeout(() => setCopiedLocation(false), 2500);
  };

  const handleCopyScript = () => {
    const lat = geoState.latitude ? geoState.latitude.toFixed(5) : '37.77493';
    const lon = geoState.longitude ? geoState.longitude.toFixed(5) : '-122.41942';
    const scriptText = `Hello dispatcher, I am reporting an emergency. My exact GPS coordinates are: Latitude ${lat}, Longitude ${lon}. My location accuracy is within ${geoState.accuracy ?? 10} meters. Please send response units immediately.`;
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    sound.playSuccess();
    notificationService.send('911 Script Copied', 'Operator script copied to clipboard. Ready to read or send.');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleShareLocationNative = async () => {
    const text = getPlainEnglishEmergencyText();
    const mapUrl = `https://www.google.com/maps?q=${geoState.latitude ?? 37.7749},${geoState.longitude ?? -122.4194}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '🚨 EMERGENCY: Distress Location',
          text: text,
          url: mapUrl,
        });
        sound.playSuccess();
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyLocation();
  };

  const speakLocationText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      notificationService.send('Speech Not Supported', 'Voice synthesis is not available on this browser.');
      return;
    }
    if (isSpeakingLocation) {
      window.speechSynthesis.cancel();
      setIsSpeakingLocation(false);
      return;
    }
    const lat = geoState.latitude ? geoState.latitude.toFixed(4) : '37.7749';
    const lon = geoState.longitude ? geoState.longitude.toFixed(4) : '-122.4194';
    const acc = geoState.accuracy ?? 10;
    const spoken = `Emergency location assistance. Your latitude is ${lat}. Your longitude is ${lon}. Your position is accurate within ${acc} meters. Tell your dispatcher: Latitude ${lat}, Longitude ${lon}.`;
    
    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.rate = 0.88;
    utterance.onend = () => setIsSpeakingLocation(false);
    utterance.onerror = () => setIsSpeakingLocation(false);
    setIsSpeakingLocation(true);
    window.speechSynthesis.speak(utterance);
  };

  const getSmsLink = (phone?: string) => {
    const encodedBody = encodeURIComponent(getPlainEnglishEmergencyText());
    if (phone) {
      const clean = phone.replace(/[^0-9+]/g, '');
      return `sms:${clean}?&body=${encodedBody}`;
    }
    return `sms:?&body=${encodedBody}`;
  };

  const getWhatsAppLink = () => {
    const encodedText = encodeURIComponent(getPlainEnglishEmergencyText());
    return `https://wa.me/?text=${encodedText}`;
  };

  return (
    <div className="space-y-6 pb-20 font-sans text-xs">

      {/* ============================================================ */}
      {/* LARGE PROMINENT 'HELP' BANNER FOR NON-TECHNICAL USERS         */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden rounded-xl border-3 border-amber-400 bg-amber-400 dark:bg-amber-500 text-black p-4 sm:p-6 shadow-xl transition-all">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          
          <div className="flex items-start sm:items-center gap-4 text-left w-full lg:w-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black text-amber-300 flex items-center justify-center shrink-0 shadow-lg border-2 border-black">
              <LifeBuoy className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5] animate-spin-slow" />
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-black uppercase">
                  NON-TECHNICAL USER EMERGENCY GUIDE
                </span>
                <span className="bg-black text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  HIGH CONTRAST
                </span>
              </div>
              <p className="text-sm font-semibold text-black/90 max-w-2xl leading-snug">
                Need immediate emergency response? Tap the <span className="underline font-bold">HELP</span> button for instant one-touch emergency calls, step-by-step location sharing, and plain-English dispatcher instructions.
              </p>
            </div>
          </div>

          {/* LARGE 'HELP' BUTTON */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => {
                sound.playWarning();
                setShowHelpModal(true);
              }}
              className="w-full lg:w-auto px-8 sm:px-10 py-4 rounded-xl bg-black hover:bg-neutral-900 active:scale-95 text-amber-300 font-black text-lg sm:text-xl uppercase tracking-wider shadow-2xl flex items-center justify-center gap-3 transition-all border-3 border-black hover:border-neutral-800 cursor-pointer group"
              aria-label="Open Emergency Help Modal with One-Touch Calling and Location Sharing"
            >
              <PhoneCall className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform animate-pulse" />
              <span>HELP</span>
              <span className="text-xs font-black bg-amber-400 text-black px-2.5 py-1 rounded-md ml-1 tracking-normal uppercase">
                1-TOUCH DIAL
              </span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Top Tactical Banner */}
      <div className={`p-4 sm:p-5 rounded-lg border transition-all ${
        sosActive 
          ? 'bg-rose-950/40 border-rose-600 text-rose-200 animate-pulse'
          : 'bg-white dark:bg-[#0e141e] border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${sosActive ? 'bg-rose-600 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'}`}>
              <Radio className={`w-5 h-5 ${sosActive ? 'animate-spin' : 'animate-pulse'}`} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 font-mono-code">
                <span>EMERGENCY SOS &amp; TACTICAL RESCUE HUB</span>
                {sosActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-600 text-white font-bold animate-ping">
                    DISTRESS ACTIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                GPS coordinate broadcasting, audible distress beacon, and direct incident response dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sosActive && (
              <button
                onClick={toggleSirenMute}
                className="px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-800 text-white flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                {sirenPlaying ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                <span>{sirenPlaying ? 'Silence Siren' : 'Unmute Siren'}</span>
              </button>
            )}

            <button
              onClick={sosActive ? disarmSos : () => sound.playBeep(700, 0.05)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                sosActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {sosActive ? 'DISARM SOS BEACON' : 'SYSTEM READY'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Tactical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Big SOS Button & Countdown */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-6 shadow-sm text-center space-y-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 uppercase tracking-widest font-bold font-mono-code">
                PANIC DISTRESS DISPATCH
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pressing triggers a 5-second countdown before transmitting your GPS coordinates and sounding the audible beacon.
              </p>
            </div>

            {/* Countdown or Panic Button */}
            {countdown !== null ? (
              <div className="p-8 rounded-xl bg-rose-950/20 border-2 border-rose-500 space-y-4 animate-pulse">
                <div className="text-5xl font-black text-rose-500 tracking-wider font-mono-code">
                  0{countdown}
                </div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  BROADCASTING IN {countdown} SECONDS...
                </div>
                <button
                  onClick={cancelSosCountdown}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-700 shadow-lg cursor-pointer"
                >
                  CANCEL / FALSE ALARM
                </button>
              </div>
            ) : sosActive ? (
              <div className="p-8 rounded-xl bg-rose-600 text-white space-y-4 shadow-2xl">
                <AlertOctagon className="w-16 h-16 mx-auto animate-bounce" />
                <div className="text-xl font-bold uppercase tracking-wider">
                  DISTRESS BEACON BROADCASTING
                </div>
                <p className="text-xs text-rose-100">
                  GPS Coordinates pinned. Audio beacon pulsing at 960Hz. Emergency contacts notified.
                </p>
                <button
                  onClick={disarmSos}
                  className="px-6 py-2.5 rounded-lg bg-white text-rose-700 font-black text-xs uppercase tracking-wider hover:bg-rose-50 shadow-md transition cursor-pointer"
                >
                  SAFE / DISARM BEACON
                </button>
              </div>
            ) : (
              <div className="py-2 space-y-4">
                <button
                  onClick={initiateSosCountdown}
                  className="relative group p-10 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-black text-lg sm:text-xl uppercase tracking-widest shadow-xl hover:shadow-rose-900/40 transition transform active:scale-95 mx-auto flex flex-col items-center justify-center w-52 h-52 sm:w-60 sm:h-60 border-4 border-rose-400/40 cursor-pointer"
                  aria-label="Activate Emergency SOS Alert"
                >
                  <AlertOctagon className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform" />
                  <span>EMERGENCY</span>
                  <span className="text-xs tracking-normal font-bold opacity-90 mt-1">SOS PANIC</span>
                </button>

                {/* Secondary Help Shortcut for non-technical users */}
                <button
                  onClick={() => {
                    sound.playWarning();
                    setShowHelpModal(true);
                  }}
                  className="w-full max-w-sm mx-auto py-3 px-4 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center gap-2 border border-amber-300 dark:border-amber-700 transition cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Looking for simple contacts &amp; location sharing? Open Help</span>
                </button>
              </div>
            )}

            {/* Safety Protocols Guide */}
            <div className="text-left border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2">
              <div className="text-xs text-slate-500 uppercase font-bold flex items-center gap-1.5 font-mono-code">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span>RAPID CRISIS ACTION PROTOCOL</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">01. SEEK COVER</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Move to safe physical area.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">02. LOCK ACCESS</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Engage door locks &amp; barrier.</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-slate-100">03. MAINTAIN GPS</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Keep device screen powered.</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Real-Time GPS Tracking & Distress Payload */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* GPS Coordinates Card */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono-code">
                  Real-Time GPS Location Telemetry
                </h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                geoState.error ? 'text-amber-600 bg-amber-50 border-amber-300' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
              }`}>
                {geoState.error ? 'FALLBACK GRID' : 'LIVE GPS LOCK'}
              </span>
            </div>

            {/* GPS Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">LATITUDE</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 font-mono-code">
                  {geoState.latitude ? geoState.latitude.toFixed(6) : '37.774929'}° N
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">LONGITUDE</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 font-mono-code">
                  {geoState.longitude ? geoState.longitude.toFixed(6) : '-122.419416'}° W
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">ACCURACY</div>
                <div className="font-bold text-cyan-600 dark:text-cyan-400 text-xs mt-0.5 font-mono-code">
                  ±{geoState.accuracy ?? 10} meters
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">ALTITUDE</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 font-mono-code">
                  {geoState.altitude ?? 52} m MSL
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">HEADING</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 font-mono-code">
                  {geoState.heading ?? 184}° (S)
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-mono-code">VELOCITY</div>
                <div className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-0.5 font-mono-code">
                  {geoState.speed ?? 0} km/h
                </div>
              </div>
            </div>

            {/* Tactical Radar Display Representation */}
            <div className="relative h-28 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
              <div className="absolute w-24 h-24 rounded-full border border-cyan-500/20" />
              <div className="absolute w-16 h-16 rounded-full border border-cyan-500/30" />
              <div className="absolute w-8 h-8 rounded-full border border-cyan-500/40" />
              
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent animate-spin origin-center" />

              <div className="relative z-10 flex flex-col items-center">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <span className="text-[10px] text-cyan-300 font-bold mt-1 bg-black/60 px-1.5 rounded font-mono-code">
                  OPERATOR PINPOINT
                </span>
              </div>

              <div className="absolute bottom-2 left-2 text-[9px] text-cyan-400 font-mono-code">
                RANGE: 500M | GRID: WGS84
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <a
                href={`https://www.google.com/maps?q=${geoState.latitude ?? 37.7749},${geoState.longitude ?? -122.4194}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:underline flex items-center gap-1.5 text-xs font-semibold"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-500" />
                <span>Open in Satellite Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={handleCopyBeacon}
                className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-cyan-950 text-white dark:text-cyan-300 flex items-center gap-1.5 text-xs font-semibold border border-transparent dark:border-cyan-500/40 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedBeacon ? 'PAYLOAD COPIED' : 'COPY SOS PAYLOAD'}</span>
              </button>
            </div>
          </div>

          {/* Emergency Contacts Directory */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider font-mono-code">
                  Emergency Response Dispatch Line
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {onAddContact && (
                  <button
                    onClick={() => setShowAddContactModal(true)}
                    className="text-[10px] px-2 py-0.5 rounded bg-cyan-600 hover:bg-cyan-700 text-white font-bold cursor-pointer transition"
                  >
                    + Add
                  </button>
                )}
                <span className="text-[10px] text-slate-500 font-semibold font-mono-code">DIRECT COMMS</span>
              </div>
            </div>

            <div className="space-y-2">
              {emergencyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                      {contact.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {contact.role} · {contact.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    {onDeleteContact && emergencyContacts.length > 2 && (
                      <button
                        onClick={() => onDeleteContact(contact.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        title="Remove contact"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* HIGH-CONTRAST EMERGENCY HELP MODAL FOR NON-TECHNICAL USERS   */}
      {/* ============================================================ */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="emergency-help-title"
        >
          <div className={`w-full max-w-4xl my-auto rounded-2xl shadow-2xl overflow-hidden transition-colors ${
            contrastTheme === 'gold' 
              ? 'bg-black text-amber-300 border-4 border-amber-400' 
              : contrastTheme === 'yellow'
              ? 'bg-[#121200] text-yellow-300 border-4 border-yellow-400'
              : 'bg-neutral-950 text-white border-4 border-white'
          }`}>
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b-4 border-current bg-black/40 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`p-3 rounded-xl ${
                  contrastTheme === 'gold' ? 'bg-amber-400 text-black' : contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
                }`}>
                  <HelpCircle className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h2 id="emergency-help-title" className="text-xl sm:text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                    <span>EMERGENCY HELP &amp; ONE-TOUCH DIALLER</span>
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
                    Designed for non-technical users · 1-touch dialling · Instant location sharing instructions
                  </p>
                </div>
              </div>

              {/* Header Controls: Contrast Toggle & Close Button */}
              <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                <div className="hidden sm:flex items-center gap-1 bg-neutral-900 border-2 border-current px-2 py-1 rounded-lg text-xs font-bold">
                  <span className="opacity-70 text-[10px] mr-1">THEME:</span>
                  <button 
                    onClick={() => setContrastTheme('gold')}
                    className={`px-2 py-0.5 rounded font-black text-xs ${contrastTheme === 'gold' ? 'bg-amber-400 text-black' : 'hover:underline text-amber-300'}`}
                  >
                    Gold
                  </button>
                  <button 
                    onClick={() => setContrastTheme('yellow')}
                    className={`px-2 py-0.5 rounded font-black text-xs ${contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'hover:underline text-yellow-300'}`}
                  >
                    Yellow
                  </button>
                  <button 
                    onClick={() => setContrastTheme('white')}
                    className={`px-2 py-0.5 rounded font-black text-xs ${contrastTheme === 'white' ? 'bg-white text-black' : 'hover:underline text-white'}`}
                  >
                    White
                  </button>
                </div>

                <button
                  onClick={() => {
                    sound.playBeep(440, 0.05);
                    setShowHelpModal(false);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeakingLocation(false);
                    }
                  }}
                  className={`px-4 py-2 sm:py-2.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center gap-1.5 transition border-2 border-current cursor-pointer ${
                    contrastTheme === 'gold' 
                      ? 'bg-amber-400 hover:bg-amber-300 text-black' 
                      : contrastTheme === 'yellow'
                      ? 'bg-yellow-400 hover:bg-yellow-300 text-black'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                  aria-label="Close emergency help modal"
                >
                  <X className="w-5 h-5 stroke-[3]" />
                  <span>CLOSE (ESC)</span>
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs (High Contrast) */}
            <div className="grid grid-cols-3 border-b-3 border-current text-center font-black text-xs sm:text-sm uppercase tracking-wider bg-black/60">
              <button
                onClick={() => {
                  sound.playBeep(650, 0.04);
                  setActiveHelpTab('contacts');
                }}
                className={`py-3.5 px-2 flex items-center justify-center gap-2 border-r-3 border-current transition cursor-pointer ${
                  activeHelpTab === 'contacts'
                    ? (contrastTheme === 'gold' ? 'bg-amber-400 text-black' : contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white text-black')
                    : 'hover:bg-neutral-900 opacity-80'
                }`}
              >
                <PhoneCall className="w-4 h-4 stroke-[2.5]" />
                <span className="truncate">1. One-Touch Dialling</span>
              </button>

              <button
                onClick={() => {
                  sound.playBeep(650, 0.04);
                  setActiveHelpTab('location');
                }}
                className={`py-3.5 px-2 flex items-center justify-center gap-2 border-r-3 border-current transition cursor-pointer ${
                  activeHelpTab === 'location'
                    ? (contrastTheme === 'gold' ? 'bg-amber-400 text-black' : contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white text-black')
                    : 'hover:bg-neutral-900 opacity-80'
                }`}
              >
                <MapPin className="w-4 h-4 stroke-[2.5]" />
                <span className="truncate">2. Location Sharing</span>
              </button>

              <button
                onClick={() => {
                  sound.playBeep(650, 0.04);
                  setActiveHelpTab('script');
                }}
                className={`py-3.5 px-2 flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeHelpTab === 'script'
                    ? (contrastTheme === 'gold' ? 'bg-amber-400 text-black' : contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white text-black')
                    : 'hover:bg-neutral-900 opacity-80'
                }`}
              >
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                <span className="truncate">3. Dispatcher Script</span>
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-4 sm:p-6 sm:max-h-[70vh] overflow-y-auto space-y-6">

              {/* TAB 1: ONE-TOUCH EMERGENCY CALLING */}
              {activeHelpTab === 'contacts' && (
                <div className="space-y-6">
                  
                  {/* Top Notice */}
                  <div className="p-4 rounded-xl border-2 border-current bg-neutral-950/80 flex items-start gap-3">
                    <Shield className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-wide">
                        One-Touch Calling: Tap Any Green or Red Button to Dial Instantly
                      </h4>
                      <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                        If you are in immediate personal physical danger, tap the 911 button below first. Your phone will dial right away.
                      </p>
                    </div>
                  </div>

                  {/* 911 Priority Button */}
                  <div className="p-5 sm:p-6 rounded-2xl border-4 border-rose-500 bg-rose-950/40 text-rose-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                    <div className="space-y-1 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          LIFE SAFETY FIRST
                        </span>
                        <span className="font-black text-xl sm:text-2xl tracking-tight text-white">
                          DIAL 911 (POLICE / FIRE / AMBULANCE)
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-rose-200">
                        Immediate public emergency service dispatch. Free and works even on locked phones or low signal.
                      </p>
                    </div>

                    <a
                      href="tel:911"
                      className="w-full md:w-auto px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black text-lg uppercase tracking-wider shadow-2xl flex items-center justify-center gap-3 transition-transform border-2 border-white cursor-pointer"
                    >
                      <PhoneCall className="w-6 h-6 animate-bounce" />
                      <span>TAP TO CALL 911</span>
                    </a>
                  </div>

                  {/* Organization & SOC Emergency Contacts */}
                  <div className="space-y-3">
                    <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Security Operations &amp; Assigned Emergency Contacts</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {emergencyContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="p-4 sm:p-5 rounded-xl border-2 border-current bg-black/60 flex flex-col justify-between gap-3 shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-black text-base sm:text-lg tracking-tight">
                                {contact.name}
                              </span>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase border border-current">
                                Priority {contact.priority}
                              </span>
                            </div>
                            <div className="text-xs opacity-80 mt-0.5">
                              {contact.role}
                            </div>
                            <div className="text-sm font-mono-code font-bold mt-2">
                              {contact.phone}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-current/40">
                            {/* Tap to call */}
                            <a
                              href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                              className="flex-1 py-3 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                            >
                              <PhoneCall className="w-4 h-4" />
                              <span>CALL NOW</span>
                            </a>

                            {/* Tap to text location */}
                            <a
                              href={getSmsLink(contact.phone)}
                              className="py-3 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition border border-current cursor-pointer"
                              title="Send SMS with your current coordinates"
                            >
                              <MessageSquare className="w-4 h-4 text-amber-300" />
                              <span>TEXT GPS</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Number Quick Dial */}
                  <div className="p-4 rounded-xl border-2 border-current bg-black/50 space-y-3">
                    <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider">
                      Need to call a supervisor, coworker, or family member directly?
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <input
                        type="tel"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="Enter phone number (e.g. 555-0199)"
                        className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-black text-white border-2 border-current font-mono-code text-sm placeholder:opacity-50 focus:outline-none"
                      />
                      <a
                        href={customPhone ? `tel:${customPhone.replace(/[^0-9+]/g, '')}` : '#'}
                        onClick={(e) => {
                          if (!customPhone) {
                            e.preventDefault();
                            notificationService.send('Enter Number', 'Please enter a phone number to dial.');
                          }
                        }}
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                          customPhone
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>DIAL NUMBER</span>
                      </a>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: STEP-BY-STEP LOCATION SHARING FOR NON-TECHNICAL USERS */}
              {activeHelpTab === 'location' && (
                <div className="space-y-6">
                  
                  {/* Current Coordinates Card (High-Contrast Visual) */}
                  <div className="p-5 sm:p-6 rounded-2xl border-3 border-current bg-neutral-950 text-center space-y-4 shadow-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black border-2 border-current text-xs font-black uppercase">
                      <MapPin className="w-4 h-4 animate-bounce" />
                      <span>YOUR EXACT LOCATION RIGHT NOW</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                      <div className="p-3.5 rounded-xl bg-black border-2 border-current">
                        <div className="text-xs uppercase font-extrabold opacity-75">LATITUDE</div>
                        <div className="text-xl sm:text-2xl font-black font-mono-code tracking-wider mt-1">
                          {geoState.latitude ? geoState.latitude.toFixed(6) : '37.774929'}° N
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-black border-2 border-current">
                        <div className="text-xs uppercase font-extrabold opacity-75">LONGITUDE</div>
                        <div className="text-xl sm:text-2xl font-black font-mono-code tracking-wider mt-1">
                          {geoState.longitude ? geoState.longitude.toFixed(6) : '-122.419416'}° W
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold pt-1">
                      <span className="px-3 py-1 rounded-full bg-neutral-900 border border-current">
                        ACCURACY: ±{geoState.accuracy ?? 10} METERS (HIGH LOCK)
                      </span>
                      <span className="px-3 py-1 rounded-full bg-neutral-900 border border-current">
                        STATUS: {geoState.error ? 'FALLBACK BASE STATION' : 'LIVE SATELLITE GPS ACTIVE'}
                      </span>
                    </div>

                    {/* Speech Synthesis Voice Helper */}
                    <div className="pt-2">
                      <button
                        onClick={speakLocationText}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider inline-flex items-center gap-2 transition border-2 border-current cursor-pointer ${
                          isSpeakingLocation 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'bg-black hover:bg-neutral-900 text-current'
                        }`}
                      >
                        <Volume1 className="w-4 h-4" />
                        <span>{isSpeakingLocation ? 'STOP READING ALOUD' : '🔊 READ MY LOCATION OUT LOUD'}</span>
                      </button>
                      <p className="text-[11px] opacity-75 mt-1">
                        Listen to your coordinates if you cannot read the screen during a phone call.
                      </p>
                    </div>
                  </div>

                  {/* 3 Step Plain English Sharing Instructions */}
                  <div className="space-y-4">
                    <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>How to share your location in 3 easy steps (Non-Technical):</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Step 1 */}
                      <div className="p-4 rounded-xl border-2 border-current bg-black/50 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-current text-black flex items-center justify-center font-black text-sm">
                          1
                        </div>
                        <h4 className="font-extrabold text-sm uppercase">Copy GPS &amp; Maps Link</h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                          Tap the button below. It copies your coordinates and a Google Maps pin so you can paste it into any text message or email.
                        </p>
                        <button
                          onClick={handleCopyLocation}
                          className="w-full mt-2 py-2.5 px-3 rounded-lg bg-current text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                        >
                          {copiedLocation ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copiedLocation ? 'COPIED TO CLIPBOARD!' : 'COPY LOCATION LINK'}</span>
                        </button>
                      </div>

                      {/* Step 2 */}
                      <div className="p-4 rounded-xl border-2 border-current bg-black/50 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-current text-black flex items-center justify-center font-black text-sm">
                          2
                        </div>
                        <h4 className="font-extrabold text-sm uppercase">Send SMS Text Alert</h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                          Opens your phone's SMS messaging app with your location and coordinates automatically pre-filled. Just pick a contact and send.
                        </p>
                        <a
                          href={getSmsLink()}
                          className="w-full mt-2 py-2.5 px-3 rounded-lg bg-current text-black font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>OPEN SMS TEXT MESSAGE</span>
                        </a>
                      </div>

                      {/* Step 3 */}
                      <div className="p-4 rounded-xl border-2 border-current bg-black/50 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-current text-black flex items-center justify-center font-black text-sm">
                          3
                        </div>
                        <h4 className="font-extrabold text-sm uppercase">Share via WhatsApp / App</h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                          Share your emergency location through WhatsApp or use your phone's native share menu to send to friends or family.
                        </p>
                        <div className="flex flex-col gap-1.5 mt-2">
                          <a
                            href={getWhatsAppLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <span>SEND VIA WHATSAPP</span>
                          </a>
                          <button
                            onClick={handleShareLocationNative}
                            className="w-full py-2 px-3 rounded-lg border border-current text-current font-bold text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-900 transition cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>MORE SHARE OPTIONS</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Safety Guidance Box */}
                  <div className="p-4 rounded-xl border-2 border-current bg-neutral-950 space-y-2">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Trouble with location or low GPS signal?</span>
                    </h4>
                    <ul className="text-xs space-y-1.5 opacity-90 list-disc list-inside">
                      <li><strong>Step near a window or outdoors:</strong> GPS satellite signals cannot penetrate deep metal basements or elevator shafts.</li>
                      <li><strong>Look around for street signs or landmarks:</strong> Note nearby cross streets, store names, or building numbers to tell the 911 dispatcher.</li>
                      <li><strong>Keep this screen active:</strong> Leaving the CyberShield app open allows your device to continuously refine your GPS position.</li>
                    </ul>
                  </div>

                </div>
              )}

              {/* TAB 3: DISPATCHER SCRIPT FOR STRESSED USERS */}
              {activeHelpTab === 'script' && (
                <div className="space-y-6">
                  
                  <div className="p-4 rounded-xl border-2 border-current bg-neutral-950/80">
                    <h4 className="font-black text-sm uppercase">
                      Read This Script Word-for-Word to the 911 Operator:
                    </h4>
                    <p className="text-xs opacity-85 mt-0.5">
                      In high-stress situations, reading a prepared script prevents forgetting critical location details.
                    </p>
                  </div>

                  {/* Script Box */}
                  <div className="p-5 sm:p-6 rounded-2xl border-4 border-current bg-black space-y-4">
                    <div className="text-sm sm:text-base font-bold leading-relaxed space-y-3 font-sans">
                      <p className="p-3 rounded-lg bg-neutral-900 border border-current">
                        "Hello, I am reporting an emergency and I need assistance sent immediately."
                      </p>
                      
                      <p className="p-3 rounded-lg bg-neutral-900 border border-current">
                        "My exact GPS coordinates are: <span className="font-black underline font-mono-code text-base sm:text-lg">Latitude {geoState.latitude ? geoState.latitude.toFixed(5) : '37.77493'}</span> and <span className="font-black underline font-mono-code text-base sm:text-lg">Longitude {geoState.longitude ? geoState.longitude.toFixed(5) : '-122.41942'}</span>."
                      </p>

                      <p className="p-3 rounded-lg bg-neutral-900 border border-current">
                        "My device has a high accuracy satellite lock within ±{geoState.accuracy ?? 10} meters."
                      </p>

                      <p className="p-3 rounded-lg bg-neutral-900 border border-current">
                        "My identity callsign is <span className="font-black">{operator.callsign}</span>, badge number <span className="font-mono-code">{operator.badgeNumber}</span>."
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleCopyScript}
                        className="py-3 px-5 rounded-xl bg-current text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer active:scale-95"
                      >
                        {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedScript ? 'SCRIPT COPIED TO CLIPBOARD!' : 'COPY FULL SCRIPT'}</span>
                      </button>

                      <button
                        onClick={speakLocationText}
                        className="py-3 px-5 rounded-xl border-2 border-current text-current hover:bg-neutral-900 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
                      >
                        <Volume1 className="w-4 h-4" />
                        <span>{isSpeakingLocation ? 'STOP AUDIO' : 'READ SCRIPT AUDIO'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Operator Tips Checklist */}
                  <div className="p-4 rounded-xl border-2 border-current bg-neutral-950 space-y-2">
                    <h4 className="font-extrabold text-xs uppercase tracking-wider">
                      Important Rules While On the Line:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-black border border-current/60 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span><strong>Do not hang up:</strong> Stay on the line until the dispatcher confirms help has arrived or instructs you to hang up.</span>
                      </div>
                      <div className="p-2.5 rounded bg-black border border-current/60 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span><strong>Answer all questions:</strong> Dispatchers will ask if weapons, injuries, or hazards are present. Answer as calmly as possible.</span>
                      </div>
                      <div className="p-2.5 rounded bg-black border border-current/60 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span><strong>Put phone on speaker:</strong> If your hands need to be free to administer first aid or secure doors, turn on speakerphone.</span>
                      </div>
                      <div className="p-2.5 rounded bg-black border border-current/60 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                        <span><strong>Make yourself visible:</strong> If safe, turn on exterior lights or have a flashlight ready so first responders can find you quickly.</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer with quick actions */}
            <div className="p-4 border-t-4 border-current bg-black/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>One-touch dialling active · GPS locked</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLocation}
                  className="px-4 py-2 rounded-lg border-2 border-current hover:bg-neutral-900 font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLocation ? 'COPIED' : 'COPY GPS PIN'}</span>
                </button>

                <button
                  onClick={() => {
                    sound.playBeep(440, 0.05);
                    setShowHelpModal(false);
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                      setIsSpeakingLocation(false);
                    }
                  }}
                  className={`px-5 py-2 rounded-lg font-black uppercase tracking-wider transition cursor-pointer ${
                    contrastTheme === 'gold' ? 'bg-amber-400 text-black' : contrastTheme === 'yellow' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
                  }`}
                >
                  DONE
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Add Personal Emergency Contact */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs font-sans">
          <div className="w-full max-w-sm bg-white dark:bg-[#141822] text-slate-900 dark:text-white rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold">
                Add Emergency Contact
              </h3>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newContactName || !newContactPhone) return;
                if (onAddContact) {
                  onAddContact({
                    id: `ec-${Date.now()}`,
                    name: newContactName,
                    role: newContactRole || 'Emergency Contact',
                    phone: newContactPhone,
                    priority: emergencyContacts.length + 1,
                  });
                  sound.playSuccess();
                  notificationService.send('Contact Added', `Saved emergency contact ${newContactName}.`);
                }
                setShowAddContactModal(false);
                setNewContactName('');
                setNewContactRole('');
                setNewContactPhone('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  required
                  value={newContactName}
                  onChange={e => setNewContactName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins (Director) or Family"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Role / Description
                </label>
                <input
                  type="text"
                  value={newContactRole}
                  onChange={e => setNewContactRole(e.target.value)}
                  placeholder="e.g. IT Incident Lead, Manager, Family"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={newContactPhone}
                  onChange={e => setNewContactPhone(e.target.value)}
                  placeholder="e.g. +1 (800) 555-0199"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
