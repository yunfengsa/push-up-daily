CREATE TABLE IF NOT EXISTS pushup_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    count INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pushup_sessions_user_id ON pushup_sessions (user_id);
