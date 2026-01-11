-- Database Schema for Robotics Updates 2026
-- PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Updates table (përditësimet)
CREATE TABLE IF NOT EXISTS updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT true
);

-- Images table (imazhet për përditësimet)
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    update_id UUID REFERENCES updates(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestions table (sugjerimet nga mësuesit)
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
    admin_feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Participants table (pjesëmarrësit)
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    school VARCHAR(255),
    team_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programming languages table (gjuhët e programimit)
CREATE TABLE IF NOT EXISTS programming_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    icon_url TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_updates_published ON updates(published);
CREATE INDEX IF NOT EXISTS idx_images_update_id ON images(update_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_teacher_id ON suggestions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_updates_updated_at BEFORE UPDATE ON updates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suggestions_updated_at BEFORE UPDATE ON suggestions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

