import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export function createStore(path = 'data/senseik.sqlite') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, email TEXT NOT NULL, status TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, role TEXT NOT NULL, lead_id TEXT, expires_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS links (hash TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id), expires_at TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS outbox (id TEXT PRIMARY KEY, recipient TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, next_at TEXT NOT NULL, last_error TEXT, sent_at TEXT);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id), status TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, entity_id TEXT, actor TEXT NOT NULL, created_at TEXT NOT NULL);
  `);
  return {
    db,
    transaction(fn) {
      db.exec('BEGIN IMMEDIATE');
      try {
        const result = fn();
        db.exec('COMMIT');
        return result;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    lead(id) {
      const row = db.prepare('SELECT body FROM leads WHERE id = ?').get(id);
      return row ? JSON.parse(row.body) : null;
    },
    leads() {
      return db
        .prepare('SELECT body FROM leads ORDER BY created_at DESC')
        .all()
        .map((row) => JSON.parse(row.body));
    },
    saveLead(lead) {
      db.prepare(
        'INSERT INTO leads VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status, body=excluded.body',
      ).run(lead.id, lead.email, lead.status, JSON.stringify(lead), lead.createdAt);
    },
    order(id) {
      const row = db.prepare('SELECT body FROM orders WHERE id = ?').get(id);
      return row ? JSON.parse(row.body) : null;
    },
    orders() {
      return db
        .prepare('SELECT body FROM orders ORDER BY created_at DESC')
        .all()
        .map((row) => JSON.parse(row.body));
    },
    saveOrder(order) {
      db.prepare(
        'INSERT INTO orders VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status, body=excluded.body',
      ).run(order.id, order.leadId, order.status, JSON.stringify(order), order.createdAt);
    },
    audit(action, id, actor = 'system') {
      db.prepare('INSERT INTO audit(action,entity_id,actor,created_at) VALUES(?,?,?,?)').run(
        action,
        id,
        actor,
        new Date().toISOString(),
      );
    },
    close() {
      db.close();
    },
  };
}
