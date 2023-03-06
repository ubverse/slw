import { Logger as WinstonLogger, transports as transport, format as fmt, createLogger } from 'winston'
import { Format } from 'logform'

export interface ILoggerConfig {
  isDev?: boolean
  label?: string
}

export default class Logger {
  private readonly isDev: boolean
  private readonly label: string
  private readonly logger: WinstonLogger

  public constructor (config: ILoggerConfig) {
    this.isDev = Boolean(config.isDev)
    this.label = config.label ?? ''

    const transports: transport.StreamTransportInstance[] = []
    transports.push(this.createConsoleLogger())

    this.logger = createLogger({ transports })
  }

  private createConsoleLogger (): transport.ConsoleTransportInstance {
    const consoleFormats = [
      /* . */

      fmt.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      fmt.label({ label: this.label }),

      /* . */

      this.isDev ? fmt.colorize({ all: true }) : undefined,

      /* . */

      this.label === ''
        ? fmt.printf((i) => `${i.timestamp as string} ${i.level}: ${i.message as string}`)
        : fmt.printf((i) => `${i.timestamp as string} (${i.label as string}) -- ${i.level}: ${i.message as string}`)

      /* . */
    ].filter((f: Format | undefined) => f !== undefined)

    return new transport.Console({ format: fmt.combine(...(consoleFormats as Format[])) })
  }

  public info (message: string, data?: any): void {
    this.logger.info(message, data)
  }

  public warn (message: string, data?: any): void {
    this.logger.warn(message, data)
  }

  public error (message: string, data?: any): void {
    this.logger.error(message, data)
  }
}
