import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  Trophy, Play, Plus, RefreshCw, Volume2, VolumeX, FastForward,
  Award, Shield, UserCheck, DollarSign, Calendar, MapPin, Gauge,
  Zap, ChevronRight, ChevronLeft, Save, Download, Upload, Trash2,
  CheckCircle, AlertTriangle, User, Settings, BarChart2, Radio,
  Flag, Disc, Activity, Layers, PlayCircle, Eye, ArrowUpRight, Music,
  Menu, X
} from 'lucide-react';

// ==========================================
// 1. WEB AUDIO SYNTHESIZER (NO EXTERNAL AUDIO FILES REQUIRED)
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgMusicPlaying = false;
    this.musicTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.bgMusicPlaying) {
      this.stopF1Theme();
    }
    return this.muted;
  }

  // Official F1® Retro Synthwave Track (Synth Brass Lead, 80s Synth Arp & Punchy Bassline)
  playF1Theme() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.bgMusicPlaying) this.stopF1Theme();

    this.bgMusicPlaying = true;

    // High energy F1 Symphonic Synth Theme (Driving Bass, Brass Lead, High Octane Racing Fanfare)
    const motorsportThemeTrack = [
      // Section A: High-Octane Intro & Main Engine Motif
      { f: 220.00, d: 0.16, type: 'sawtooth' }, // A3
      { f: 261.63, d: 0.16, type: 'sawtooth' }, // C4
      { f: 293.66, d: 0.16, type: 'sawtooth' }, // D4
      { f: 329.63, d: 0.28, type: 'square' },   // E4 (Brass Horn Lead)
      { f: 293.66, d: 0.16, type: 'sawtooth' }, // D4
      { f: 261.63, d: 0.28, type: 'sawtooth' }, // C4
      { f: 220.00, d: 0.32, type: 'sawtooth' }, // A3

      // Section B: Formula 1 Main Broadcast Fanfare
      { f: 440.00, d: 0.22, type: 'square' },   // A4
      { f: 392.00, d: 0.18, type: 'sawtooth' }, // G4
      { f: 349.23, d: 0.22, type: 'square' },   // F4
      { f: 329.63, d: 0.25, type: 'sawtooth' }, // E4
      { f: 440.00, d: 0.38, type: 'square' },   // A4 (Climax Crest)
      { f: 493.88, d: 0.25, type: 'sawtooth' }, // B4
      { f: 523.25, d: 0.42, type: 'square' },   // C5

      // Section C: Driving Race Pace Arpeggio
      { f: 293.66, d: 0.16, type: 'sawtooth' }, // D4
      { f: 329.63, d: 0.16, type: 'sawtooth' }, // E4
      { f: 349.23, d: 0.20, type: 'square' },   // F4
      { f: 440.00, d: 0.24, type: 'sawtooth' }, // A4
      { f: 392.00, d: 0.24, type: 'sawtooth' }, // G4
      { f: 349.23, d: 0.28, type: 'square' },   // F4
      { f: 329.63, d: 0.48, type: 'sawtooth' }, // E4
    ];

    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.bgMusicPlaying || this.muted) return;

      const note = motorsportThemeTrack[noteIdx];
      const now = this.ctx.currentTime;

      // Primary Synth Lead Wave
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = note.type || 'square';
      osc.frequency.setValueAtTime(note.f, now);

      // Low pass filter for authentic motorsport broadcast synth warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + note.d);

      // Deep Punchy Racing Sub-Bass Synth
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(note.f / 2, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + note.d);

      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);

      osc.start(now);
      bass.start(now);
      osc.stop(now + note.d);
      bass.stop(now + note.d);

      noteIdx = (noteIdx + 1) % motorsportThemeTrack.length;
      this.musicTimer = setTimeout(playNextNote, note.d * 1000 + 20);
    };

    playNextNote();
  }

  stopF1Theme() {
    this.bgMusicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playBid() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playGavel() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playEngineRev() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 0.4);
    osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.8);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  playBeep(high = false) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(high ? 880 : 440, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
}

const audioFX = new SoundFX();

// ==========================================
// 2. BUNDLED LOCAL F1 DATASETS
// ==========================================
const DRIVERS_DB = [
  { id: 'd1', name: 'Max Verstappen', nat: 'NLD', titles: 4, wins: 62, pod: 111, rating: 97, pace: 98, wet: 97, tyre: 94, rel: 95, era: 'Modern', photo: '🏎️' },
  { id: 'd2', name: 'Lewis Hamilton', nat: 'GBR', titles: 7, wins: 105, pod: 201, rating: 96, pace: 96, wet: 98, tyre: 96, rel: 96, era: 'Modern', photo: '👑' },
  { id: 'd3', name: 'Michael Schumacher', nat: 'DEU', titles: 7, wins: 91, pod: 155, rating: 98, pace: 98, wet: 99, tyre: 95, rel: 94, era: 'Historical', photo: '🏆' },
  { id: 'd4', name: 'Ayrton Senna', nat: 'BRA', titles: 3, wins: 41, pod: 80, rating: 97, pace: 99, wet: 99, tyre: 89, rel: 90, era: 'Historical', photo: '⚡' },
  { id: 'd5', name: 'Fernando Alonso', nat: 'ESP', titles: 2, wins: 32, pod: 106, rating: 94, pace: 94, wet: 95, tyre: 97, rel: 95, era: 'Modern', photo: '🛡️' },
  { id: 'd6', name: 'Charles Leclerc', nat: 'MCO', titles: 0, wins: 8, pod: 42, rating: 92, pace: 96, wet: 89, tyre: 90, rel: 91, era: 'Modern', photo: '🇲🇨' },
  { id: 'd7', name: 'Lando Norris', nat: 'GBR', titles: 0, wins: 4, pod: 26, rating: 91, pace: 93, wet: 91, tyre: 92, rel: 93, era: 'Modern', photo: '🚀' },
  { id: 'd8', name: 'Oscar Piastri', nat: 'AUS', titles: 0, wins: 2, pod: 10, rating: 89, pace: 90, wet: 88, tyre: 91, rel: 94, era: 'Modern', photo: '🦘' },
  { id: 'd9', name: 'Sebastian Vettel', nat: 'DEU', titles: 4, wins: 53, pod: 122, rating: 93, pace: 94, wet: 92, tyre: 93, rel: 92, era: 'Historical', photo: '🌟' },
  { id: 'd10', name: 'Alain Prost', nat: 'FRA', titles: 4, wins: 51, pod: 106, rating: 96, pace: 95, wet: 91, tyre: 99, rel: 97, era: 'Historical', photo: '🧠' },
  { id: 'd11', name: 'Niki Lauda', nat: 'AUT', titles: 3, wins: 25, pod: 54, rating: 94, pace: 93, wet: 90, tyre: 95, rel: 96, era: 'Historical', photo: '🔥' },
  { id: 'd12', name: 'Jim Clark', nat: 'GBR', titles: 2, wins: 25, pod: 32, rating: 97, pace: 99, wet: 96, tyre: 94, rel: 88, era: 'Historical', photo: '🍀' },
  { id: 'd13', name: 'Juan Manuel Fangio', nat: 'ARG', titles: 5, wins: 24, pod: 35, rating: 98, pace: 97, wet: 95, tyre: 96, rel: 92, era: 'Historical', photo: '🥇' },
  { id: 'd14', name: 'Kimi Räikkönen', nat: 'FIN', titles: 1, wins: 21, pod: 103, rating: 91, pace: 95, wet: 89, tyre: 91, rel: 90, era: 'Historical', photo: '🧊' },
  { id: 'd15', name: 'Mika Häkkinen', nat: 'FIN', titles: 2, wins: 20, pod: 51, rating: 93, pace: 96, wet: 90, tyre: 90, rel: 91, era: 'Historical', photo: '🇫🇮' },
  { id: 'd16', name: 'Kimi Antonelli', nat: 'ITA', titles: 0, wins: 0, pod: 0, rating: 83, pace: 86, wet: 82, tyre: 81, rel: 85, era: '2026', photo: '🇮🇹' },
  { id: 'd17', name: 'George Russell', nat: 'GBR', titles: 0, wins: 2, pod: 14, rating: 89, pace: 92, wet: 90, tyre: 88, rel: 91, era: 'Modern', photo: '🇬🇧' },
  { id: 'd18', name: 'Carlos Sainz', nat: 'ESP', titles: 0, wins: 4, pod: 25, rating: 89, pace: 89, wet: 90, tyre: 91, rel: 93, era: 'Modern', photo: '🌶️' },
  { id: 'd19', name: 'Nico Rosberg', nat: 'DEU', titles: 1, wins: 23, pod: 57, rating: 90, pace: 92, wet: 87, tyre: 89, rel: 93, era: 'Historical', photo: '🇩🇪' },
  { id: 'd20', name: 'Nigel Mansell', nat: 'GBR', titles: 1, wins: 31, pod: 59, rating: 92, pace: 95, wet: 91, tyre: 86, rel: 84, era: 'Historical', photo: '🥸' },
  { id: 'd21', name: 'Jackie Stewart', nat: 'GBR', titles: 3, wins: 27, pod: 43, rating: 95, pace: 94, wet: 97, tyre: 94, rel: 93, era: 'Historical', photo: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { id: 'd22', name: 'Gilles Villeneuve', nat: 'CAN', titles: 0, wins: 6, pod: 13, rating: 91, pace: 98, wet: 96, tyre: 81, rel: 79, era: 'Historical', photo: '🇨🇦' },
  { id: 'd23', name: 'Pierre Gasly', nat: 'FRA', titles: 0, wins: 1, pod: 4, rating: 85, pace: 86, wet: 88, tyre: 85, rel: 88, era: 'Modern', photo: '🇫🇷' },
  { id: 'd24', name: 'Esteban Ocon', nat: 'FRA', titles: 0, wins: 1, pod: 4, rating: 84, pace: 85, wet: 87, tyre: 84, rel: 89, era: 'Modern', photo: '🇫🇷' },
  { id: 'd25', name: 'Alexander Albon', nat: 'THA', titles: 0, wins: 0, pod: 2, rating: 85, pace: 86, wet: 85, tyre: 87, rel: 88, era: 'Modern', photo: '🇹🇭' },
  { id: 'd26', name: 'Yuki Tsunoda', nat: 'JPN', titles: 0, wins: 0, pod: 0, rating: 83, pace: 85, wet: 82, tyre: 81, rel: 84, era: 'Modern', photo: '🇯🇵' },
  { id: 'd27', name: 'Oliver Bearman', nat: 'GBR', titles: 0, wins: 0, pod: 0, rating: 82, pace: 84, wet: 81, tyre: 82, rel: 86, era: '2026', photo: '🇬🇧' },
  { id: 'd28', name: 'Liam Lawson', nat: 'NZL', titles: 0, wins: 0, pod: 0, rating: 82, pace: 83, wet: 84, tyre: 82, rel: 85, era: '2026', photo: '🇳🇿' },
  { id: 'd29', name: 'Jack Doohan', nat: 'AUS', titles: 0, wins: 0, pod: 0, rating: 80, pace: 81, wet: 80, tyre: 80, rel: 84, era: '2026', photo: '🇦🇺' },
  { id: 'd30', name: 'Gabriel Bortoleto', nat: 'BRA', titles: 0, wins: 0, pod: 0, rating: 80, pace: 82, wet: 81, tyre: 80, rel: 83, era: '2026', photo: '🇧🇷' },
];

const CONSTRUCTORS_DB = [
  { id: 'c1', name: 'Ferrari', origin: 'ITA', titles: 16, wins: 246, aero: 93, engine: 96, chassis: 94, rel: 91, color: '#e02424', logo: '🐎' },
  { id: 'c2', name: 'McLaren', origin: 'GBR', titles: 8, wins: 188, aero: 96, engine: 95, chassis: 96, rel: 94, color: '#ff8000', logo: '🧡' },
  { id: 'c3', name: 'Red Bull Racing', origin: 'AUT', titles: 6, wins: 120, aero: 97, engine: 94, chassis: 95, rel: 93, color: '#1e3a8a', logo: '🐂' },
  { id: 'c4', name: 'Mercedes', origin: 'DEU', titles: 8, wins: 125, aero: 92, engine: 96, chassis: 92, rel: 96, color: '#0284c7', logo: '⭐' },
  { id: 'c5', name: 'Aston Martin', origin: 'GBR', titles: 0, wins: 0, aero: 86, engine: 90, chassis: 87, rel: 89, color: '#047857', logo: '💚' },
  { id: 'c6', name: 'Alpine', origin: 'FRA', titles: 2, wins: 21, aero: 84, engine: 83, chassis: 84, rel: 85, color: '#2563eb', logo: '🇫🇷' },
  { id: 'c7', name: 'Williams', origin: 'GBR', titles: 9, wins: 114, aero: 83, engine: 89, chassis: 84, rel: 87, color: '#0284c7', logo: '🔷' },
  { id: 'c8', name: 'Racing Bulls (RB)', origin: 'ITA', titles: 0, wins: 2, aero: 83, engine: 88, chassis: 83, rel: 86, color: '#1d4ed8', logo: '⚡' },
  { id: 'c9', name: 'Sauber / Audi', origin: 'CHE', titles: 0, wins: 1, aero: 80, engine: 82, chassis: 81, rel: 83, color: '#16a34a', logo: '🟢' },
  { id: 'c10', name: 'Haas F1 Team', origin: 'USA', titles: 0, wins: 0, aero: 81, engine: 88, chassis: 81, rel: 84, color: '#dc2626', logo: '🇺🇸' },
  { id: 'c11', name: 'Team Lotus (Hist)', origin: 'GBR', titles: 7, wins: 79, aero: 95, engine: 90, chassis: 94, rel: 80, color: '#d97706', logo: '⚜️' },
  { id: 'c12', name: 'Benetton (Hist)', origin: 'GBR', titles: 2, wins: 27, aero: 90, engine: 89, chassis: 91, rel: 88, color: '#059669', logo: '🟢' },
  { id: 'c13', name: 'Brabham (Hist)', origin: 'GBR', titles: 2, wins: 35, aero: 89, engine: 87, chassis: 89, rel: 83, color: '#475569', logo: '🏁' },
  { id: 'c14', name: 'Tyrrell (Hist)', origin: 'GBR', titles: 1, wins: 23, aero: 87, engine: 86, chassis: 86, rel: 82, color: '#2563eb', logo: '🔵' },
];

const TRACKS_DB = [
  { id: 't1', name: 'Circuit de Monaco', country: 'Monaco', length: '3.337 km', turns: 19, laps: 78, type: 'Street / High Downforce', decade: '1950s', path: 'monaco' },
  { id: 't2', name: 'Silverstone Circuit', country: 'Great Britain', length: '5.891 km', turns: 18, laps: 52, type: 'High Speed Corners', decade: '1950s', path: 'silverstone' },
  { id: 't3', name: 'Circuit de Spa-Francorchamps', country: 'Belgium', length: '7.004 km', turns: 19, laps: 44, type: 'High Speed / Elevation', decade: '1950s', path: 'spa' },
  { id: 't4', name: 'Autodromo Nazionale Monza', country: 'Italy', length: '5.793 km', turns: 11, laps: 53, type: 'Temple of Speed', decade: '1950s', path: 'monza' },
  { id: 't5', name: 'Suzuka International Racing Course', country: 'Japan', length: '5.807 km', turns: 18, laps: 53, type: 'Technical Figure-8', decade: '1980s', path: 'suzuka' },
  { id: 't6', name: 'Autódromo José Carlos Pace (Interlagos)', country: 'Brazil', length: '4.309 km', turns: 15, laps: 71, type: 'Anti-clockwise / Dynamic', decade: '1970s', path: 'interlagos' },
  { id: 't7', name: 'Circuit of the Americas (COTA)', country: 'USA', length: '5.513 km', turns: 20, laps: 56, type: 'Modern Flowing', decade: '2010s', path: 'cota' },
  { id: 't8', name: 'Red Bull Ring', country: 'Austria', length: '4.318 km', turns: 10, laps: 71, type: 'Power Circuit', decade: '1970s', path: 'redbullring' },
  { id: 't9', name: 'Las Vegas Strip Circuit', country: 'USA', length: '6.201 km', turns: 17, laps: 50, type: 'High Speed Street', decade: '2020s', path: 'vegas' },
  { id: 't10', name: 'Circuit Zandvoort', country: 'Netherlands', length: '4.259 km', turns: 14, laps: 72, type: 'Banked Corners', decade: '1950s', path: 'zandvoort' },
  { id: 't11', name: 'Circuit Gilles-Villeneuve', country: 'Canada', length: '4.361 km', turns: 14, laps: 70, type: 'Stop-and-Go', decade: '1970s', path: 'canada' },
  { id: 't12', name: 'Hungaroring', country: 'Hungary', length: '4.381 km', turns: 14, laps: 70, type: 'Twisty / Monaco without walls', decade: '1980s', path: 'hungaroring' },
  { id: 't13', name: 'Nürburgring (Nordschleife / GP)', country: 'Germany', length: '5.148 km', turns: 16, laps: 60, type: 'Historic High Tech', decade: '1950s', path: 'nurburgring' },
  { id: 't14', name: 'Autodromo Enzo e Dino Ferrari (Imola)', country: 'Italy', length: '4.909 km', turns: 19, laps: 63, type: 'Technical / Historic', decade: '1980s', path: 'imola' },
  { id: 't15', name: 'Hockenheimring', country: 'Germany', length: '4.574 km', turns: 17, laps: 67, type: 'Power / Forest Classic', decade: '1970s', path: 'hockenheim' },
  { id: 't16', name: 'Sepang International Circuit', country: 'Malaysia', length: '5.543 km', turns: 15, laps: 56, type: 'Wide / Overtaking Heaven', decade: '1990s', path: 'sepang' },
  { id: 't17', name: 'Marina Bay Street Circuit', country: 'Singapore', length: '4.940 km', turns: 19, laps: 62, type: 'Night Street Circuit', decade: '2000s', path: 'singapore' },
  { id: 't18', name: 'Yas Marina Circuit', country: 'UAE', length: '5.281 km', turns: 16, laps: 58, type: 'Modern Harbor Night', decade: '2000s', path: 'yasmarina' },
  { id: 't19', name: 'Albert Park Circuit', country: 'Australia', length: '5.278 km', turns: 14, laps: 58, type: 'Fast Street Hybrid', decade: '1990s', path: 'melbourne' },
  { id: 't20', name: 'Shanghai International Circuit', country: 'China', length: '5.451 km', turns: 16, laps: 56, type: 'Long Straight / Heavy Braking', decade: '2000s', path: 'shanghai' },
  { id: 't21', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', length: '6.174 km', turns: 27, laps: 50, type: 'Ultra Fast Street', decade: '2020s', path: 'jeddah' },
  { id: 't22', name: 'Miami International Autodrome', country: 'USA', length: '5.412 km', turns: 19, laps: 57, type: 'Modern Complex Street', decade: '2020s', path: 'miami' },
  { id: 't23', name: 'Kyalami Grand Prix Circuit', country: 'South Africa', length: '4.529 km', turns: 16, laps: 72, type: 'High Altitude Classic', decade: '1960s', path: 'kyalami' },
  { id: 't24', name: 'Brands Hatch', country: 'Great Britain', length: '3.703 km', turns: 9, laps: 75, type: 'Rollercoaster Classic', decade: '1960s', path: 'brandshatch' },
  { id: 't25', name: 'Circuit de Barcelona-Catalunya', country: 'Spain', length: '4.657 km', turns: 14, laps: 66, type: 'Aerodynamic Benchmark', decade: '1990s', path: 'barcelona' },
  { id: 't26', name: 'Bahrain International Circuit', country: 'Bahrain', length: '5.412 km', turns: 15, laps: 57, type: 'Desert Night Power', decade: '2000s', path: 'bahrain' },
  { id: 't27', name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', length: '4.304 km', turns: 17, laps: 71, type: 'High Altitude / Stadium', decade: '1960s', path: 'mexico' },
  { id: 't28', name: 'Fuji Speedway', country: 'Japan', length: '4.563 km', turns: 16, laps: 67, type: 'Ultra Long Straight', decade: '1970s', path: 'fuji' },
  { id: 't29', name: 'Istanbul Park', country: 'Turkey', length: '5.338 km', turns: 14, laps: 58, type: 'Turn 8 Quad Apex', decade: '2000s', path: 'istanbul' },
  { id: 't30', name: 'Baku City Circuit', country: 'Azerbaijan', length: '6.003 km', turns: 20, laps: 51, type: 'Castle / High Speed Street', decade: '2010s', path: 'baku' }
];

const STAFF_DB = [
  { id: 's1', role: 'Team Principal', name: 'Toto Wolff', rating: 96, bonus: 'Strategy & Budget Efficiency', cost: 12 },
  { id: 's2', role: 'Team Principal', name: 'Christian Horner', rating: 97, bonus: 'Driver Morale & Race Aggression', cost: 14 },
  { id: 's3', role: 'Team Principal', name: 'Fred Vasseur', rating: 92, bonus: 'Engine Upgrade Speed', cost: 10 },
  { id: 's4', role: 'Technical Director', name: 'Adrian Newey', rating: 99, bonus: '+5 Aero Efficiency on all tracks', cost: 20 },
  { id: 's5', role: 'Technical Director', name: 'Pierre Waché', rating: 93, bonus: '+3 Cornering Stability', cost: 11 },
  { id: 's6', role: 'Race Engineer', name: 'Gianpiero Lambiase (GP)', rating: 96, bonus: 'Tyre Degradation Protection', cost: 10 },
  { id: 's7', role: 'Race Engineer', name: 'Peter Bonnington (Bono)', rating: 95, bonus: 'Wet Weather Pace boost', cost: 10 },
];

const DEFAULT_PRESET_PLAYERS = [
  { id: 'p1', name: 'OM', color: '#ff2d55', avatar: '🏎️', budget: 100, constructors: [], drivers: [], staff: [] },
  { id: 'p2', name: 'SUVAM', color: '#ff9500', avatar: '🚀', budget: 100, constructors: [], drivers: [], staff: [] },
  { id: 'p3', name: 'AFTAB', color: '#007aff', avatar: '👑', budget: 100, constructors: [], drivers: [], staff: [] },
];

// ==========================================
// 3. THREE.JS INTERACTIVE CAR VISUALIZER COMPONENT
// ==========================================
function ThreeCarViewer({ teamColor = '#ff2d55', title = 'F1 Racing Chassis' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070a);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(4.5, 2.2, 5.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.0);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(new THREE.Color(teamColor), 4, 12);
    rimLight.position.set(0, 3, 0);
    scene.add(rimLight);

    const carGroup = new THREE.Group();

    const primaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(teamColor),
      roughness: 0.2,
      metalness: 0.8,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x111318,
      roughness: 0.4,
      metalness: 0.5,
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e24,
      roughness: 0.9,
    });

    const yellowAccentMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.3,
      metalness: 0.7,
    });

    const monoGeo = new THREE.BoxGeometry(2.4, 0.35, 0.65);
    const mono = new THREE.Mesh(monoGeo, primaryMat);
    mono.castShadow = true;
    carGroup.add(mono);

    const noseGeo = new THREE.ConeGeometry(0.38, 2.0, 16);
    const nose = new THREE.Mesh(noseGeo, primaryMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.set(1.8, -0.05, 0);
    nose.scale.set(0.6, 1, 0.8);
    nose.castShadow = true;
    carGroup.add(nose);

    const sidepodGeo = new THREE.BoxGeometry(1.2, 0.3, 0.35);
    const sidepodL = new THREE.Mesh(sidepodGeo, primaryMat);
    sidepodL.position.set(-0.2, -0.02, 0.45);
    sidepodL.rotation.y = -0.08;
    carGroup.add(sidepodL);

    const sidepodR = sidepodL.clone();
    sidepodR.position.set(-0.2, -0.02, -0.45);
    sidepodR.rotation.y = 0.08;
    carGroup.add(sidepodR);

    const cockGeo = new THREE.BoxGeometry(0.8, 0.25, 0.45);
    const cockpit = new THREE.Mesh(cockGeo, carbonMat);
    cockpit.position.set(0.1, 0.18, 0);
    carGroup.add(cockpit);

    const helmetGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const helmet = new THREE.Mesh(helmetGeo, yellowAccentMat);
    helmet.position.set(0.2, 0.28, 0);
    carGroup.add(helmet);

    const haloGeo = new THREE.TorusGeometry(0.22, 0.04, 8, 16, Math.PI);
    const halo = new THREE.Mesh(haloGeo, carbonMat);
    halo.rotation.x = Math.PI / 2;
    halo.rotation.z = Math.PI / 2;
    halo.position.set(0.22, 0.32, 0);
    carGroup.add(halo);

    const mainFWingGeo = new THREE.BoxGeometry(0.4, 0.04, 1.9);
    const frontWing = new THREE.Mesh(mainFWingGeo, carbonMat);
    frontWing.position.set(2.4, -0.15, 0);
    frontWing.castShadow = true;
    carGroup.add(frontWing);

    const endPlateGeo = new THREE.BoxGeometry(0.3, 0.25, 0.04);
    const endPlateL = new THREE.Mesh(endPlateGeo, primaryMat);
    endPlateL.position.set(2.4, -0.05, 0.95);
    carGroup.add(endPlateL);
    const endPlateR = endPlateL.clone();
    endPlateR.position.set(2.4, -0.05, -0.95);
    carGroup.add(endPlateR);

    const rWingGeo = new THREE.BoxGeometry(0.45, 0.05, 1.4);
    const rearWing = new THREE.Mesh(rWingGeo, primaryMat);
    rearWing.position.set(-1.4, 0.45, 0);
    rearWing.castShadow = true;
    carGroup.add(rearWing);

    const rPillarGeo = new THREE.BoxGeometry(0.06, 0.45, 0.06);
    const rPillar = new THREE.Mesh(rPillarGeo, carbonMat);
    rPillar.position.set(-1.4, 0.2, 0);
    carGroup.add(rPillar);

    const rEndPlateGeo = new THREE.BoxGeometry(0.45, 0.4, 0.04);
    const rEndPlateL = new THREE.Mesh(rEndPlateGeo, carbonMat);
    rEndPlateL.position.set(-1.4, 0.35, 0.7);
    carGroup.add(rEndPlateL);
    const rEndPlateR = rEndPlateL.clone();
    rEndPlateR.position.set(-1.4, 0.35, -0.7);
    carGroup.add(rEndPlateR);

    const tyreGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.32, 24);
    const hubGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.33, 16);

    const wheelPositions = [
      [1.4, -0.05, 0.82],
      [1.4, -0.05, -0.82],
      [-1.1, -0.05, 0.85],
      [-1.1, -0.05, -0.85],
    ];

    wheelPositions.forEach((pos) => {
      const wheelGroup = new THREE.Group();
      const tyre = new THREE.Mesh(tyreGeo, rubberMat);
      tyre.rotation.x = Math.PI / 2;
      tyre.castShadow = true;
      wheelGroup.add(tyre);

      const hub = new THREE.Mesh(hubGeo, yellowAccentMat);
      hub.rotation.x = Math.PI / 2;
      wheelGroup.add(hub);

      wheelGroup.position.set(...pos);
      carGroup.add(wheelGroup);

      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
      const strut = new THREE.Mesh(strutGeo, carbonMat);
      strut.rotation.z = Math.PI / 2.5;
      strut.position.set(pos[0], pos[1] + 0.05, pos[2] > 0 ? pos[2] - 0.3 : pos[2] + 0.3);
      carGroup.add(strut);
    });

    const gridHelper = new THREE.GridHelper(12, 24, new THREE.Color(teamColor), 0x1e293b);
    gridHelper.position.y = -0.42;
    scene.add(gridHelper);

    scene.add(carGroup);

    let reqId;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX || e.touches?.[0]?.clientX || 0;
      prevMouseY = e.clientY || e.touches?.[0]?.clientY || 0;
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e) => {
      if (isDragging) {
        const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
        const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        carGroup.rotation.y += deltaX * 0.01;
        carGroup.rotation.x += deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    domElem.addEventListener('touchstart', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove, { passive: true });

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!isDragging) {
        carGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      domElem.removeEventListener('mousedown', onMouseDown);
      domElem.removeEventListener('touchstart', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, [teamColor]);

  return (
    <div className="relative w-full h-full min-h-[160px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 group shadow-inner flex items-center justify-center">
      <div className="absolute top-2 left-3 z-10 flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-300">{title}</span>
      </div>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center min-h-[160px]" />
      <div className="absolute bottom-2 right-3 z-10 text-[9px] font-mono text-slate-500 pointer-events-none bg-slate-900/70 px-2 py-0.5 rounded border border-slate-800">
        3D Engine
      </div>
    </div>
  );
}

// ==========================================
// 4. CANVAS TRACK CIRCUIT PREVIEW COMPONENT
// ==========================================
function TrackCanvasPreview({ track }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 10;
    ctx.beginPath();

    if (track.path === 'monaco') {
      ctx.moveTo(40, 100);
      ctx.lineTo(120, 40);
      ctx.lineTo(220, 50);
      ctx.lineTo(260, 120);
      ctx.lineTo(180, 160);
      ctx.lineTo(80, 140);
      ctx.closePath();
    } else if (track.path === 'monza') {
      ctx.moveTo(30, 140);
      ctx.lineTo(30, 40);
      ctx.lineTo(260, 40);
      ctx.lineTo(270, 90);
      ctx.lineTo(200, 140);
      ctx.closePath();
    } else {
      ctx.moveTo(50, 60);
      ctx.bezierCurveTo(150, 10, 250, 40, 260, 100);
      ctx.bezierCurveTo(270, 160, 160, 180, 100, 140);
      ctx.bezierCurveTo(40, 110, 10, 80, 50, 60);
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(45, 55, 6, 15);
  }, [track]);

  return (
    <div className="flex flex-col items-center bg-slate-900/60 p-3 rounded-lg border border-slate-800">
      <canvas ref={canvasRef} width={300} height={180} className="w-full h-32 sm:h-36" />
      <div className="flex justify-between w-full text-[10px] sm:text-xs text-slate-400 mt-2 px-1">
        <span>Len: {track.length}</span>
        <span>Turns: {track.turns}</span>
        <span>Laps: {track.laps}</span>
      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN APPLICATION CONTROLLER
// ==========================================
export default function F1AuctionArena() {
  const [currentStep, setCurrentStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [muted, setMuted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const [championshipConfig, setChampionshipConfig] = useState({
    era: 'All-Time F1 History',
    perfMode: 'Era-Normalised',
    customYear: 2026,
    currency: 'M$',
    scoringPreset: 'Modern (25-18-15)',
    fastestLapPoint: true,
  });

  const [carOwnershipConfig, setCarOwnershipConfig] = useState({
    carsPerPlayer: 2,
    teamAllocationType: 'different',
  });

  const [selectedTracks, setSelectedTracks] = useState(TRACKS_DB.map((t) => t.id));
  const [trackDecadeFilter, setTrackDecadeFilter] = useState('ALL');

  const [selectedConstructors, setSelectedConstructors] = useState(CONSTRUCTORS_DB.map((c) => c.id));

  const [players, setPlayers] = useState(DEFAULT_PRESET_PLAYERS);

  const [auctionCategory, setAuctionCategory] = useState('drivers');
  const [auctionIndex, setAuctionIndex] = useState(0);
  const [currentBid, setCurrentBid] = useState(0);
  const [playerCustomBids, setPlayerCustomBids] = useState({});
  const [highestBidder, setHighestBidder] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [auctionLog, setAuctionLog] = useState([]);

  const [currentRaceIndex, setCurrentRaceIndex] = useState(0);
  const [raceResults, setRaceResults] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simSpeed, setSimSpeed] = useState('normal');

  const [rdCredits, setRdCredits] = useState({ p1: 15, p2: 15, p3: 15 });
  const [playerUpgrades, setPlayerUpgrades] = useState({});

  const handleApplyUpgrade = (playerId, upgradeType, cost) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    const currentTokens = rdCredits[playerId] ?? 15;
    if (currentTokens < cost) {
      alert(`${player.name} does not have enough R&D Tokens (${currentTokens} available, ${cost} required)!`);
      return;
    }

    setRdCredits({
      ...rdCredits,
      [playerId]: currentTokens - cost,
    });

    setPlayerUpgrades((prev) => {
      const existing = prev[playerId] || { aero: 0, engine: 0, chassis: 0, tyre: 0 };
      return {
        ...prev,
        [playerId]: {
          ...existing,
          [upgradeType]: existing[upgradeType] + 1,
        },
      };
    });

    audioFX.playEngineRev();
  };

  const toggleSound = () => {
    const isMuted = audioFX.toggleMute();
    setMuted(isMuted);
  };

  const toggleF1Music = () => {
    if (isPlayingMusic) {
      audioFX.stopF1Theme();
      setIsPlayingMusic(false);
    } else {
      audioFX.playF1Theme();
      setIsPlayingMusic(true);
    }
  };

  const getCurrentAuctionPool = () => {
    if (auctionCategory === 'drivers') return DRIVERS_DB;
    if (auctionCategory === 'constructors') return CONSTRUCTORS_DB;
    return STAFF_DB;
  };

  const currentAuctionItem = getCurrentAuctionPool()[auctionIndex] || getCurrentAuctionPool()[0];

  const handlePlaceBid = (playerId, increment, directAmount = null) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;

    let newBid = 0;
    if (directAmount !== null && directAmount !== undefined && directAmount !== '') {
      newBid = parseFloat(directAmount);
    } else {
      newBid = Math.round((currentBid + increment) * 10) / 10;
    }

    if (isNaN(newBid)) {
      alert("Please enter a valid numeric bid!");
      return;
    }

    if (newBid <= currentBid) {
      alert(`Bid must be strictly higher than the current highest bid (${currentBid} M$)!`);
      return;
    }

    if (player.budget < newBid) {
      alert(`${player.name} does not have enough remaining budget (${player.budget} M$) for this bid!`);
      return;
    }

    const targetSeatLimit = carOwnershipConfig.carsPerPlayer || 2;
    const reqConstructors = carOwnershipConfig.teamAllocationType === 'same' ? 1 : targetSeatLimit;

    const currentDrivers = Array.isArray(player.drivers) ? player.drivers : [];
    const currentConstructors = Array.isArray(player.constructors) ? player.constructors : [];

    if (auctionCategory === 'drivers' && currentDrivers.length >= targetSeatLimit) {
      alert(`${player.name} has already acquired their maximum quota of ${targetSeatLimit} drivers!`);
      return;
    }

    if (auctionCategory === 'constructors' && currentConstructors.length >= reqConstructors) {
      alert(`${player.name} has already acquired their maximum quota of ${reqConstructors} constructor(s)!`);
      return;
    }

    setCurrentBid(newBid);
    setHighestBidder(player);
    setTimer(15);
    setIsTimerActive(true);
    audioFX.playBid();
  };

  const handleUndoBid = () => {
    setCurrentBid(0);
    setPlayerCustomBids({});
    setHighestBidder(null);
    setTimer(15);
    setIsTimerActive(false);
  };

  const handleSkipAuctionItem = () => {
    const pool = getCurrentAuctionPool();
    if (auctionIndex < pool.length - 1) {
      setAuctionIndex(auctionIndex + 1);
    } else {
      setAuctionIndex(0);
    }
    handleUndoBid();
  };

  const handleFinalizeAuctionItem = () => {
    if (!highestBidder || !currentAuctionItem) {
      handleSkipAuctionItem();
      return;
    }

    const winningPlayerId = highestBidder.id;
    const itemToAllocate = currentAuctionItem;
    const finalWinningBid = currentBid;
    const targetSeatLimit = carOwnershipConfig.carsPerPlayer || 2;

    const targetPlayer = players.find((p) => p.id === winningPlayerId);
    if (!targetPlayer) {
      handleSkipAuctionItem();
      return;
    }

    if (auctionCategory === 'drivers' && targetPlayer.drivers.length >= targetSeatLimit) {
      alert(`${targetPlayer.name} has already acquired their maximum quota of ${targetSeatLimit} drivers!`);
      handleUndoBid();
      return;
    }

    const reqConstructors = carOwnershipConfig.teamAllocationType === 'same' ? 1 : targetSeatLimit;
    if (auctionCategory === 'constructors' && targetPlayer.constructors.length >= reqConstructors) {
      alert(`${targetPlayer.name} has already acquired their maximum quota of ${reqConstructors} constructor(s)!`);
      handleUndoBid();
      return;
    }

    const updatedPlayers = players.map((p) => {
      if (p.id === winningPlayerId) {
        const newBudget = Math.max(0, Math.round((p.budget - finalWinningBid) * 10) / 10);
        if (auctionCategory === 'drivers') {
          return { ...p, budget: newBudget, drivers: [...p.drivers, itemToAllocate.id] };
        } else if (auctionCategory === 'constructors') {
          return { ...p, budget: newBudget, constructors: [...p.constructors, itemToAllocate.id] };
        } else {
          return { ...p, budget: newBudget, staff: [...p.staff, itemToAllocate.id] };
        }
      }
      return p;
    });

    setPlayers(updatedPlayers);

    setAuctionLog((prevLog) => [
      {
        item: itemToAllocate.name,
        amount: finalWinningBid,
        winner: targetPlayer.name,
        category: auctionCategory,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prevLog,
    ]);

    audioFX.playGavel();

    setCurrentBid(0);
    setPlayerCustomBids({});
    setHighestBidder(null);
    setTimer(15);
    setIsTimerActive(false);

    if (auctionCategory === 'drivers') {
      const allDriversFilled = updatedPlayers.every((p) => p.drivers.length >= targetSeatLimit);
      if (allDriversFilled) {
        alert(`🏁 Driver Seats Quota Completed! All players have secured ${targetSeatLimit} drivers. Switching automatically to Constructor Auction...`);
        setAuctionCategory('constructors');
        setAuctionIndex(0);
        return;
      }
    } else if (auctionCategory === 'constructors') {
      const reqConstructors = carOwnershipConfig.teamAllocationType === 'same' ? 1 : targetSeatLimit;
      const allConstructorsFilled = updatedPlayers.every((p) => p.constructors.length >= reqConstructors);
      if (allConstructorsFilled) {
        alert(`🏁 Constructor Auction Completed! Switching automatically to Personnel & Team Principals Auction...`);
        setAuctionCategory('staff');
        setAuctionIndex(0);
        return;
      }
    } else if (auctionCategory === 'staff') {
      const allStaffFilled = updatedPlayers.every((p) => p.staff.length >= 1);
      if (allStaffFilled) {
        alert(`🎉 All Auction Categories Completed! Proceeding to Player Garages...`);
        setCurrentStep(8);
        return;
      }
    }

    const pool = getCurrentAuctionPool();
    const assignedIds = new Set(
      updatedPlayers.flatMap((p) =>
        auctionCategory === 'drivers'
          ? p.drivers
          : auctionCategory === 'constructors'
          ? p.constructors
          : p.staff
      )
    );

    let nextIdx = (auctionIndex + 1) % pool.length;
    let attempts = 0;
    while (assignedIds.has(pool[nextIdx]?.id) && attempts < pool.length) {
      nextIdx = (nextIdx + 1) % pool.length;
      attempts++;
    }

    if (attempts >= pool.length) {
      if (auctionCategory === 'drivers') {
        setAuctionCategory('constructors');
        setAuctionIndex(0);
      } else if (auctionCategory === 'constructors') {
        setAuctionCategory('staff');
        setAuctionIndex(0);
      } else {
        setCurrentStep(8);
      }
    } else {
      setAuctionIndex(nextIdx);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
        if (timer <= 5) {
          audioFX.playBeep(true);
        }
      }, 1000);
    } else if (isTimerActive && timer === 0) {
      setIsTimerActive(false);
      handleFinalizeAuctionItem();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timer, highestBidder, currentAuctionItem, currentBid, auctionCategory, auctionIndex]);

  const runRaceSimulation = () => {
    setIsSimulating(true);
    audioFX.playEngineRev();

    setTimeout(() => {
      const trackId = selectedTracks[currentRaceIndex];
      const track = TRACKS_DB.find((t) => t.id === trackId) || TRACKS_DB[0];

      const gridEntries = [];
      players.forEach((player) => {
        const upgrades = playerUpgrades[player.id] || { aero: 0, engine: 0, chassis: 0, tyre: 0 };
        const aeroBonus = upgrades.aero * 2.5;
        const engineBonus = upgrades.engine * 2.5;
        const chassisBonus = upgrades.chassis * 2.0;

        player.drivers.forEach((dId) => {
          const driver = DRIVERS_DB.find((d) => d.id === dId);
          const cId = player.constructors[0] || CONSTRUCTORS_DB[0].id;
          const constructor = CONSTRUCTORS_DB.find((c) => c.id === cId);
          if (driver && constructor) {
            const score =
              (driver.pace + aeroBonus + engineBonus) * 0.4 +
              driver.rating * 0.2 +
              (constructor.aero + aeroBonus) * 0.2 +
              (constructor.engine + engineBonus) * 0.1 +
              chassisBonus +
              Math.random() * 15;
            gridEntries.push({ player, driver, constructor, score });
          }
        });
      });

      gridEntries.sort((a, b) => b.score - a.score);

      const pointsTable = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
      const classifiedGrid = gridEntries.map((entry, idx) => ({
        pos: idx + 1,
        ...entry,
        points: pointsTable[idx] || 0,
        fastLap: idx === 0,
        dnf: false,
      }));

      const newRaceResult = {
        track,
        grid: classifiedGrid,
      };

      setRaceResults([...raceResults, newRaceResult]);
      setIsSimulating(false);

      if (currentRaceIndex < selectedTracks.length - 1) {
        setCurrentRaceIndex(currentRaceIndex + 1);
      }
    }, simSpeed === 'fast' ? 1000 : 2500);
  };

  const standings = useMemo(() => {
    const playerPointsMap = {};
    const playerWinsMap = {};
    const driverPointsMap = {};

    players.forEach((p) => {
      playerPointsMap[p.id] = 0;
      playerWinsMap[p.id] = 0;
    });

    raceResults.forEach((race) => {
      race.grid.forEach((res) => {
        if (res.player) {
          playerPointsMap[res.player.id] = (playerPointsMap[res.player.id] || 0) + res.points;
          if (res.pos === 1) {
            playerWinsMap[res.player.id] = (playerWinsMap[res.player.id] || 0) + 1;
          }
        }
        if (res.driver) {
          driverPointsMap[res.driver.id] = (driverPointsMap[res.driver.id] || 0) + res.points;
        }
      });
    });

    const playerList = players.map((p) => ({
      ...p,
      points: playerPointsMap[p.id] || 0,
      wins: playerWinsMap[p.id] || 0,
    })).sort((a, b) => b.points - a.points);

    const driverList = DRIVERS_DB.map((d) => ({
      ...d,
      points: driverPointsMap[d.id] || 0,
      team: players.find((p) => p.drivers.includes(d.id))?.name || 'Free Agent',
    })).sort((a, b) => b.points - a.points);

    return { playerList, driverList };
  }, [raceResults, players]);

  const handleExportSave = () => {
    const saveData = {
      championshipConfig,
      selectedTracks,
      selectedConstructors,
      players,
      auctionLog,
      raceResults,
      currentRaceIndex,
    };
    const jsonStr = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F1_Auction_Arena_Save_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stepsList = [
    { id: 0, label: 'Home' },
    { id: 1, label: 'Era Setup' },
    { id: 2, label: 'Tracks' },
    { id: 3, label: 'Constructors' },
    { id: 4, label: 'Players' },
    { id: 5, label: 'Car Rules' },
    { id: 6, label: 'Budget' },
    { id: 7, label: 'Auction' },
    { id: 8, label: 'Garage' },
    { id: 9, label: 'Race Sim' },
    { id: 10, label: 'R&D' },
    { id: 11, label: 'Standings' },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden pb-16 sm:pb-0">
      {/* MOBILE-RESPONSIVE HEADER BAR */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center font-black text-white text-[10px]">
            F1
          </div>
          <span className="font-extrabold tracking-wider text-xs sm:text-sm uppercase">
            F1 ARENA
          </span>
        </div>

        {/* Desktop Step Tabs */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          {stepsList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentStep(tab.id)}
              className={`px-2.5 py-1 rounded font-semibold whitespace-nowrap transition ${
                currentStep === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleF1Music}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold transition border ${
              isPlayingMusic
                ? 'bg-red-600 border-red-500 text-white shadow-md animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <Music className="w-3 h-3 text-yellow-400" />
            <span className="hidden sm:inline">{isPlayingMusic ? 'THEME: ON' : 'F1 MUSIC'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN NAVIGATION MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden sticky top-[49px] z-20 bg-slate-900 border-b border-slate-800 p-3 grid grid-cols-3 gap-2 shadow-xl">
          {stepsList.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentStep(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-[11px] font-bold text-center border transition ${
                currentStep === tab.id
                  ? 'bg-red-600 text-white border-red-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* STEP 0: HOME LANDING */}
        {currentStep === 0 && (
          <div className="relative w-full min-h-[calc(100vh-60px)] flex flex-col lg:flex-row items-center justify-between p-4 sm:p-8 lg:p-16 gap-6">
            <div className="z-10 max-w-xl space-y-4 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/40 text-red-400 text-xs font-mono">
                <Music className="w-3.5 h-3.5 text-yellow-400 animate-spin" /> F1® GRAND PRIX ANTHEM READY
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
                BUILD YOUR F1 <span className="text-red-600">DYNASTY.</span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed">
                Pass-the-device auction arena. Complete with synthesized F1 Grand Prix music, bid on drivers, construct your squad, and race simulated GPs.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 font-bold text-xs sm:text-sm tracking-wide rounded-xl shadow-lg shadow-red-600/30 transition"
                >
                  <Plus className="w-4 h-4" /> NEW CHAMPIONSHIP
                </button>
                <button
                  onClick={() => setCurrentStep(7)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 font-bold text-xs sm:text-sm tracking-wide rounded-xl border border-slate-700 transition"
                >
                  <Play className="w-4 h-4" /> START AUCTION
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full max-h-[450px]">
              <ThreeCarViewer teamColor="#e02424" title="2026 CONCEPT CHASSIS" />
            </div>
          </div>
        )}

        {/* STEP 1: CONFIGURATION WIZARD */}
        {currentStep === 1 && (
          <div className="w-full p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Championship Setup</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Configure historical performance era, rules, and scoring models.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-slate-900/60 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 block">Select Championship Period</label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    '2026 Season',
                    '2025 Season',
                    '2024 Season',
                    '2021 Season',
                    '2016 Season',
                    '2010 Season',
                    '2008 Season',
                    '1998 Season',
                    '1988 Season',
                    'All-Time History',
                    'Custom Year',
                  ].map((period) => (
                    <button
                      key={period}
                      onClick={() =>
                        setChampionshipConfig({
                          ...championshipConfig,
                          era: period,
                        })
                      }
                      className={`p-2.5 sm:p-3 rounded-lg text-[10px] sm:text-xs font-bold transition border ${
                        championshipConfig.era === period
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4">
                <label className="text-xs sm:text-sm font-semibold text-slate-300 block">Performance Calculation Mode</label>
                <div className="space-y-3">
                  {[
                    {
                      id: 'Era-Normalised',
                      title: 'Era-Normalised Performance',
                      desc: 'Adjusts driver and car specs to make historical eras competitively equal.',
                    },
                    {
                      id: 'Historical-Actual',
                      title: 'Raw Historical Achievements',
                      desc: 'Uses real historic win rates and career dominance without tech equalization.',
                    },
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      onClick={() =>
                        setChampionshipConfig({
                          ...championshipConfig,
                          perfMode: mode.id,
                        })
                      }
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        championshipConfig.perfMode === mode.id
                          ? 'bg-slate-900 border-red-500'
                          : 'bg-slate-950/60 border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="font-bold text-xs">{mode.title}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{mode.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(0)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: TRACK CALENDAR */}
        {currentStep === 2 && (
          <div className="w-full p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-slate-800 pb-3 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Race Calendar Configuration</h2>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Select Grand Prix circuits ({selectedTracks.length} / {TRACKS_DB.length} Selected).
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTracks(TRACKS_DB.map((t) => t.id))}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] sm:text-xs rounded border border-slate-700"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedTracks([])}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] sm:text-xs rounded border border-slate-700"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {TRACKS_DB.slice(0, 12).map((track) => {
                const isSelected = selectedTracks.includes(track.id);
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTracks(selectedTracks.filter((id) => id !== track.id));
                      } else {
                        setSelectedTracks([...selectedTracks, track.id]);
                      }
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-red-500'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <div>
                          <h4 className="text-xs font-bold">{track.name}</h4>
                          <span className="text-[9px] text-slate-400">{track.country}</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSelected} readOnly className="accent-red-600" />
                    </div>
                    <TrackCanvasPreview track={track} />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONSTRUCTORS */}
        {currentStep === 3 && (
          <div className="w-full p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end border-b border-slate-800 pb-3 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Constructors Database</h2>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  Select available team chassis/engine packages.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONSTRUCTORS_DB.map((c) => {
                const isSelected = selectedConstructors.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedConstructors(selectedConstructors.filter((id) => id !== c.id));
                      } else {
                        setSelectedConstructors([...selectedConstructors, c.id]);
                      }
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-red-500'
                        : 'bg-slate-950/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{c.logo}</span>
                        <div>
                          <h4 className="text-xs font-bold">{c.name}</h4>
                          <span className="text-[9px] text-slate-400">{c.origin} • {c.titles} Titles</span>
                        </div>
                      </div>
                      <input type="checkbox" checked={isSelected} readOnly className="accent-red-600" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PLAYER REGISTRATION */}
        {currentStep === 4 && (
          <div className="w-full p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Player Registration</h2>
                <p className="text-[11px] sm:text-xs text-slate-400">Register participants for offline auctioning.</p>
              </div>
              <button
                onClick={() => {
                  const newId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                  setPlayers([
                    ...players,
                    {
                      id: newId,
                      name: `PLAYER ${players.length + 1}`,
                      color: '#10b981',
                      avatar: '🏎️',
                      budget: 100,
                      constructors: [],
                      drivers: [],
                      staff: [],
                    },
                  ]);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" /> Add Player
              </button>
            </div>

            <div className="space-y-3">
              {players.map((p, idx) => (
                <div key={p.id || `p_${idx}`} className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-slate-500 text-xs font-bold">P{idx + 1}</span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPlayers(players.map((pl) => (pl.id === p.id ? { ...pl, name: val } : pl)));
                    }}
                    className="flex-1 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold focus:border-red-500 outline-none"
                  />
                  <input
                    type="color"
                    value={p.color}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPlayers(players.map((pl) => (pl.id === p.id ? { ...pl, color: val } : pl)));
                    }}
                    className="w-7 h-7 rounded border-none cursor-pointer bg-transparent"
                  />
                  {players.length > 2 && (
                    <button
                      onClick={() => setPlayers(players.filter((pl) => pl.id !== p.id))}
                      className="p-1.5 bg-slate-950 text-slate-500 hover:text-red-400 rounded-lg border border-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CAR SEATS & TEAM OWNERSHIP RULES */}
        {currentStep === 5 && (
          <div className="w-full p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Car Seat Allocation</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Set total car seats and team ownership rules for players.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4">
              <label className="text-xs sm:text-sm font-semibold text-slate-200 block">
                Driver Seats Per Player
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[1, 2, 3, 4].map((count) => (
                  <button
                    key={count}
                    onClick={() =>
                      setCarOwnershipConfig({
                        ...carOwnershipConfig,
                        carsPerPlayer: count,
                      })
                    }
                    className={`p-3 rounded-xl border font-bold text-xs sm:text-sm transition flex flex-col items-center gap-0.5 ${
                      carOwnershipConfig.carsPerPlayer === count
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span>{count} CARS</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(6)}
                className="flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: BUDGET */}
        {currentStep === 6 && (
          <div className="w-full p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Starting Purse</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Set bidding capital for each player.</p>
            </div>

            <div className="bg-slate-900/60 p-4 sm:p-6 rounded-xl border border-slate-800 space-y-4">
              <label className="text-xs font-semibold text-slate-300 block">Budget (M$)</label>
              <input
                type="number"
                value={players[0]?.budget || 100}
                onChange={(e) => {
                  const val = Number(e.target.value) || 100;
                  setPlayers(players.map((p) => ({ ...p, budget: val })));
                }}
                className="w-full sm:w-48 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-emerald-400 font-mono font-bold text-sm outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(7)}
                className="flex items-center gap-1.5 px-6 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg uppercase tracking-wide"
              >
                START AUCTION <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: AUCTION ENGINE (MOBILE OPTIMIZED) */}
        {currentStep === 7 && (
          <div className="w-full p-3 sm:p-6 max-w-7xl mx-auto space-y-4 pb-24 sm:pb-6">
            {/* Top Navigation & Phase Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
              <div>
                <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  AUCTION ARENA
                </h2>
              </div>

              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
                {[
                  { id: 'drivers', label: 'Drivers', icon: '🏎️' },
                  { id: 'constructors', label: 'Teams', icon: '🏁' },
                  { id: 'staff', label: 'Staff', icon: '👔' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setAuctionCategory(cat.id);
                      setAuctionIndex(0);
                      handleUndoBid();
                    }}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold uppercase transition ${
                      auctionCategory === cat.id
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auction Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Asset Card */}
              <div className="lg:col-span-7 bg-slate-900/90 rounded-xl border border-slate-800 p-4 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    {auctionCategory.toUpperCase()} NOMINATION
                  </span>

                  <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400">TIMER:</span>
                    <span className={`text-sm font-black font-mono ${timer <= 5 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
                      {timer}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-4xl sm:text-5xl shrink-0">
                    {currentAuctionItem?.photo || currentAuctionItem?.logo || '🏆'}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-slate-100">
                      {currentAuctionItem?.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-400">
                      {currentAuctionItem?.nat || currentAuctionItem?.origin} • {currentAuctionItem?.titles || 0} Titles
                    </p>
                  </div>
                </div>

                {/* Highest Bid Summary Box */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">HIGHEST BIDDER</span>
                    <span className="text-xs sm:text-sm font-extrabold uppercase text-slate-200">
                      {highestBidder ? highestBidder.name : 'NO BIDS YET'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">VALUATION</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{currentBid} M$</span>
                  </div>
                </div>
              </div>

              {/* Bidding Stations */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                  PLAYER BIDDING STATIONS
                </h4>

                <div className="space-y-2.5">
                  {players.map((p, idx) => {
                    const isWinning = highestBidder?.id === p.id;
                    const driversTaken = Array.isArray(p.drivers) ? p.drivers.length : 0;
                    const maxDrivers = carOwnershipConfig.carsPerPlayer || 2;
                    const isFull = driversTaken >= maxDrivers;

                    return (
                      <div
                        key={p.id || `bidder_${idx}`}
                        className={`p-3 rounded-xl border transition space-y-2 ${
                          isWinning
                            ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                            <span className="font-extrabold text-xs uppercase text-slate-100">{p.name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-emerald-400">{p.budget} M$</span>
                        </div>

                        {/* Increment Buttons */}
                        <div className="grid grid-cols-4 gap-1">
                          {[0.5, 1.0, 1.5, 2.5].map((inc) => (
                            <button
                              key={inc}
                              disabled={isFull}
                              onClick={() => handlePlaceBid(p.id, inc)}
                              className="py-1 bg-slate-900 hover:bg-red-600 text-slate-200 font-mono text-[10px] font-bold rounded border border-slate-800"
                            >
                              +{inc}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR FOR MOBILE */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 p-2.5 backdrop-blur-md flex items-center justify-between gap-2 shadow-2xl">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndoBid}
                  className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-slate-400 rounded-lg border border-slate-800"
                >
                  Reset
                </button>
                <button
                  onClick={handleSkipAuctionItem}
                  className="px-2.5 py-2 bg-slate-950 hover:bg-slate-800 text-[10px] font-bold text-slate-400 rounded-lg border border-slate-800"
                >
                  Skip
                </button>
              </div>

              <button
                onClick={handleFinalizeAuctionItem}
                className="flex-1 max-w-xs py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-lg shadow-lg shadow-emerald-950/40 uppercase tracking-wide text-center"
              >
                SELL & ALLOCATE NOW
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: PLAYER GARAGES */}
        {currentStep === 8 && (
          <div className="w-full p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-800 pb-3 gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase text-slate-100">
                  PLAYER GARAGES
                </h2>
              </div>
              <button
                onClick={() => setCurrentStep(9)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-xs font-bold rounded-lg"
              >
                Race Simulation <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {players.map((player) => {
                const playerDrivers = (player.drivers || [])
                  .map((id) => DRIVERS_DB.find((d) => d.id === id))
                  .filter(Boolean);

                return (
                  <div
                    key={player.id}
                    className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: player.color }} />
                        <h3 className="text-base font-black uppercase text-slate-100">{player.name}</h3>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">{player.budget} M$</span>
                    </div>

                    <div className="w-full h-44 flex items-center justify-center">
                      <ThreeCarViewer teamColor={player.color} title={`${player.name} CHASSIS`} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-mono uppercase text-slate-400">SQUAD DRIVERS</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {playerDrivers.map((driver) => (
                          <div key={driver.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
                            <span className="text-2xl">{driver.photo}</span>
                            <div>
                              <h5 className="text-xs font-bold">{driver.name}</h5>
                              <span className="text-[9px] font-mono text-red-400">Pace: {driver.pace}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 9: RACE SIMULATION */}
        {currentStep === 9 && (
          <div className="w-full p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl sm:text-2xl font-black uppercase">GRAND PRIX SIMULATOR</h2>
              <button
                disabled={isSimulating}
                onClick={runRaceSimulation}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-extrabold text-xs rounded-lg uppercase"
              >
                {isSimulating ? 'SIMULATING...' : 'START RACE'}
              </button>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300">LATEST RACE CLASSIFICATION</h3>
              {raceResults.length > 0 && (
                <div className="space-y-2">
                  {raceResults[raceResults.length - 1].grid.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                      <span>P{item.pos} {item.driver.name}</span>
                      <span className="text-emerald-400 font-bold">+{item.points} PTS</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 10: R&D DEVELOPMENT HUB */}
        {currentStep === 10 && (
          <div className="w-full p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase border-b border-slate-800 pb-3">R&D FACILITY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {players.map((p) => (
                <div key={p.id} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-extrabold text-xs uppercase">{p.name}</h3>
                  <button
                    onClick={() => handleApplyUpgrade(p.id, 'aero', 5)}
                    className="w-full py-1.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase"
                  >
                    Upgrade Aero (5 Tokens)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 11: CHAMPIONSHIP STANDINGS */}
        {currentStep === 11 && (
          <div className="w-full p-4 sm:p-8 max-w-5xl mx-auto space-y-6">
            <h2 className="text-xl sm:text-2xl font-black uppercase border-b border-slate-800 pb-3">CHAMPIONSHIP STANDINGS</h2>
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2">
              {standings.playerList.map((p, idx) => (
                <div key={p.id} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono">
                  <span>P{idx + 1} {p.name}</span>
                  <span className="text-red-400 font-bold">{p.points} PTS</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}