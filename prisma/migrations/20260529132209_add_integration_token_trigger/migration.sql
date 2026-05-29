-- create function
CREATE OR REPLACE FUNCTION auto_revoke_old_active_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE integration_token
    SET status = 'revoked',
        revoked_at = NOW(),
        updated_at = NOW()
    WHERE user_id = NEW.user_id
      AND provider = NEW.provider
      AND status = 'active'
      AND id <> NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create trigger
CREATE TRIGGER integration_token_auto_revoke_trigger
BEFORE INSERT ON integration_token
FOR EACH ROW
EXECUTE FUNCTION auto_revoke_old_active_token();