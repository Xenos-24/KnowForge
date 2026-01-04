-- Create folders table
CREATE TABLE folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  color text, -- hex code or tailwind class
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default folders
INSERT INTO folders (name, color) VALUES ('General', 'slate');
INSERT INTO folders (name, color) VALUES ('Work', 'blue');
INSERT INTO folders (name, color) VALUES ('Learning', 'indigo');
INSERT INTO folders (name, color) VALUES ('Design', 'pink');

-- Add folder_id to resources
ALTER TABLE resources 
ADD COLUMN folder_id uuid REFERENCES folders(id);

-- Migration helper: Attempt to match existing text-based 'folder' column to new IDs 
-- (Optional/Manual step depending on existing data)
-- For a fresh V2 start, we can just rely on the new column.
