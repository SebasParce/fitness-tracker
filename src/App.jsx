import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, LogOut, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from './supabaseClient';

// ---------- Plantillas de rutina (punto de partida opcional al crear cuenta) ----------
let exCounter = 0;
const ex = (name, sets, reps, rest) => ({ id: `e${++exCounter}`, name, sets, reps, rest: rest || null });
const day = (id, name, exercises) => ({ id, name, exercises });

const buildSebasRoutine = () => ({
  name: 'Rutina Sebas',
  days: [
    day('d1', 'Día 1 — Push (Pecho, Hombros, Tríceps)', [
      ex('Press banca con barra', 4, '4–6'),
      ex('Press inclinado mancuernas', 4, '8–10'),
      ex('Press militar barra de pie', 4, '6–8'),
      ex('Elevaciones laterales mancuernas', 4, '12–15'),
      ex('Press banca agarre cerrado', 3, '10–12'),
      ex('Extensión tríceps polea alta', 3, '12–15'),
    ]),
    day('d2', 'Día 2 — Pull (Espalda, Bíceps)', [
      ex('Peso muerto rumano', 4, '4–6'),
      ex('Remo con barra', 4, '6–8'),
      ex('Jalón al pecho agarre ancho', 4, '8–10'),
      ex('Remo en polea sentado agarre neutro', 4, '10–12'),
      ex('Face pull con polea', 4, '15–20'),
      ex('Curl barra', 3, '8–10'),
      ex('Curl martillo', 3, '10–12'),
    ]),
    day('d3', 'Día 3 — Legs (Cuádriceps, Isquios, Glúteos, Pantorrillas)', [
      ex('Sentadilla con barra', 4, '4–6'),
      ex('Prensa 45°', 4, '10–12'),
      ex('Extensión de cuádriceps', 3, '12–15'),
      ex('Curl femoral sentado', 4, '10–12'),
      ex('Hip thrust barra o máquina', 3, '10–12'),
      ex('Pantorrilla de pie con barra', 4, '12–15'),
    ]),
    day('d4', 'Día 4 — Upper (Énfasis Espalda/Hombros)', [
      ex('Press militar mancuernas sentado', 4, '6–8'),
      ex('Dominadas asistidas o jalón agarre ancho', 4, '6–8'),
      ex('Remo Pendlay', 4, '5–6'),
      ex('Elevaciones laterales en polea baja', 4, '15–20'),
      ex('Pájaros con mancuernas posterior', 4, '12–15'),
      ex('Face pull', 3, '15–20'),
      ex('Press banca agarre cerrado', 3, '8–10'),
      ex('Curl concentrado', 3, '10–12'),
    ]),
    day('d5', 'Día 5 — Lower (Fuerza + Volumen)', [
      ex('Sentadilla frontal o hack squat', 4, '6–8'),
      ex('Peso muerto convencional', 4, '4–5'),
      ex('Zancadas con mancuernas', 3, '10 c/lado'),
      ex('Curl femoral sentado', 4, '10–12'),
      ex('Abductores máquina', 3, '15'),
      ex('Pantorrilla sentado', 4, '15–20'),
    ]),
  ]
});

const buildAnaRoutine = () => ({
  name: 'Rutina Ana María — Cadena Posterior (Volumen)',
  days: [
    day('d1', 'Día 1 — Espalda (ancho) + Bíceps', [
      ex('Jalón al pecho agarre ancho', 4, '12-15', '60-90s'),
      ex('Remo con barra o máquina', 4, '12-15', '60-90s'),
      ex('Jalón al pecho agarre cerrado', 3, '15', '45-60s'),
      ex('Face pull', 3, '15-20', '45s'),
      ex('Curl con barra o mancuerna', 3, '12-15', '45-60s'),
      ex('Curl martillo', 3, '15', '45s'),
    ]),
    day('d2', 'Día 2 — Glúteo + Femoral', [
      ex('Hip thrust', 5, '12-15', '90s'),
      ex('Peso muerto rumano', 4, '12-15', '90s'),
      ex('Sentadilla búlgara', 4, '12 c/pierna', '75s'),
      ex('Curl femoral en máquina', 4, '15', '60s'),
      ex('Patada de glúteo en polea', 4, '15-20 c/pierna', '45-60s'),
      ex('Abducción de cadera (máquina o banda)', 4, '20', '45s'),
    ]),
    day('d3', 'Día 3 — Tríceps + Pantorrilla', [
      ex('Press francés', 3, '12-15', '60s'),
      ex('Extensión de tríceps en polea', 3, '15', '45-60s'),
      ex('Fondos en banco', 3, '12-15', '60s'),
      ex('Extensión por encima de la cabeza (cuerda)', 3, '15', '45s'),
      ex('Elevación de talones de pie', 4, '15-20', '45s'),
      ex('Elevación de talones sentado', 4, '15-20', '45s'),
    ]),
    day('d4', 'Día 4 — Glúteo + Femoral', [
      ex('Zancadas caminando o hip thrust con barra', 4, '12-15 c/pierna', '75-90s'),
      ex('Peso muerto rumano con mancuernas', 4, '12-15', '90s'),
      ex('Sentadilla sumo o goblet', 3, '15', '75s'),
      ex('Peso muerto a una pierna', 3, '12 c/pierna', '60-75s'),
      ex('Puente de glúteo a una pierna', 3, '15 c/pierna', '45-60s'),
      ex('Abducción de cadera en polea', 3, '20 c/pierna', '45s'),
    ]),
    day('d5', 'Día 5 — Espalda (grosor) + Bíceps + Pantorrilla', [
      ex('Remo con mancuerna', 4, '12-15 c/lado', '60-90s'),
      ex('Remo en máquina o polea baja', 3, '15', '60s'),
      ex('Pull-over', 3, '15', '45-60s'),
      ex('Curl inclinado con mancuerna', 3, '15', '45s'),
      ex('Curl concentrado', 3, '15', '45s'),
      ex('Elevación de talones en prensa', 4, '20', '45s'),
    ]),
  ]
});

const getWeekStart = () => {
  const today = new Date();
  const d = new Date(today);
  const day0 = d.getDay(); // 0 = domingo
  const diff = day0 === 0 ? -6 : 1 - day0;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const todayStr = () => new Date().toISOString().split('T')[0];

const FitnessTracker = () => {
  // ---------- Autenticación ----------
  const [session, setSession] = useState(undefined); // undefined = verificando, null = sin sesión, objeto = logueado
  const [authError, setAuthError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ displayName: '', email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);

  // ---------- Datos del usuario ----------
  const [dataLoading, setDataLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [weeklyWeight, setWeeklyWeight] = useState([]);
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadData = useCallback(async (userId) => {
    setDataLoading(true);
    try {
      const [profileRes, routineRes, sessionsRes, weightRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('routines').select('*').eq('user_id', userId).single(),
        supabase.from('workout_sessions').select('*').eq('user_id', userId).order('date', { ascending: true }),
        supabase.from('body_weight_logs').select('*').eq('user_id', userId).order('date', { ascending: true }),
      ]);

      if (profileRes.error) throw profileRes.error;
      setProfile(profileRes.data);
      setRoutine(routineRes.data ? { name: routineRes.data.name, days: routineRes.data.days } : { name: 'Mi rutina', days: [] });
      setWorkoutSessions(sessionsRes.data || []);
      setWeeklyWeight(weightRes.data || []);

      const { data: otherProfiles } = await supabase.from('profiles').select('*').neq('id', userId).limit(1);
      if (otherProfiles && otherProfiles.length > 0) {
        const partnerProfile = otherProfiles[0];
        const [partnerSessionsRes, partnerWeightRes, partnerRoutineRes] = await Promise.all([
          supabase.from('workout_sessions').select('id, date').eq('user_id', partnerProfile.id),
          supabase.from('body_weight_logs').select('date, weight').eq('user_id', partnerProfile.id).order('date', { ascending: false }).limit(1),
          supabase.from('routines').select('days').eq('user_id', partnerProfile.id).single(),
        ]);
        const weekStart = getWeekStart();
        const sessionsThisWeek = (partnerSessionsRes.data || []).filter(s => new Date(s.date) >= weekStart).length;
        setPartner({
          profile: partnerProfile,
          sessionsThisWeek,
          targetDays: partnerRoutineRes.data?.days?.length || 0,
          currentWeight: partnerWeightRes.data && partnerWeightRes.data[0] ? partnerWeightRes.data[0].weight : null,
        });
      } else {
        setPartner(null);
      }
    } catch (err) {
      alert('Hubo un error cargando tus datos: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      loadData(session.user.id);
    } else {
      setProfile(null);
      setRoutine(null);
      setWorkoutSessions([]);
      setWeeklyWeight([]);
      setPartner(null);
    }
  }, [session?.user?.id, loadData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email.trim(),
      password: loginForm.password,
    });
    if (error) {
      setAuthError(error.message === 'Invalid login credentials' ? 'Correo o contraseña incorrectos' : error.message);
      return;
    }
    setLoginForm({ email: '', password: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setRegisterMessage('');
    if (!registerForm.displayName.trim() || !registerForm.email.trim() || !registerForm.password) {
      setAuthError('Completa todos los campos');
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: registerForm.email.trim(),
      password: registerForm.password,
      options: { data: { display_name: registerForm.displayName.trim() } },
    });
    if (error) {
      setAuthError(error.message);
      return;
    }
    if (!data.session) {
      setRegisterMessage('Cuenta creada. Revisa tu correo y confirma tu cuenta antes de ingresar.');
    }
    setRegisterForm({ displayName: '', email: '', password: '' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ---------- Mutaciones ----------
  const handleSaveSession = async (dayId, dayName, entries) => {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({ user_id: session.user.id, date: todayStr(), day_id: dayId, day_name: dayName, entries })
      .select()
      .single();
    if (error) {
      alert('Error al guardar el entrenamiento: ' + error.message);
      return false;
    }
    setWorkoutSessions(prev => [...prev, data]);
    return true;
  };

  const handleDeleteSession = async (id) => {
    const { error } = await supabase.from('workout_sessions').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }
    setWorkoutSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleAddWeight = async (date, weight) => {
    const { data, error } = await supabase
      .from('body_weight_logs')
      .upsert({ user_id: session.user.id, date, weight }, { onConflict: 'user_id,date' })
      .select()
      .single();
    if (error) {
      alert('Error al guardar el peso: ' + error.message);
      return;
    }
    setWeeklyWeight(prev => {
      const filtered = prev.filter(w => w.date !== date);
      return [...filtered, data].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const handleDeleteWeight = async (date) => {
    const { error } = await supabase.from('body_weight_logs').delete().eq('user_id', session.user.id).eq('date', date);
    if (error) {
      alert('Error al eliminar: ' + error.message);
      return;
    }
    setWeeklyWeight(prev => prev.filter(w => w.date !== date));
  };

  const handleUpdateRoutine = async (newRoutine) => {
    const { data, error } = await supabase
      .from('routines')
      .upsert({ user_id: session.user.id, name: newRoutine.name, days: newRoutine.days }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) {
      alert('Error al guardar la rutina: ' + error.message);
      return;
    }
    setRoutine({ name: data.name, days: data.days });
  };

  // ---------- Pantallas de carga ----------
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <p className="text-white text-xl font-semibold">Cargando...</p>
      </div>
    );
  }

  // ---------- Login / registro ----------
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">💪 Fitness Tracker</h1>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{authError}</div>
          )}
          {registerMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{registerMessage}</div>
          )}

          {!showRegister ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tu contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Ingresar
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">¿No tienes cuenta?</p>
                <button
                  onClick={() => { setShowRegister(true); setAuthError(''); setRegisterMessage(''); }}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Crear nueva cuenta
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={registerForm.displayName}
                    onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Sebas"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  Crear cuenta
                </button>
              </form>
              <button
                onClick={() => { setShowRegister(false); setAuthError(''); setRegisterMessage(''); }}
                className="w-full mt-4 text-gray-600 hover:underline"
              >
                Volver
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ---------- Cargando datos tras login ----------
  if (dataLoading || !profile || !routine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <p className="text-gray-600 text-xl font-semibold">Cargando tus datos...</p>
      </div>
    );
  }

  // ---------- Dashboard ----------
  const weekStart = getWeekStart();
  const sessionsThisWeek = workoutSessions.filter(s => new Date(s.date) >= weekStart);
  const totalExercisesLogged = workoutSessions.reduce((sum, s) => sum + s.entries.length, 0);
  const todaySessions = workoutSessions.filter(s => s.date === todayStr());

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">💪 Fitness Tracker</h1>
            <p className="text-blue-100 text-sm">{routine.name || 'Sin rutina configurada'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{profile.display_name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 p-2 rounded-lg flex items-center gap-2"
            >
              <LogOut size={20} /> Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">DÍAS ENTRENADOS ESTA SEMANA</p>
            <p className="text-4xl font-bold text-blue-500 mt-2">{sessionsThisWeek.length}/{routine.days.length || '-'}</p>
            <p className="text-gray-500 text-xs mt-2">Objetivo: {routine.days.length || 0} días por semana</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">PESO CORPORAL ACTUAL</p>
            <p className="text-4xl font-bold text-purple-500 mt-2">
              {weeklyWeight.length > 0 ? `${weeklyWeight[weeklyWeight.length - 1].weight} kg` : 'Sin datos'}
            </p>
            {weeklyWeight.length > 1 && (
              <p className={`text-xs mt-2 ${weeklyWeight[weeklyWeight.length - 1].weight < weeklyWeight[weeklyWeight.length - 2].weight ? 'text-green-600' : 'text-red-600'}`}>
                {weeklyWeight[weeklyWeight.length - 1].weight < weeklyWeight[weeklyWeight.length - 2].weight ? '↓' : '↑'} {Math.abs(weeklyWeight[weeklyWeight.length - 1].weight - weeklyWeight[weeklyWeight.length - 2].weight).toFixed(1)} kg vs registro anterior
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">EJERCICIOS REGISTRADOS</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{totalExercisesLogged}</p>
            <p className="text-gray-500 text-xs mt-2">En todo el registro</p>
          </div>
        </div>

        {/* Log workout */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Entrenamiento</h2>
          {routine.days.length === 0 ? (
            <p className="text-gray-600">Todavía no tienes una rutina configurada. Ve a "Editar mi rutina" más abajo para crearla.</p>
          ) : (
            <WorkoutLogger routine={routine} onSaveSession={handleSaveSession} />
          )}
        </div>

        {/* Today's sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrenamientos de Hoy</h2>
          <TodaySessions sessions={todaySessions} onDelete={handleDeleteSession} />
        </div>

        {/* Body weight */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Peso Corporal</h2>
          <BodyWeightSection weeklyWeight={weeklyWeight} onAdd={handleAddWeight} onDelete={handleDeleteWeight} />
        </div>

        {/* Exercise progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso por Ejercicio</h2>
          <ExerciseProgressChart routine={routine} sessions={workoutSessions} />
        </div>

        {/* Days distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Distribución de Días Entrenados</h2>
          <DaysChart sessions={workoutSessions} />
        </div>

        {/* Routine editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <RoutineEditor routine={routine} onUpdateRoutine={handleUpdateRoutine} />
        </div>

        {/* Partner summary */}
        {partner && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de {partner.profile.display_name}</h2>
            <PartnerSummary partner={partner} />
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Registrar entrenamiento ----------
const WorkoutLogger = ({ routine, onSaveSession }) => {
  const [selectedDayId, setSelectedDayId] = useState(routine.days[0]?.id || '');
  const selectedDay = routine.days.find(d => d.id === selectedDayId) || routine.days[0];

  const [logState, setLogState] = useState({}); // exerciseId -> {weight, reps}
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedDay) return;
    const initial = {};
    selectedDay.exercises.forEach(exr => {
      initial[exr.id] = { weight: '', reps: '' };
    });
    setLogState(initial);
  }, [selectedDayId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedDay) return <p className="text-gray-600">Selecciona un día</p>;

  const updateField = (exerciseId, field, value) => {
    setLogState(prev => ({
      ...prev,
      [exerciseId]: { ...(prev[exerciseId] || { weight: '', reps: '' }), [field]: value }
    }));
  };

  const saveSession = async () => {
    const entries = selectedDay.exercises
      .filter(exr => logState[exr.id] && logState[exr.id].weight !== '' && logState[exr.id].reps !== '')
      .map(exr => ({
        exerciseId: exr.id,
        name: exr.name,
        targetSets: exr.sets,
        targetReps: exr.reps,
        weight: parseFloat(logState[exr.id].weight),
        reps: parseInt(logState[exr.id].reps, 10)
      }));

    if (entries.length === 0) {
      alert('Registra al menos un ejercicio con peso y repeticiones');
      return;
    }

    setSaving(true);
    const ok = await onSaveSession(selectedDay.id, selectedDay.name, entries);
    setSaving(false);

    if (ok) {
      const reset = {};
      selectedDay.exercises.forEach(exr => {
        reset[exr.id] = { weight: '', reps: '' };
      });
      setLogState(reset);
      alert('Entrenamiento guardado');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Día de rutina</label>
        <select
          value={selectedDayId}
          onChange={(e) => setSelectedDayId(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {routine.days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {selectedDay.exercises.map(exr => (
          <div key={exr.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-baseline mb-3">
              <h3 className="font-bold text-gray-800">{exr.name}</h3>
              <span className="text-sm text-gray-500">
                Objetivo: {exr.sets}x{exr.reps}{exr.rest ? ` · descanso ${exr.rest}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={logState[exr.id]?.weight ?? ''}
                onChange={(e) => updateField(exr.id, 'weight', e.target.value)}
                placeholder="Peso (kg)"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={logState[exr.id]?.reps ?? ''}
                onChange={(e) => updateField(exr.id, 'reps', e.target.value)}
                placeholder="Repeticiones"
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={saveSession}
        disabled={saving}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar Entrenamiento'}
      </button>
    </div>
  );
};

// ---------- Entrenamientos de hoy ----------
const TodaySessions = ({ sessions, onDelete }) => {
  if (sessions.length === 0) {
    return <p className="text-gray-600">No hay entrenamientos registrados para hoy</p>;
  }

  return (
    <div className="space-y-3">
      {sessions.map(session => (
        <div key={session.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <p className="font-bold text-lg text-gray-800">{session.day_name}</p>
            <button onClick={() => onDelete(session.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="mt-2 space-y-1">
            {session.entries.map((en, idx) => (
              <p key={idx} className="text-gray-700">
                • {en.name}: <span className="font-bold text-purple-600">{en.weight}kg x{en.reps}</span>
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ---------- Peso corporal ----------
const BodyWeightSection = ({ weeklyWeight, onAdd, onDelete }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayStr());
  const [saving, setSaving] = useState(false);

  const addWeight = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Ingresa un peso válido');
      return;
    }
    setSaving(true);
    await onAdd(date, parseFloat(weight));
    setSaving(false);
    setWeight('');
  };

  const chartData = weeklyWeight.map(w => ({ ...w, label: w.date }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-2">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Ej: 74.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addWeight}
          disabled={saving}
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={20} /> Registrar
        </button>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="weight" name="Peso (kg)" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-600">Sin registros de peso aún</p>
      )}

      {weeklyWeight.length > 0 && (
        <div className="max-h-40 overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {[...weeklyWeight].reverse().map(w => (
                <tr key={w.date} className="border-b border-gray-100">
                  <td className="py-1.5 text-gray-600">{w.date}</td>
                  <td className="py-1.5 font-semibold">{w.weight} kg</td>
                  <td className="py-1.5 text-right">
                    <button onClick={() => onDelete(w.date)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ---------- Progreso por ejercicio ----------
const ExerciseProgressChart = ({ routine, sessions }) => {
  const exerciseNames = Array.from(new Set(routine.days.flatMap(d => d.exercises.map(e => e.name))));
  const [selected, setSelected] = useState(exerciseNames[0] || '');

  useEffect(() => {
    if (!exerciseNames.includes(selected) && exerciseNames.length > 0) {
      setSelected(exerciseNames[0]);
    }
  }, [exerciseNames.join('|')]); // eslint-disable-line react-hooks/exhaustive-deps

  if (exerciseNames.length === 0) {
    return <p className="text-gray-600">Configura tu rutina para ver el progreso por ejercicio</p>;
  }

  const data = sessions
    .filter(s => s.entries.some(en => en.name === selected))
    .map(s => {
      const entry = s.entries.find(en => en.name === selected);
      return { date: s.date, pesoMax: entry.weight, repsMax: entry.reps };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-4">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {exerciseNames.map(n => <option key={n} value={n}>{n}</option>)}
      </select>

      {data.length === 0 ? (
        <p className="text-gray-600">Sin registros para este ejercicio todavía</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="pesoMax" name="Peso (kg)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="repsMax" name="Repeticiones" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// ---------- Distribución de días ----------
const DaysChart = ({ sessions }) => {
  const dayCount = {};
  sessions.forEach(s => {
    dayCount[s.day_name] = (dayCount[s.day_name] || 0) + 1;
  });

  const data = Object.entries(dayCount).map(([name, value]) => ({ name, value }));
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  if (data.length === 0) return <p className="text-gray-600">Sin datos aún</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name} (${value})`} outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ---------- Editor de rutina ----------
const RoutineEditor = ({ routine, onUpdateRoutine }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(routine);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(routine);
    setDirty(false);
  }, [routine]);

  const updateDraft = (updater) => {
    setDraft(prev => updater(prev));
    setDirty(true);
  };

  const updateRoutineName = (name) => updateDraft(prev => ({ ...prev, name }));

  const addDay = () => updateDraft(prev => ({
    ...prev,
    days: [...prev.days, { id: `d${Date.now()}`, name: `Día ${prev.days.length + 1}`, exercises: [] }]
  }));

  const updateDayName = (dayId, name) => {
    updateDraft(prev => ({ ...prev, days: prev.days.map(d => d.id === dayId ? { ...d, name } : d) }));
  };

  const deleteDay = (dayId) => {
    if (!window.confirm('¿Eliminar este día de la rutina?')) return;
    updateDraft(prev => ({ ...prev, days: prev.days.filter(d => d.id !== dayId) }));
  };

  const addExercise = (dayId) => {
    updateDraft(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId
        ? { ...d, exercises: [...d.exercises, { id: `e${Date.now()}`, name: 'Nuevo ejercicio', sets: 3, reps: '10-12', rest: null }] }
        : d)
    }));
  };

  const updateExercise = (dayId, exId, field, value) => {
    updateDraft(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId
        ? { ...d, exercises: d.exercises.map(e => e.id === exId ? { ...e, [field]: value } : e) }
        : d)
    }));
  };

  const deleteExercise = (dayId, exId) => {
    updateDraft(prev => ({
      ...prev,
      days: prev.days.map(d => d.id === dayId
        ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) }
        : d)
    }));
  };

  const loadTemplate = (builder) => {
    if (draft.days.length > 0 && !window.confirm('Esto reemplazará tu rutina actual. ¿Continuar?')) return;
    setDraft(builder());
    setDirty(true);
  };

  const saveChanges = async () => {
    setSaving(true);
    await onUpdateRoutine(draft);
    setSaving(false);
    setDirty(false);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-2xl font-bold text-gray-800 mb-4"
      >
        <span>Editar Mi Rutina</span>
        {open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>

      {open && (
        <div className="space-y-6">
          {draft.days.length === 0 && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <p className="text-gray-700 text-sm">Puedes empezar desde cero o cargar una rutina de ejemplo para editar:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => loadTemplate(buildSebasRoutine)}
                  className="bg-white border border-blue-300 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-100"
                >
                  Usar rutina de Sebas
                </button>
                <button
                  onClick={() => loadTemplate(buildAnaRoutine)}
                  className="bg-white border border-blue-300 text-blue-600 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-100"
                >
                  Usar rutina de Ana María
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nombre de la rutina</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => updateRoutineName(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {draft.days.map(d => (
            <div key={d.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={d.name}
                  onChange={(e) => updateDayName(d.id, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={() => deleteDay(d.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2">
                {d.exercises.map(exr => (
                  <div key={exr.id} className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded">
                    <input
                      type="text"
                      value={exr.name}
                      onChange={(e) => updateExercise(d.id, exr.id, 'name', e.target.value)}
                      className="flex-1 min-w-[140px] px-2 py-1 border border-gray-300 rounded"
                      placeholder="Nombre del ejercicio"
                    />
                    <input
                      type="number"
                      value={exr.sets}
                      onChange={(e) => updateExercise(d.id, exr.id, 'sets', parseInt(e.target.value, 10) || 0)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                      placeholder="Series"
                      title="Series"
                    />
                    <span className="text-gray-500">x</span>
                    <input
                      type="text"
                      value={exr.reps}
                      onChange={(e) => updateExercise(d.id, exr.id, 'reps', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                      placeholder="Reps"
                      title="Repeticiones"
                    />
                    <input
                      type="text"
                      value={exr.rest || ''}
                      onChange={(e) => updateExercise(d.id, exr.id, 'rest', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                      placeholder="Descanso"
                      title="Descanso (opcional)"
                    />
                    <button onClick={() => deleteExercise(d.id, exr.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addExercise(d.id)}
                className="mt-3 text-blue-500 text-sm font-semibold hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Agregar ejercicio
              </button>
            </div>
          ))}

          <button
            onClick={addDay}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Agregar día de rutina
          </button>

          <button
            onClick={saveChanges}
            disabled={!dirty || saving}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Rutina'}
          </button>
        </div>
      )}
    </div>
  );
};

// ---------- Resumen pareja ----------
const PartnerSummary = ({ partner }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
      <h3 className="font-bold text-gray-800 mb-3">Esta Semana</h3>
      <p className="text-3xl font-bold text-blue-500">{partner.sessionsThisWeek}/{partner.targetDays || '-'}</p>
      <p className="text-gray-600 text-sm">Días entrenados</p>
    </div>
    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
      <h3 className="font-bold text-gray-800 mb-3">Peso Actual</h3>
      <p className="text-3xl font-bold text-purple-500">{partner.currentWeight ?? 'N/A'}</p>
      <p className="text-gray-600 text-sm">kg</p>
    </div>
  </div>
);

export default FitnessTracker;
