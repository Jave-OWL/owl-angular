export const environment = {
  production: false,
  apiUrl: '/api',  // Usará el proxy de nginx en Docker
  jwtSecretKey: '${JWT_SECRET_KEY}'
};
