CREATE TABLE IF NOT EXISTS subscribers (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text NOT NULL,
  type        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT subscribers_email_lowercase_check
    CHECK (email = lower(email)),

  CONSTRAINT subscribers_type_check
    CHECK (type IN ('waitlist', 'changelog')),

  CONSTRAINT subscribers_email_type_key
    UNIQUE (email, type)
);

CREATE INDEX IF NOT EXISTS idx_subscribers_type_created_at
  ON subscribers (type, created_at DESC);
