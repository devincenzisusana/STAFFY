-- Enable RLS on storage.objects table if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin operators can upload staff photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin operators can update staff photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin operators can delete staff photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff operators can upload their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff operators can update their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view staff photos" ON storage.objects;

-- Policy: Admin operators can upload staff photos
CREATE POLICY "Admin operators can upload staff photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'staff-gallery' 
  AND (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin-operator'
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin'
  )
);

-- Policy: Admin operators can update any staff photos
CREATE POLICY "Admin operators can update staff photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'staff-gallery'
  AND (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin-operator'
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin'
  )
)
WITH CHECK (
  bucket_id = 'staff-gallery'
  AND (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin-operator'
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin'
  )
);

-- Policy: Admin operators can delete staff photos
CREATE POLICY "Admin operators can delete staff photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'staff-gallery'
  AND (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin-operator'
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'super-admin'
  )
);

-- Policy: Staff operators can upload their own photos
CREATE POLICY "Staff operators can upload their own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'staff-gallery'
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'staff-operator'
  AND (storage.filename(name) LIKE auth.uid()::text || '-%')
);

-- Policy: Staff operators can update their own photos
CREATE POLICY "Staff operators can update their own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'staff-gallery'
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'staff-operator'
  AND (storage.filename(name) LIKE auth.uid()::text || '-%')
)
WITH CHECK (
  bucket_id = 'staff-gallery'
  AND (SELECT role FROM public.users WHERE id = auth.uid()) = 'staff-operator'
  AND (storage.filename(name) LIKE auth.uid()::text || '-%')
);

-- Policy: Everyone can view all staff photos (public read access)
CREATE POLICY "Everyone can view staff photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'staff-gallery');
