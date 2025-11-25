-- Create absence_requests table for Absence page
-- Based on the CreateAbsenceModal form fields

CREATE TABLE IF NOT EXISTS public.absence_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_date_range CHECK (end_date >= start_date)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_absence_requests_tenant_id ON public.absence_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_absence_requests_staff_id ON public.absence_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_absence_requests_status ON public.absence_requests(status);
CREATE INDEX IF NOT EXISTS idx_absence_requests_start_date ON public.absence_requests(start_date);
CREATE INDEX IF NOT EXISTS idx_absence_requests_end_date ON public.absence_requests(end_date);

-- Add check constraint for request type values
ALTER TABLE public.absence_requests 
ADD CONSTRAINT chk_absence_requests_request_type 
CHECK (request_type IN ('vacation', 'sick-leave', 'personal', 'emergency', 'other'));

-- Add check constraint for status values
ALTER TABLE public.absence_requests 
ADD CONSTRAINT chk_absence_requests_status 
CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_absence_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_absence_requests_updated_at
    BEFORE UPDATE ON public.absence_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_absence_requests_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.absence_requests IS 'Absence and leave request tracking table';
COMMENT ON COLUMN public.absence_requests.id IS 'Unique identifier for the absence request';
COMMENT ON COLUMN public.absence_requests.tenant_id IS 'Reference to tenant for multi-tenancy isolation';
COMMENT ON COLUMN public.absence_requests.staff_id IS 'Reference to staff member requesting absence';
COMMENT ON COLUMN public.absence_requests.request_type IS 'Type of absence: vacation, sick-leave, personal, emergency, other';
COMMENT ON COLUMN public.absence_requests.start_date IS 'Absence start date';
COMMENT ON COLUMN public.absence_requests.end_date IS 'Absence end date';
COMMENT ON COLUMN public.absence_requests.notes IS 'Additional notes or details about the request';
COMMENT ON COLUMN public.absence_requests.status IS 'Request status: pending, approved, rejected, cancelled';
COMMENT ON COLUMN public.absence_requests.created_at IS 'Timestamp when request was created';
COMMENT ON COLUMN public.absence_requests.updated_at IS 'Timestamp when request was last updated';
