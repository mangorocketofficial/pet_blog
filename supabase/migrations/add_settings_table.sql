-- Settings table for blog configuration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  categories JSONB DEFAULT '["기타"]'::jsonb,
  site_name VARCHAR(255) DEFAULT '블로그',
  site_description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT settings_singleton CHECK (id = 1)
);

-- Insert default settings
INSERT INTO settings (id, categories, site_name, site_description)
VALUES (
  1,
  '["배변·위생", "급식·급수", "외출·이동", "미용·위생", "실내환경", "놀이·운동", "훈련·교육", "관상어·수족관", "스마트·모니터링", "기타"]'::jsonb,
  '펫부산',
  '반려동물 용품 리뷰와 비용 분석'
)
ON CONFLICT (id) DO NOTHING;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Public can read settings"
  ON settings
  FOR SELECT
  USING (true);

-- Policy: Service role can update settings
CREATE POLICY "Service role can update settings"
  ON settings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
