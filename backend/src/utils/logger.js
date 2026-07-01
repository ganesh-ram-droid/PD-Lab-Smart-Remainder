const formatMeta = (meta) => {
  if (!meta) {
    return '';
  }

  if (meta instanceof Error) {
    return ` ${meta.stack || meta.message}`;
  }

  return ` ${JSON.stringify(meta)}`;
};

const logger = {
  info(message, meta) {
    console.info(`[INFO] ${message}${formatMeta(meta)}`);
  },
  warn(message, meta) {
    console.warn(`[WARN] ${message}${formatMeta(meta)}`);
  },
  error(message, meta) {
    console.error(`[ERROR] ${message}${formatMeta(meta)}`);
  }
};

module.exports = logger;
