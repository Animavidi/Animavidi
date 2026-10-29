CREATE TABLE bird_proposals (
  proposal_no INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL CHECK(json_valid(body)),
  name_key TEXT NOT NULL,
  scientific_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  revision TEXT NOT NULL,
  published_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  reviewer TEXT NOT NULL DEFAULT '',
  review_note TEXT NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX bird_pending_name ON bird_proposals(name_key) WHERE status = 'pending';
CREATE INDEX bird_proposals_queue ON bird_proposals(status, proposal_no);
CREATE TABLE approved_birds (
  sequence INTEGER PRIMARY KEY,
  id TEXT NOT NULL UNIQUE,
  name_key TEXT NOT NULL UNIQUE,
  scientific_key TEXT NOT NULL,
  body TEXT NOT NULL CHECK(json_valid(body)),
  approved_at TEXT NOT NULL
);
CREATE UNIQUE INDEX bird_approved_scientific ON approved_birds(scientific_key) WHERE scientific_key <> '';
CREATE TABLE bird_proposal_history (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,
  proposal_id TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL,
  revision TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  reviewer TEXT NOT NULL,
  review_note TEXT NOT NULL
);
CREATE TRIGGER bird_review_history AFTER UPDATE ON bird_proposals BEGIN
  INSERT INTO bird_proposal_history(proposal_id,body,status,revision,updated_at,reviewer,review_note)
  VALUES(OLD.id,OLD.body,OLD.status,OLD.revision,OLD.updated_at,OLD.reviewer,OLD.review_note);
END;
-- Publication and the moderation decision commit or roll back together.
CREATE TRIGGER bird_publish AFTER UPDATE OF status ON bird_proposals
WHEN NEW.status = 'approved' AND OLD.status = 'pending' BEGIN
  INSERT INTO approved_birds(sequence,id,name_key,scientific_key,body,approved_at)
  VALUES(NEW.proposal_no,NEW.published_id,NEW.name_key,NEW.scientific_key,NEW.body,NEW.updated_at);
END;
CREATE TABLE bird_submission_limits (
  client_key TEXT PRIMARY KEY,
  window_start INTEGER NOT NULL,
  attempts INTEGER NOT NULL
);
