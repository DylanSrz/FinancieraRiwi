import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { Env } from '../config/env.validation.js';

export interface Correo {
  para: string | string[];
  asunto: string;
  html: string;
}

/**
 * Envío de correos con Resend (ADR-008).
 * Sin RESEND_API_KEY (desarrollo local) los correos se registran en el log en lugar de enviarse.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;
  private readonly remitente: string;

  constructor(config: ConfigService<Env, true>) {
    const apiKey = config.get('RESEND_API_KEY', { infer: true });
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.remitente = config.get('MAIL_FROM', { infer: true });
  }

  async enviar({ para, asunto, html }: Correo): Promise<{ id: string | null }> {
    if (!this.resend) {
      this.logger.warn(
        `[correo simulado] para=${String(para)} asunto="${asunto}"`,
      );
      return { id: null };
    }
    const { data, error } = await this.resend.emails.send({
      from: this.remitente,
      to: para,
      subject: asunto,
      html,
    });
    if (error) {
      this.logger.error(
        `Error enviando correo a ${String(para)}: ${error.message}`,
      );
      throw new Error(error.message);
    }
    return { id: data?.id ?? null };
  }
}
