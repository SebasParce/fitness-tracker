# 🚀 Desplegar a GitHub y Vercel

## Paso 1: Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en "+" → "New repository"
3. Nombre: `fitness-tracker`
4. Descripción: "App para controlar peso y rutina de ejercicios"
5. Click "Create repository"
6. Copia la URL HTTPS que aparece

## Paso 2: Subir código a GitHub

En tu terminal (en la carpeta `fitness-tracker`):

```bash
# Inicializar Git
git init

# Agregar archivos
git add .

# Hacer commit
git commit -m "Initial commit: fitness tracker app"

# Cambiar nombre de rama
git branch -M main

# Conectar con GitHub (reemplaza URL)
git remote add origin https://github.com/TU_USUARIO/fitness-tracker.git

# Subir código
git push -u origin main
```

## Paso 3: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click "Sign up" (si no tienes cuenta)
3. Conecta con GitHub
4. Click "Import Project"
5. Selecciona el repositorio `fitness-tracker`
6. Click "Import"
7. Espera a que termine el deploy
8. ¡Listo! Tu app estará en una URL como: `fitness-tracker-123abc.vercel.app`

## Paso 4: Uso

- Accede desde tu URL de Vercel
- Comparte el link con tu esposa
- Ambos pueden crear sus cuentas o usar las de demo

## Si necesitas hacer cambios

```bash
# Editar archivos localmente
# Luego:
git add .
git commit -m "Descripción de cambios"
git push

# Vercel se actualiza automáticamente
```

---

**Nota**: Los datos se guardan en el navegador (localStorage), no en servidor. Si limpias el navegador, se pierden los datos.
