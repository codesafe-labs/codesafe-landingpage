-- Revoke broad defaults from PUBLIC
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

-- App role: INSERT-only on subscribers (no SELECT/UPDATE/DELETE)
CREATE ROLE codesafe_app NOLOGIN;
GRANT USAGE ON SCHEMA public TO codesafe_app;
GRANT INSERT ON subscribers TO codesafe_app;
GRANT USAGE, SELECT ON SEQUENCE subscribers_id_seq TO codesafe_app;

-- Readonly role: SELECT for operator export script
CREATE ROLE codesafe_readonly NOLOGIN;
GRANT USAGE ON SCHEMA public TO codesafe_readonly;
GRANT SELECT ON subscribers TO codesafe_readonly;

-- Login roles (passwords set via Coolify / docker env, not in Git)
-- CREATE ROLE codesafe_app_login LOGIN PASSWORD '…' IN ROLE codesafe_app;
-- CREATE ROLE codesafe_readonly_login LOGIN PASSWORD '…' IN ROLE codesafe_readonly;
