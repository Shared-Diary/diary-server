const LOCALHOST = /^https?:\/\/((localhost)|(127\.0\.0\.1)):3\d{3}$/;

export const corsOptions = {
  origin: LOCALHOST,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'Authorization',
    'X-Auth-Token',
    'X-Secret-Key',
  ],
  credentials: true,
};
