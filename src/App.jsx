import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, LogOut, Eye, EyeOff } from 'lucide-react';

const FitnessTracker = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [users, setUsers] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('fitnessUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Demo data
      const demoUsers = {
        'sebas': {
          password: 'sebas123',
          workouts: [
            { id: 1, date: new Date(Date.now() - 6 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Lunes', exercises: [{ name: 'Pecho', weight: 80 }, { name: 'Tríceps', weight: 20 }], completed: true },
            { id: 2, date: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Martes', exercises: [{ name: 'Espalda', weight: 90 }, { name: 'Bíceps', weight: 25 }], completed: true },
            { id: 3, date: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Miércoles', exercises: [{ name: 'Piernas', weight: 100 }], completed: true },
            { id: 4, date: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Viernes', exercises: [{ name: 'Hombros', weight: 60 }], completed: true },
            { id: 5, date: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Sábado', exercises: [], completed: false },
          ],
          weeklyWeight: [
            { week: 'Semana 1', weight: 75.5 },
            { week: 'Semana 2', weight: 74.8 },
            { week: 'Semana 3', weight: 74.2 },
          ]
        },
        'esposa': {
          password: 'esposa123',
          workouts: [
            { id: 1, date: new Date(Date.now() - 6 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Lunes', exercises: [{ name: 'Glúteos', weight: 40 }], completed: true },
            { id: 2, date: new Date(Date.now() - 5 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Miércoles', exercises: [{ name: 'Piernas', weight: 60 }], completed: true },
            { id: 3, date: new Date(Date.now() - 4 * 24 * 60 * 60000).toISOString().split('T')[0], day: 'Viernes', exercises: [{ name: 'Cardio', weight: 0 }], completed: true },
          ],
          weeklyWeight: [
            { week: 'Semana 1', weight: 62.0 },
            { week: 'Semana 2', weight: 61.5 },
            { week: 'Semana 3', weight: 61.2 },
          ]
        }
      };
      setUsers(demoUsers);
      localStorage.setItem('fitnessUsers', JSON.stringify(demoUsers));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (users[loginForm.username] && users[loginForm.username].password === loginForm.password) {
      setCurrentUser(loginForm.username);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      alert('Complete todos los campos');
      return;
    }
    if (users[newUsername]) {
      alert('El usuario ya existe');
      return;
    }
    const updatedUsers = {
      ...users,
      [newUsername]: {
        password: newPassword,
        workouts: [],
        weeklyWeight: []
      }
    };
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));
    setNewUsername('');
    setNewPassword('');
    setShowRegister(false);
    alert('Cuenta creada exitosamente');
  };

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
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
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
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
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
                <p className="text-xs text-gray-600">Usuario: <strong>esposa</strong> | Contraseña: <strong>esposa123</strong></p>
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
  const allWorkouts = userData.workouts || [];
  const weeklyWeight = userData.weeklyWeight || [];

  const getThisWeekWorkouts = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return allWorkouts.filter(w => new Date(w.date) >= startOfWeek);
  };

  const completedThisWeek = getThisWeekWorkouts().filter(w => w.completed).length;
  const otherUser = Object.keys(users).find(u => u !== currentUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">💪 Fitness Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{currentUser}</span>
            <button
              onClick={() => setCurrentUser(null)}
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
            <p className="text-gray-600 text-sm font-semibold">RUTINAS ESTA SEMANA</p>
            <p className="text-4xl font-bold text-blue-500 mt-2">{completedThisWeek}/4</p>
            <p className="text-gray-500 text-xs mt-2">Objetivo: 4+ veces por semana</p>
          </div>
          {weeklyWeight.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold">PESO ACTUAL</p>
              <p className="text-4xl font-bold text-purple-500 mt-2">{weeklyWeight[weeklyWeight.length - 1].weight} kg</p>
              {weeklyWeight.length > 1 && (
                <p className={`text-xs mt-2 ${weeklyWeight[weeklyWeight.length - 1].weight < weeklyWeight[weeklyWeight.length - 2].weight ? 'text-green-600' : 'text-red-600'}`}>
                  {weeklyWeight[weeklyWeight.length - 1].weight < weeklyWeight[weeklyWeight.length - 2].weight ? '↓' : '↑'} {Math.abs(weeklyWeight[weeklyWeight.length - 1].weight - weeklyWeight[weeklyWeight.length - 2].weight).toFixed(1)} kg vs semana anterior
                </p>
              )}
            </div>
          )}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">TOTAL EJERCICIOS</p>
            <p className="text-4xl font-bold text-green-500 mt-2">{allWorkouts.reduce((sum, w) => sum + w.exercises.length, 0)}</p>
            <p className="text-gray-500 text-xs mt-2">En todo el registro</p>
          </div>
        </div>

        {/* Add New Workout */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Hoy</h2>
          <AddWorkoutForm currentUser={currentUser} users={users} setUsers={setUsers} />
        </div>

        {/* Today's Workouts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Entrenamientos Hoy</h2>
          <WorkoutsList currentUser={currentUser} users={users} setUsers={setUsers} />
        </div>

        {/* Weight Chart */}
        {weeklyWeight.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Evolución de Peso</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyWeight}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Exercises Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Distribución de Ejercicios</h2>
          <ExercisesChart workouts={allWorkouts} />
        </div>

        {/* View Other User */}
        {otherUser && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumen de {otherUser}</h2>
            <OtherUserSummary user={otherUser} userData={users[otherUser]} />
          </div>
        )}
      </div>
    </div>
  );
};

const AddWorkoutForm = ({ currentUser, users, setUsers }) => {
  const [day, setDay] = useState('Lunes');
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [exercises, setExercises] = useState([]);

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const addExercise = () => {
    if (exercise && weight) {
      setExercises([...exercises, { name: exercise, weight: parseFloat(weight) }]);
      setExercise('');
      setWeight('');
    }
  };

  const saveWorkout = () => {
    if (exercises.length === 0) {
      alert('Agrega al menos un ejercicio');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newWorkout = {
      id: Date.now(),
      date: today,
      day,
      exercises,
      completed: true
    };

    const updatedUsers = { ...users };
    updatedUsers[currentUser].workouts.push(newWorkout);
    setUsers(updatedUsers);
    localStorage.setItem('fitnessUsers', JSON.stringify(updatedUsers));

    setExercises([]);
    setExercise('');
    setWeight('');
    alert('Entrenamiento guardado');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Día</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {days.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Ejercicio</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Ej: Pecho, Espalda"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Peso (kg)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Ej: 80"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addExercise}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-semibold flex items-center gap-2"
            >
              <Plus size={20} /> Agregar
            </button>
          </div>
        </div>
      </div>

      {exercises.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-2">Ejercicios agregados:</h3>
          <div className="space-y-2">
            {exercises.map((ex, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded">
                <span className="font-semibold">{ex.name} - {ex.weight} kg</span>
                <button
                  onClick={() => setExercises(exercises.filter((_, i) => i !== idx))}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={saveWorkout}
            className="w-full mt-4 bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition"
          >
            Guardar Entrenamiento
          </button>
        </div>
      )}
    </div>
  );
};

const WorkoutsList = ({ currentUser, users, setUsers }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayWorkouts = users[currentUser].workouts.filter(w => w.date === today);

  if (todayWorkouts.length === 0) {
    return <p className="text-gray-600">No hay entrenamientos registrados para hoy</p>;
  }

  return (
    <div className="space-y-3">
      {todayWorkouts.map(workout => (
        <div key={workout.id} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p className="font-bold text-lg text-gray-800">{workout.day}</p>
          <div className="mt-2 space-y-1">
            {workout.exercises.map((ex, idx) => (
              <p key={idx} className="text-gray-700">• {ex.name}: <span className="font-bold text-purple-600">{ex.weight} kg</span></p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const ExercisesChart = ({ workouts }) => {
  const exerciseCount = {};
  workouts.forEach(w => {
    w.exercises.forEach(ex => {
      exerciseCount[ex.name] = (exerciseCount[ex.name] || 0) + 1;
    });
  });

  const data = Object.entries(exerciseCount).map(([name, count]) => ({ name, value: count }));
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

const OtherUserSummary = ({ user, userData }) => {
  const completedThisWeek = userData.workouts.filter(w => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    return w.completed && new Date(w.date) >= startOfWeek;
  }).length;

  const currentWeight = userData.weeklyWeight.length > 0 ? userData.weeklyWeight[userData.weeklyWeight.length - 1].weight : 'N/A';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3">Esta Semana</h3>
        <p className="text-3xl font-bold text-blue-500">{completedThisWeek}/4</p>
        <p className="text-gray-600 text-sm">Entrenamientos completados</p>
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
