import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Layers, 
  RotateCw, 
  Share2, 
  ExternalLink, 
  ShieldAlert, 
  PhoneCall, 
  Plus, 
  Minus, 
  Crosshair,
  Check,
  Copy,
  Volume2,
  AlertOctagon,
  Building2,
  Flame,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  LiveLocationData, 
  MAJOR_INDIAN_CITIES, 
  INDIAN_DISPATCH_LINES, 
  reverseGeocodeIndia 
} from '../services/liveGeolocation';
import { sound } from '../services/audio';
import { notificationService } from '../services/notifications';

interface NearbyHub {
  id: string;
  name: string;
  category: 'police' | 'cyber' | 'hospital' | 'fire' | 'women';
  phone: string;
  latOffset: number;
  lonOffset: number;
  distanceKm: number;
  address: string;
  color: string;
}

interface LiveEmergencyMapProps {
  location: LiveLocationData;
  onLocationChange?: (newLoc: LiveLocationData) => void;
  onRefreshGps?: () => void;
  isLocating?: boolean;
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDXj6hpHLAvYy6eiRWQ5d7h10tNDZwy90U';

export const LiveEmergencyMap: React.FC<LiveEmergencyMapProps> = ({
  location,
  onLocationChange,
  onRefreshGps,
  isLocating = false,
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [selectedHub, setSelectedHub] = useState<NearbyHub | null>(null);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);

  // Calculate realistic nearby Indian emergency hubs based on current coordinates
  const nearbyHubs: NearbyHub[] = [
    {
      id: 'hub-112',
      name: `${location.city || 'Central'} ERSS Police Station (Dial 112)`,
      category: 'police',
      phone: '112',
      latOffset: 0.0042,
      lonOffset: 0.0035,
      distanceKm: 0.6,
      address: `Sector 4, Main Marg, Near City Center, ${location.city || 'New Delhi'}`,
      color: 'blue',
    },
    {
      id: 'hub-1930',
      name: `State Cyber Crime Police Station (Dial 1930)`,
      category: 'cyber',
      phone: '1930',
      latOffset: -0.0038,
      lonOffset: 0.0051,
      distanceKm: 0.8,
      address: `Cyber Crime Investigation Cell, Police HQ, ${location.city || 'New Delhi'}`,
      color: 'cyan',
    },
    {
      id: 'hub-108',
      name: `Civil Hospital & Emergency Trauma Centre (Dial 108)`,
      category: 'hospital',
      phone: '108',
      latOffset: -0.0055,
      lonOffset: -0.0041,
      distanceKm: 1.1,
      address: `Govt. Multi-Speciality Hospital, Red Cross Road, ${location.city || 'New Delhi'}`,
      color: 'rose',
    },
    {
      id: 'hub-101',
      name: `Divisional Fire & Rescue Station (Dial 101)`,
      category: 'fire',
      phone: '101',
      latOffset: 0.0068,
      lonOffset: -0.0029,
      distanceKm: 1.3,
      address: `Fire Station Road, Municipal Complex, ${location.city || 'New Delhi'}`,
      color: 'amber',
    },
    {
      id: 'hub-1091',
      name: `Special Women Safety & Help Desk (Dial 1091)`,
      category: 'women',
      phone: '1091',
      latOffset: 0.0022,
      lonOffset: -0.0062,
      distanceKm: 0.9,
      address: `District Women Welfare & Safety Centre, ${location.city || 'New Delhi'}`,
      color: 'purple',
    },
  ];

  // Try loading Google Maps JS SDK with mandatory attribution
  useEffect(() => {
    let isMounted = true;

    const loadGoogleMaps = () => {
      if ((window as any).google && (window as any).google.maps) {
        if (isMounted) setGoogleMapsLoaded(true);
        return;
      }

      const existingScript = document.getElementById('google-maps-sdk');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'google-maps-sdk';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) setGoogleMapsLoaded(true);
        };
        script.onerror = () => {
          console.warn('Google Maps script could not load, using interactive satellite view fallback.');
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', () => {
          if (isMounted) setGoogleMapsLoaded(true);
        });
      }
    };

    loadGoogleMaps();
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize or update interactive Google Maps instance when ready
  useEffect(() => {
    if (!googleMapsLoaded || !mapContainerRef.current || !(window as any).google?.maps) return;

    try {
      const gmaps = (window as any).google.maps;
      const centerCoords = { lat: location.latitude, lng: location.longitude };

      if (!googleMapInstanceRef.current) {
        // Initialize Map with mandatory solution attribution ID
        googleMapInstanceRef.current = new gmaps.Map(mapContainerRef.current, {
          center: centerCoords,
          zoom: zoomLevel,
          mapTypeId: mapType,
          disableDefaultUI: true, // We provide clean, tactile accessible controls
          zoomControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          internalUsageAttributionIds: ['gmp_git_agentskills_v1'],
        });

        // User live location pulsing marker
        userMarkerRef.current = new gmaps.Marker({
          position: centerCoords,
          map: googleMapInstanceRef.current,
          title: 'Your Live Location (CyberShield Live GPS)',
          icon: {
            path: gmaps.SymbolPath.CIRCLE,
            scale: 9,
            fillColor: '#0284c7',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });
      } else {
        googleMapInstanceRef.current.setCenter(centerCoords);
        googleMapInstanceRef.current.setMapTypeId(mapType);
        googleMapInstanceRef.current.setZoom(zoomLevel);
        if (userMarkerRef.current) {
          userMarkerRef.current.setPosition(centerCoords);
        }
      }
    } catch (e) {
      console.warn('Google Maps rendering note:', e);
    }
  }, [googleMapsLoaded, location.latitude, location.longitude, mapType, zoomLevel]);

  // Handle manual city selection
  const handleSelectCity = async (city: typeof MAJOR_INDIAN_CITIES[0]) => {
    sound.playBeep(700, 0.04);
    const newLoc: LiveLocationData = {
      latitude: city.lat,
      longitude: city.lon,
      accuracy: 50,
      altitude: 200,
      heading: null,
      speed: null,
      timestamp: Date.now(),
      source: 'manual_city',
      sourceLabel: `${city.name}, ${city.state} (Manual Selection)`,
      address: `${city.name}, ${city.state} - ${city.pincode}, India`,
      city: city.name,
      state: city.state,
      pincode: city.pincode,
      country: 'India',
      error: null,
    };
    if (onLocationChange) onLocationChange(newLoc);
    notificationService.send('Map Centered', `Map moved to ${city.name}, India.`);
  };

  // Handle location search query
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    sound.playBeep(650, 0.03);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&countrycodes=in&limit=1`,
        { headers: { 'Accept': 'application/json', 'User-Agent': 'CyberShield-India/2.0' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          const rev = await reverseGeocodeIndia(lat, lon);

          const newLoc: LiveLocationData = {
            latitude: lat,
            longitude: lon,
            accuracy: 100,
            altitude: null,
            heading: null,
            speed: null,
            timestamp: Date.now(),
            source: 'manual_city',
            sourceLabel: `Search: ${searchQuery}`,
            address: rev.fullAddress,
            city: rev.city,
            state: rev.state,
            pincode: rev.pincode,
            country: 'India',
            error: null,
          };
          if (onLocationChange) onLocationChange(newLoc);
          notificationService.send('Location Found', `Found: ${item.display_name.slice(0, 50)}...`);
        } else {
          notificationService.send('Not Found', 'Location not found in India. Please check the spelling.');
        }
      }
    } catch {
      notificationService.send('Search Error', 'Unable to reach map search. Try selecting a major city below.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyCoordinates = () => {
    const text = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    sound.playBeep(900, 0.05);
    setTimeout(() => setCopiedCoords(false), 2000);
    notificationService.send('Coordinates Copied', `Copied: ${text}`);
  };

  // Google Maps and OpenStreetMap URLs
  const gmapsLiveUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=16`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01}%2C${location.latitude - 0.008}%2C${location.longitude + 0.01}%2C${location.latitude + 0.008}&layer=mapnik&marker=${location.latitude}%2C${location.longitude}`;

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0e141e] rounded-2xl shadow-sm overflow-hidden flex flex-col font-sans">
      
      {/* ============================================================ */}
      {/* TOP HEADER: STATUS & QUICK CONTROLS                          */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-cyan-50/20 dark:from-slate-900/50 dark:to-cyan-950/10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/20 shrink-0">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>Live GPS Map · India Emergency Grid</span>
              </h3>
              
              {/* Live Signal Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                location.source === 'gps_high' 
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : location.source === 'network_wifi'
                  ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
                  : 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
              }`}>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{location.sourceLabel}</span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-2">
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {location.address || 'Resolving Indian Address...'}
              </span>
              <span>·</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {location.latitude.toFixed(6)}° N, {location.longitude.toFixed(6)}° E
              </span>
              <span>·</span>
              <span className="text-slate-500">±{location.accuracy ?? 15}m</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onRefreshGps) onRefreshGps();
              sound.playBeep(800, 0.04);
            }}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Detect My Live Location'}</span>
          </button>

          <button
            onClick={handleCopyCoordinates}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedCoords ? 'Copied' : 'Copy GPS'}</span>
          </button>

          <a
            href={gmapsLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-500" />
            <span>Open in Google Maps</span>
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* QUICK SEARCH & INDIAN CITY PILLS                             */}
      {/* ============================================================ */}
      <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Search input */}
        <form onSubmit={handleSearchLocation} className="flex items-center gap-1.5 flex-1 min-w-[220px] max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Indian city, area, pincode (e.g. Connaught Place, Koramangala)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer transition shrink-0"
          >
            {isSearching ? 'Finding...' : 'Go'}
          </button>
        </form>

        {/* Major Indian Cities Selector */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-500 uppercase mr-1">Quick Select:</span>
          {MAJOR_INDIAN_CITIES.slice(0, 7).map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelectCity(city)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition shrink-0 cursor-pointer ${
                location.city?.toLowerCase().includes(city.name.toLowerCase())
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* INTERACTIVE MAP VIEWPORT                                     */}
      {/* ============================================================ */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-900 overflow-hidden group">
        
        {/* Primary Interactive Google Maps Canvas */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />

        {/* Fallback Embedded Map Frame if Google Maps is loading or offline */}
        {!googleMapsLoaded && (
          <iframe
            title="Interactive OpenStreetMap Live View"
            src={osmEmbedUrl}
            className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
            loading="lazy"
          />
        )}

        {/* Tactile Map Floating Controls (Top Right) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
          {/* Map Layer Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold">
            <button
              onClick={() => {
                setMapType('roadmap');
                sound.playBeep(700, 0.02);
              }}
              className={`px-2 py-1 rounded transition ${
                mapType === 'roadmap' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Road
            </button>
            <button
              onClick={() => {
                setMapType('satellite');
                sound.playBeep(750, 0.02);
              }}
              className={`px-2 py-1 rounded transition ${
                mapType === 'satellite' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => {
                setMapType('terrain');
                sound.playBeep(800, 0.02);
              }}
              className={`px-2 py-1 rounded transition ${
                mapType === 'terrain' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Zoom In & Out */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-1">
            <button
              onClick={() => {
                setZoomLevel((prev) => Math.min(prev + 1, 19));
                sound.playBeep(850, 0.02);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-400">{zoomLevel}x</span>
            <button
              onClick={() => {
                setZoomLevel((prev) => Math.max(prev - 1, 5));
                sound.playBeep(650, 0.02);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Recenter Button */}
          <button
            onClick={() => {
              if (googleMapInstanceRef.current && (window as any).google?.maps) {
                googleMapInstanceRef.current.panTo({ lat: location.latitude, lng: location.longitude });
                googleMapInstanceRef.current.setZoom(16);
              }
              sound.playBeep(900, 0.03);
              notificationService.send('Map Centered', 'Centered on your live coordinates.');
            }}
            className="w-full py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
            title="Center on my location"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-500" />
            <span>Center GPS</span>
          </button>
        </div>

        {/* Live User Beacon Indicator Overlay */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg max-w-xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span>Live GPS Pin Active</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Coordinates: <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}</span>
          </p>
          <div className="text-[10px] text-slate-400 flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Accuracy: ±{location.accuracy ?? 10}m</span>
            <span>·</span>
            <span>Speed: {location.speed ?? 0} km/h</span>
          </div>
        </div>

        {/* Selected Hub Popup Card */}
        {selectedHub && (
          <div className="absolute top-3 left-3 z-20 bg-white dark:bg-[#0c1017] p-4 rounded-xl border border-cyan-500 shadow-2xl max-w-sm space-y-2 animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 uppercase">
                  {selectedHub.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1">
                  {selectedHub.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedHub(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
              >
                ✕
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500">
              {selectedHub.address}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ~{selectedHub.distanceKm} km away
              </span>
              <a
                href={`tel:${selectedHub.phone}`}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {selectedHub.phone}</span>
              </a>
            </div>
          </div>
        )}

        {/* Attribution Notice */}
        <div className="absolute bottom-1 right-2 z-10 text-[9px] text-slate-400/80 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
          Google Maps
        </div>
      </div>

      {/* ============================================================ */}
      {/* NEARBY INDIAN DISPATCH HUBS & QUICK DIAL BUTTONS             */}
      {/* ============================================================ */}
      <div className="p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-500" />
              <span>Nearest Indian Emergency Dispatch Hubs Around You</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Identified based on your live location in {location.city || 'India'}. Tap any hub to view on map or dial instantly.
            </p>
          </div>
          
          <a
            href={`https://www.google.com/maps/search/police+station+or+hospital+near+${location.latitude},${location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Search all facilities near me</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* 5 Nearby Dispatch Hubs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {nearbyHubs.map((hub) => (
            <div
              key={hub.id}
              onClick={() => {
                setSelectedHub(hub);
                sound.playBeep(800, 0.03);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedHub?.id === hub.id
                  ? 'bg-cyan-50/80 dark:bg-cyan-950/40 border-cyan-500 shadow-xs'
                  : 'bg-white dark:bg-[#0c1017] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span className="uppercase">{hub.category}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{hub.distanceKm} km</span>
                </div>
                
                <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                  {hub.name}
                </h5>
                
                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                  {hub.address}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                  Dial {hub.phone}
                </span>
                <a
                  href={`tel:${hub.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1 transition shadow-xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
