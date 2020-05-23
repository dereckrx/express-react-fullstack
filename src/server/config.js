export function Config() {
  const port = process.env.PORT || 7777;
  const isProduction = process.env.NODE_ENV == `production`;
  const mongoUri =
    process.env.MONGODB_URI || `mongodb://localhost:27017/organizer`;

  return {
    port,
    mongoUri,
    isProduction,
  };
}
