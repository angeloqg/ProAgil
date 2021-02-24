export const environmentProd = {
  production: true,
  apiUrl: 'http://localhost:5000/',
  enableDebug: false
};

export const environment = {
  production: true,
  apiUrl: environmentProd.apiUrl,
  enableDebug: false
};
 