import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, LogOut, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'fitnessUsers_v2';
const SESSION_KEY = 'fitnessSession_v1';

// ---------- Helpers para definir rutinas ----------
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
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [users, setUsers] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    let loadedUsers;
    if (saved) {
      loadedUsers = JSON.parse(saved);
      setUsers(loadedUsers);
    } else {
      const demoUsers = {
        sebas: {
          password: 'sebas123',
          displayName: 'Sebas',
          routine: buildSebasRoutine(),
          weeklyWeight: [
            { date: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0], weight: 75.5 },
            { date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], weight: 74.8 },
            { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], weight: 74.2 },
          ],
          sessions: []
        },
        anamaria: {
          password: 'ana123',
          displayName: 'Ana María',
          routine: buildAnaRoutine(),
          weeklyWeight: [
            { date: new Date(Date.now() - 21 * 86400000).toISOString().split('T')[0], weight: 62.0 },
            { date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0], weight: 61.5 },
            { date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], weight: 61.2 },
          ],
          sessions: []
        }
      };
      loadedUsers = demoUsers;
      setUsers(demoUsers);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
    }

    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession && loadedUsers[savedSession]) {
      setCurrentUser(savedSession);
    }

    setLoaded(true);
  }, []);

  const persist = (updated) => {
    setUsers(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const uname = loginForm.username.trim().toLowerCase();
    if (users[uname] && users[uname].password === loginForm.password) {
      setCurrentUser(uname);
      localStorage.setItem(SESSION_KEY, uname);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const uname = newUsername.trim().toLowerCase();
    if (!uname || !newPassword) {
      alert('Complete todos los campos');
      return;
    }
    if (users[uname]) {
      alert('El usuario ya existe');
      return;
    }
    const updated = {
      ...users,
      [uname]: {
        password: newPassword,
        displayName: newUsername.trim(),
        routine: { name: 'Mi rutina', days: [] },
        weeklyWeight: [],
        sessions: []
      }
    };
    persist(updated);
    setNewUsername('');
    setNewPassword('');
    setShowRegister(false);
    alert('Cuenta creada. Ve a "Editar mi rutina" para armar tus días de entrenamiento.');
  };

  if (!loaded) return null;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">💪 Fitness Tracker</h1>

          {!showRegister ? (
            <>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Usuario</label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu usuario"
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
                  onClick={() => setShowRegister(true)}
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Crear nueva cuenta
                </button>
              </div>
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-2">Demo:</p>
                <p className="text-xs text-gray-600">Usuario: <strong>sebas</strong> | Contraseña: <strong>sebas123</strong></p>
                <p className="text-xs text-gray-600">Usuario: <strong>anamaria</strong> | Contraseña: <strong>ana123</strong></p>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nuevo usuario</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: sebas"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tu contraseña"
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
                onClick={() => setShowRegister(false)}
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

  const userData = users[currentUser];
  const sessions = userData.sessions || [];
  const weeklyWeight = userData.weeklyWeight || [];
  const routine = userData.routine || { name: '', days: [] };

  const weekStart = getWeekStart();
  const sessionsThisWeek = sessions.filter(s => new Date(s.date) >= weekStart);
  const totalExercisesLogged = sessions.reduce((sum, s) => sum + s.entries.length, 0);
  const otherUser = Object.keys(users).find(u => u !== currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">💪 Fitness Tracker</h1>
            <p className="text-blue-100 text-sm">{routine.name || 'Sin rutina configurada'}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{userData.displayName || currentUser}</span>
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
            <WorkoutLogger currentUser={currentUser} users={users} persist={persist} routine={routine} />
          )}
        </div>

        {/* Today's sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrenamientos de Hoy</h2>
          <TodaySessions currentUser={currentUser} users={users} persist={persist} />
        </div>

        {/* Body weight */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Peso Corporal</h2>
          <BodyWeightSection currentUser={currentUser} users={users} persist={persist} weeklyWeight={weeklyWeight} />
        </div>

        {/* Exercise progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Progreso por Ejercicio</h2>
          <ExerciseProgressChart routine={routine} sessions={sessions} />
        </div>

        {/* Days distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Distribución de Días Entrenados</h2>
          <DaysChart sessions={sessions} />
        </div>

        {/* Routine editor */}
        <div className="bg-white rounded-lg shadow p-6">
          <RoutineEditor currentUser={currentUser} users={users} persist={persist} />
        </div>

        {/* Partner summary */}
        {otherUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de {users[otherUser].displayName || otherUser}</h2>
            <OtherUserSummary userData={users[otherUser]} />
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Registrar entrenamiento ----------
const WorkoutLogger = ({ currentUser, users, persist, routine }) => {
  const [selectedDayId, setSelectedDayId] = useState(routine.days[0]?.id || '');
  const selectedDay = routine.days.find(d => d.id === selectedDayId) || routine.days[0];

  const [logState, setLogState] = useState({}); // exerciseId -> {weight, reps}

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

  const saveSession = () => {
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

    const newSession = {
      id: Date.now(),
      date: todayStr(),
      dayId: selectedDay.id,
      dayName: selectedDay.name,
      entries
    };

    const updated = { ...users };
    updated[currentUser] = {
      ...updated[currentUser],
      sessions: [...(updated[currentUser].sessions || []), newSession]
    };
    persist(updated);

    const reset = {};
    selectedDay.exercises.forEach(exr => {
      reset[exr.id] = { weight: '', reps: '' };
    });
    setLogState(reset);
    alert('Entrenamiento guardado');
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
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition"
      >
        Guardar Entrenamiento
      </button>
    </div>
  );
};

// ---------- Entrenamientos de hoy ----------
const TodaySessions = ({ currentUser, users, persist }) => {
  const today = todayStr();
  const todaySessions = (users[currentUser].sessions || []).filter(s => s.date === today);

  const deleteSession = (id) => {
    const updated = { ...users };
    updated[currentUser] = {
      ...updated[currentUser],
      sessions: updated[currentUser].sessions.filter(s => s.id !== id)
    };
    persist(updated);
  };

  if (todaySessions.length === 0) {
    return <p className="text-gray-600">No hay entrenamientos registrados para hoy</p>;
  }

  return (
    <div className="space-y-3">
      {todaySessions.map(session => (
        <div key={session.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <p className="font-bold text-lg text-gray-800">{session.dayName}</p>
            <button onClick={() => deleteSession(session.id)} className="text-red-500 hover:text-red-700">
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
const BodyWeightSection = ({ currentUser, users, persist, weeklyWeight }) => {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayStr());

  const addWeight = () => {
    if (!weight || isNaN(parseFloat(weight))) {
      alert('Ingresa un peso válido');
      return;
    }
    const updated = { ...users };
    const list = [...(updated[currentUser].weeklyWeight || [])];
    const existingIdx = list.findIndex(w => w.date === date);
    const entry = { date, weight: parseFloat(weight) };
    if (existingIdx >= 0) {
      list[existingIdx] = entry;
    } else {
      list.push(entry);
    }
    list.sort((a, b) => a.date.localeCompare(b.date));
    updated[currentUser] = { ...updated[currentUser], weeklyWeight: list };
    persist(updated);
    setWeight('');
  };

  const deleteWeight = (d) => {
    const updated = { ...users };
    updated[currentUser] = {
      ...updated[currentUser],
      weeklyWeight: updated[currentUser].weeklyWeight.filter(w => w.date !== d)
    };
    persist(updated);
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
          className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-semibold flex items-center gap-2"
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
                    <button onClick={() => deleteWeight(w.date)} className="text-red-400 hover:text-red-600">
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
    dayCount[s.dayName] = (dayCount[s.dayName] || 0) + 1;
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
const RoutineEditor = ({ currentUser, users, persist }) => {
  const [open, setOpen] = useState(false);
  const routine = users[currentUser].routine || { name: '', days: [] };

  const updateRoutine = (newRoutine) => {
    const updated = { ...users };
    updated[currentUser] = { ...updated[currentUser], routine: newRoutine };
    persist(updated);
  };

  const updateRoutineName = (name) => updateRoutine({ ...routine, name });

  const addDay = () => {
    const newDay = { id: `d${Date.now()}`, name: `Día ${routine.days.length + 1}`, exercises: [] };
    updateRoutine({ ...routine, days: [...routine.days, newDay] });
  };

  const updateDayName = (dayId, name) => {
    updateRoutine({ ...routine, days: routine.days.map(d => d.id === dayId ? { ...d, name } : d) });
  };

  const deleteDay = (dayId) => {
    if (!window.confirm('¿Eliminar este día de la rutina?')) return;
    updateRoutine({ ...routine, days: routine.days.filter(d => d.id !== dayId) });
  };

  const addExercise = (dayId) => {
    updateRoutine({
      ...routine,
      days: routine.days.map(d => d.id === dayId
        ? { ...d, exercises: [...d.exercises, { id: `e${Date.now()}`, name: 'Nuevo ejercicio', sets: 3, reps: '10-12', rest: null }] }
        : d)
    });
  };

  const updateExercise = (dayId, exId, field, value) => {
    updateRoutine({
      ...routine,
      days: routine.days.map(d => d.id === dayId
        ? { ...d, exercises: d.exercises.map(e => e.id === exId ? { ...e, [field]: value } : e) }
        : d)
    });
  };

  const deleteExercise = (dayId, exId) => {
    updateRoutine({
      ...routine,
      days: routine.days.map(d => d.id === dayId
        ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) }
        : d)
    });
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
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nombre de la rutina</label>
            <input
              type="text"
              value={routine.name}
              onChange={(e) => updateRoutineName(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {routine.days.map(d => (
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
        </div>
      )}
    </div>
  );
};

// ---------- Resumen pareja ----------
const OtherUserSummary = ({ userData }) => {
  const weekStart = getWeekStart();
  const completedThisWeek = (userData.sessions || []).filter(s => new Date(s.date) >= weekStart).length;
  const target = userData.routine?.days?.length || 0;
  const weeklyWeight = userData.weeklyWeight || [];
  const currentWeight = weeklyWeight.length > 0 ? weeklyWeight[weeklyWeight.length - 1].weight : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">Esta Semana</h3>
        <p className="text-3xl font-bold text-blue-500">{completedThisWeek}/{target || '-'}</p>
        <p className="text-gray-600 text-sm">Días entrenados</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">Peso Actual</h3>
        <p className="text-3xl font-bold text-purple-500">{currentWeight}</p>
        <p className="text-gray-600 text-sm">kg</p>
      </div>
    </div>
  );
};

export default FitnessTracker;
