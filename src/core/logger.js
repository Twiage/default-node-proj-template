import { createLogger, format, transports } from 'winston';

const { timestamp, combine, json } = format;

export const setup = () => createLogger({
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
});

export default setup();
