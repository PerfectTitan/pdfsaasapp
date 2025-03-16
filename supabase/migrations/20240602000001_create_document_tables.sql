-- Folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  parent_folder_id UUID REFERENCES public.folders(id),
  is_root BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_type TEXT NOT NULL,
  file_size BIGINT,
  file_path TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  folder_id UUID REFERENCES public.folders(id),
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Shared documents table
CREATE TABLE IF NOT EXISTS public.shared_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  permission_level TEXT NOT NULL CHECK (permission_level IN ('view', 'edit', 'sign', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(document_id, user_id)
);

-- Document versions table
CREATE TABLE IF NOT EXISTS public.document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) NOT NULL,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  created_by UUID REFERENCES public.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Signatures table
CREATE TABLE IF NOT EXISTS public.signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  document_id UUID REFERENCES public.documents(id) NOT NULL,
  signature_data TEXT NOT NULL,
  signature_type TEXT NOT NULL CHECK (signature_type IN ('drawn', 'typed', 'uploaded')),
  position_x INTEGER,
  position_y INTEGER,
  page_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for folders
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
CREATE POLICY "Users can view their own folders"
ON public.folders
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own folders" ON public.folders;
CREATE POLICY "Users can insert their own folders"
ON public.folders
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
CREATE POLICY "Users can update their own folders"
ON public.folders
FOR UPDATE
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;
CREATE POLICY "Users can delete their own folders"
ON public.folders
FOR DELETE
USING (user_id = auth.uid());

-- Create RLS policies for documents
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;
CREATE POLICY "Users can view their own documents"
ON public.documents
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view shared documents" ON public.documents;
CREATE POLICY "Users can view shared documents"
ON public.documents
FOR SELECT
USING (
  id IN (
    SELECT document_id FROM public.shared_documents 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
CREATE POLICY "Users can insert their own documents"
ON public.documents
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own documents" ON public.documents;
CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update shared documents with edit permission" ON public.documents;
CREATE POLICY "Users can update shared documents with edit permission"
ON public.documents
FOR UPDATE
USING (
  id IN (
    SELECT document_id FROM public.shared_documents 
    WHERE user_id = auth.uid() 
    AND permission_level IN ('edit', 'admin')
  )
);

DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;
CREATE POLICY "Users can delete their own documents"
ON public.documents
FOR DELETE
USING (user_id = auth.uid());

-- Create RLS policies for shared_documents
DROP POLICY IF EXISTS "Users can view their document shares" ON public.shared_documents;
CREATE POLICY "Users can view their document shares"
ON public.shared_documents
FOR SELECT
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  ) 
  OR user_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can share their own documents" ON public.shared_documents;
CREATE POLICY "Users can share their own documents"
ON public.shared_documents
FOR INSERT
WITH CHECK (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update shares for their own documents" ON public.shared_documents;
CREATE POLICY "Users can update shares for their own documents"
ON public.shared_documents
FOR UPDATE
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete shares for their own documents" ON public.shared_documents;
CREATE POLICY "Users can delete shares for their own documents"
ON public.shared_documents
FOR DELETE
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
);

-- Create RLS policies for document_versions
DROP POLICY IF EXISTS "Users can view versions of their documents" ON public.document_versions;
CREATE POLICY "Users can view versions of their documents"
ON public.document_versions
FOR SELECT
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
  OR document_id IN (
    SELECT document_id FROM public.shared_documents 
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert versions to their documents" ON public.document_versions;
CREATE POLICY "Users can insert versions to their documents"
ON public.document_versions
FOR INSERT
WITH CHECK (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
  OR document_id IN (
    SELECT document_id FROM public.shared_documents 
    WHERE user_id = auth.uid() 
    AND permission_level IN ('edit', 'admin')
  )
);

-- Create RLS policies for signatures
DROP POLICY IF EXISTS "Users can view signatures on their documents" ON public.signatures;
CREATE POLICY "Users can view signatures on their documents"
ON public.signatures
FOR SELECT
USING (
  document_id IN (
    SELECT id FROM public.documents 
    WHERE user_id = auth.uid()
  )
  OR document_id IN (
    SELECT document_id FROM public.shared_documents 
    WHERE user_id = auth.uid()
  )
  OR user_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can add signatures" ON public.signatures;
CREATE POLICY "Users can add signatures"
ON public.signatures
FOR INSERT
WITH CHECK (
  user_id = auth.uid() 
  AND (
    document_id IN (
      SELECT id FROM public.documents 
      WHERE user_id = auth.uid()
    )
    OR document_id IN (
      SELECT document_id FROM public.shared_documents 
      WHERE user_id = auth.uid() 
      AND permission_level IN ('sign', 'admin')
    )
  )
);

-- Enable RLS on all tables
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

-- Add tables to realtime publication
alter publication supabase_realtime add table folders;
alter publication supabase_realtime add table documents;
alter publication supabase_realtime add table shared_documents;
alter publication supabase_realtime add table document_versions;
alter publication supabase_realtime add table signatures;

-- Create function to create a root folder for new users
CREATE OR REPLACE FUNCTION public.create_root_folder_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.folders (name, user_id, is_root)
  VALUES ('My Documents', NEW.id, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create root folder when a new user is created
DROP TRIGGER IF EXISTS create_root_folder_trigger ON public.users;
CREATE TRIGGER create_root_folder_trigger
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.create_root_folder_for_new_user();
