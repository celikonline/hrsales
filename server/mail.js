import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';
export function createMailer(store, config) {
  const transport = config.smtpHost
    ? nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure,
        ...(config.smtpUser ? { auth: { user: config.smtpUser, pass: config.smtpPassword } } : {}),
      })
    : null;
  let busy = false;
  return {
    enqueue(recipient, subject, body) {
      if (!recipient) return;
      store.db
        .prepare('INSERT INTO outbox(id,recipient,subject,body,next_at) VALUES(?,?,?,?,?)')
        .run(randomUUID(), recipient, subject, body, new Date().toISOString());
    },
    async flush() {
      if (!transport || busy) return;
      busy = true;
      try {
        const pending = store.db
          .prepare(
            "SELECT * FROM outbox WHERE status IN ('pending','retry') AND next_at <= ? ORDER BY next_at LIMIT 10",
          )
          .all(new Date().toISOString());
        for (const message of pending) {
          try {
            await transport.sendMail({
              from: config.mailFrom,
              to: message.recipient,
              subject: message.subject,
              text: message.body,
            });
            store.db
              .prepare(
                "UPDATE outbox SET status='sent',sent_at=?,body='',last_error=NULL WHERE id=?",
              )
              .run(new Date().toISOString(), message.id);
          } catch {
            const attempts = message.attempts + 1;
            store.db
              .prepare('UPDATE outbox SET status=?,attempts=?,next_at=?,last_error=? WHERE id=?')
              .run(
                attempts >= 8 ? 'failed' : 'retry',
                attempts,
                new Date(Date.now() + Math.min(3600000, 30000 * 2 ** attempts)).toISOString(),
                'SMTP teslimatı başarısız; servis ayarlarını kontrol edin.',
                message.id,
              );
          }
        }
      } finally {
        busy = false;
      }
    },
    get configured() {
      return !!transport;
    },
  };
}
