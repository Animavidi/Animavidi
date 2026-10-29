-- Keep the original queue, audit history and stable IDs. Only new-species reviews
-- extend the species catalogue; corrections and photos attach to existing IDs.
DROP TRIGGER bird_publish;
CREATE TRIGGER bird_publish AFTER UPDATE OF status ON bird_proposals
WHEN NEW.status = 'approved' AND OLD.status = 'pending'
  AND COALESCE(json_extract(NEW.body,'$.kind'),'new') = 'new' BEGIN
  INSERT INTO approved_birds(sequence,id,name_key,scientific_key,body,approved_at)
  VALUES(NEW.proposal_no,NEW.published_id,NEW.name_key,NEW.scientific_key,NEW.body,NEW.updated_at);
END;
