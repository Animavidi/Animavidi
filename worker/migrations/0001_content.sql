CREATE TABLE IF NOT EXISTS content (
  kind TEXT NOT NULL CHECK (kind IN ('animal', 'route')),
  id TEXT NOT NULL,
  body TEXT NOT NULL CHECK (json_valid(body)),
  revision TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (kind, id)
);
CREATE TABLE IF NOT EXISTS content_history (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,
  id TEXT NOT NULL,
  body TEXT NOT NULL,
  revision TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS content_history_lookup ON content_history(kind, id, history_id);
CREATE TRIGGER IF NOT EXISTS content_revision_history
AFTER UPDATE ON content
BEGIN
  INSERT INTO content_history(kind, id, body, revision, updated_at)
  VALUES (OLD.kind, OLD.id, OLD.body, OLD.revision, OLD.updated_at);
END;
