-- Additive only: existing content, proposals and local browser databases remain intact.
CREATE TABLE av_user(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,emailVerified INTEGER NOT NULL DEFAULT 0,image TEXT,createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL);
CREATE TABLE av_session(id TEXT PRIMARY KEY,token TEXT NOT NULL UNIQUE,userId TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,expiresAt INTEGER NOT NULL,createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL,ipAddress TEXT,userAgent TEXT);
CREATE INDEX av_session_user ON av_session(userId);
CREATE TABLE av_account(id TEXT PRIMARY KEY,accountId TEXT NOT NULL,providerId TEXT NOT NULL,userId TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,accessToken TEXT,refreshToken TEXT,idToken TEXT,accessTokenExpiresAt INTEGER,refreshTokenExpiresAt INTEGER,scope TEXT,password TEXT,createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL);
CREATE INDEX av_account_user ON av_account(userId);
CREATE TABLE av_verification(id TEXT PRIMARY KEY,identifier TEXT NOT NULL,value TEXT NOT NULL,expiresAt INTEGER NOT NULL,createdAt INTEGER NOT NULL,updatedAt INTEGER NOT NULL);
CREATE INDEX av_verification_identifier ON av_verification(identifier);
CREATE TABLE av_auth_rate(id TEXT PRIMARY KEY,key TEXT NOT NULL UNIQUE,count INTEGER NOT NULL,lastRequest INTEGER NOT NULL);
CREATE TABLE av_deletion_queue(user_id TEXT PRIMARY KEY,ready INTEGER NOT NULL DEFAULT 0,contributions TEXT NOT NULL DEFAULT '[]');

CREATE TABLE av_sightings(user_id TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,id TEXT NOT NULL,body TEXT NOT NULL CHECK(json_valid(body)),revision INTEGER NOT NULL DEFAULT 1,deleted INTEGER NOT NULL DEFAULT 0,mutation_id TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(user_id,id));
CREATE TABLE av_preferences(user_id TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,id TEXT NOT NULL,body TEXT NOT NULL CHECK(json_valid(body)),revision INTEGER NOT NULL DEFAULT 1,deleted INTEGER NOT NULL DEFAULT 0,mutation_id TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(user_id,id));
CREATE TABLE av_mutations(user_id TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,mutation_id TEXT NOT NULL,kind TEXT NOT NULL,entity_id TEXT NOT NULL,result TEXT NOT NULL,PRIMARY KEY(user_id,mutation_id));
CREATE TABLE av_changes(sequence INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT NOT NULL REFERENCES av_user(id) ON DELETE CASCADE,kind TEXT NOT NULL,entity_id TEXT NOT NULL);
CREATE INDEX av_changes_user ON av_changes(user_id,sequence);
-- A successful row mutation and its idempotency receipt commit atomically.
CREATE TRIGGER av_sighting_insert AFTER INSERT ON av_sightings BEGIN INSERT INTO av_mutations VALUES(NEW.user_id,NEW.mutation_id,'sighting',NEW.id,json_object('id',NEW.id,'body',json(NEW.body),'revision',NEW.revision,'deleted',NEW.deleted,'updatedAt',NEW.updated_at)); INSERT INTO av_changes(user_id,kind,entity_id) VALUES(NEW.user_id,'sighting',NEW.id); END;
CREATE TRIGGER av_sighting_update AFTER UPDATE ON av_sightings BEGIN INSERT INTO av_mutations VALUES(NEW.user_id,NEW.mutation_id,'sighting',NEW.id,json_object('id',NEW.id,'body',json(NEW.body),'revision',NEW.revision,'deleted',NEW.deleted,'updatedAt',NEW.updated_at)); INSERT INTO av_changes(user_id,kind,entity_id) VALUES(NEW.user_id,'sighting',NEW.id); END;
CREATE TRIGGER av_preference_insert AFTER INSERT ON av_preferences BEGIN INSERT INTO av_mutations VALUES(NEW.user_id,NEW.mutation_id,'preference',NEW.id,json_object('id',NEW.id,'body',json(NEW.body),'revision',NEW.revision,'deleted',NEW.deleted,'updatedAt',NEW.updated_at)); INSERT INTO av_changes(user_id,kind,entity_id) VALUES(NEW.user_id,'preference',NEW.id); END;
CREATE TRIGGER av_preference_update AFTER UPDATE ON av_preferences BEGIN INSERT INTO av_mutations VALUES(NEW.user_id,NEW.mutation_id,'preference',NEW.id,json_object('id',NEW.id,'body',json(NEW.body),'revision',NEW.revision,'deleted',NEW.deleted,'updatedAt',NEW.updated_at)); INSERT INTO av_changes(user_id,kind,entity_id) VALUES(NEW.user_id,'preference',NEW.id); END;
ALTER TABLE bird_proposals ADD COLUMN submitter_user_id TEXT REFERENCES av_user(id) ON DELETE SET NULL;
