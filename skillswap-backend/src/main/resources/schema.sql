-- SkillSwap Database Setup
-- Run ONCE against your PostgreSQL skillswap database.
--
-- In pgAdmin: Database > skillswap > Query Tool > paste this > Run (F5)
-- Still the same databse used for mobile

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    year_of_study INTEGER,
    bio TEXT,
    profile_picture_url VARCHAR(255),
    role VARCHAR(20) DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    force_password_change BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT')),
    is_active BOOLEAN DEFAULT TRUE,
    availability TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS session_requests (
    id BIGSERIAL PRIMARY KEY,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    requester_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES session_requests(id) ON DELETE SET NULL,
    skill_id BIGINT REFERENCES skills(id) ON DELETE CASCADE,
    teacher_id BIGINT REFERENCES users(id),
    learner_id BIGINT REFERENCES users(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(200),
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT REFERENCES sessions(id) ON DELETE CASCADE,
    reviewer_id BIGINT REFERENCES users(id),
    reviewee_id BIGINT REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    related_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skills_user ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON session_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_learner ON sessions(learner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- ============================================================
-- DEFAULT ACCOUNTS
-- Admin    -> email: admin@skillswap.com  password: Admin@123
-- Students -> email: alex/priya/james@uni.edu  password: password123
-- ============================================================

INSERT INTO users (full_name, student_id, email, password_hash, role, is_active)
VALUES ('System Administrator', 'ADMIN001', 'admin@skillswap.com',
        '$2a$10$nPhH7bu1FRswxIp5KqhQ5uQ/tccT8wtYPWrZpPZ5Ww89CvS3njTTO', 'ADMIN', TRUE)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

INSERT INTO users (full_name, student_id, email, password_hash, department, year_of_study, bio, role, is_active)
VALUES
    ('Alex Morgan',  'STU001', 'alex@uni.edu',  '$2a$10$CizCa1rPO/c5HPDi7AgNouNh0NXrLX81OaUbitKCp9wxYhgpDIiHS', 'Computer Science', 3, 'Passionate about technology.', 'STUDENT', TRUE),
    ('Priya Sharma', 'STU002', 'priya@uni.edu', '$2a$10$CizCa1rPO/c5HPDi7AgNouNh0NXrLX81OaUbitKCp9wxYhgpDIiHS', 'Computer Science', 4, 'ML researcher.',              'STUDENT', TRUE),
    ('James Chen',   'STU003', 'james@uni.edu', '$2a$10$CizCa1rPO/c5HPDi7AgNouNh0NXrLX81OaUbitKCp9wxYhgpDIiHS', 'Mathematics',      2, 'Math tutor.',                 'STUDENT', TRUE)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
