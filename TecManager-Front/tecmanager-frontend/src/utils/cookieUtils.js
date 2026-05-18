// ── Guardar una cookie ──
export function setCookie(nombre, valor, diasExpiracion = 1) {
  const fecha = new Date();
  fecha.setTime(fecha.getTime() + diasExpiracion * 24 * 60 * 60 * 1000);
  const expira = `expires=${fecha.toUTCString()}`;
  document.cookie = `${nombre}=${encodeURIComponent(valor)};${expira};path=/;SameSite=Strict`;
}

// ── Leer una cookie ──
export function getCookie(nombre) {
  const nombreBuscado = `${nombre}=`;
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nombreBuscado)) {
      return decodeURIComponent(cookie.substring(nombreBuscado.length));
    }
  }
  return null;
}

// ── Eliminar una cookie ──
export function deleteCookie(nombre) {
  document.cookie = `${nombre}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
}

// ── Verificar si el token en cookie está expirado ──
export function tokenCookieExpirado() {
  const token = getCookie('token');
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}