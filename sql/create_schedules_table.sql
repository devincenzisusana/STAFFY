-- Create schedules table for Schedule page
-- Based on the CreateScheduleModal form fields

CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    finish_date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_schedule_date_range CHECK (finish_date >= start_date),
    CONSTRAINT chk_schedule_time_range CHECK (shift_end > shift_start)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_schedules_tenant_id ON public.schedules(tenant_id);
CREATE INDEX IF NOT EXISTS idx_schedules_staff_id ON public.schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON public.schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_start_date ON public.schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_schedules_finish_date ON public.schedules(finish_date);
CREATE INDEX IF NOT EXISTS idx_schedules_date_range ON public.schedules(start_date, finish_date);

-- Add check constraint for status values
ALTER TABLE public.schedules 
ADD CONSTRAINT chk_schedules_status 
CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed'));

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schedules_updated_at
    BEFORE UPDATE ON public.schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_schedules_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.schedules IS 'Staff work schedule and shift management table';
COMMENT ON COLUMN public.schedules.id IS 'Unique identifier for the schedule';
COMMENT ON COLUMN public.schedules.tenant_id IS 'Reference to tenant for multi-tenancy isolation';
COMMENT ON COLUMN public.schedules.staff_id IS 'Reference to staff member assigned to the schedule';
COMMENT ON COLUMN public.schedules.start_date IS 'Schedule start date';
COMMENT ON COLUMN public.schedules.finish_date IS 'Schedule finish/end date';
COMMENT ON COLUMN public.schedules.shift_start IS 'Shift start time';
COMMENT ON COLUMN public.schedules.shift_end IS 'Shift end time';
COMMENT ON COLUMN public.schedules.status IS 'Schedule status: scheduled, confirmed, cancelled, completed';
COMMENT ON COLUMN public.schedules.notes IS 'Additional notes about the schedule';
COMMENT ON COLUMN public.schedules.created_at IS 'Timestamp when schedule was created';
COMMENT ON COLUMN public.schedules.updated_at IS 'Timestamp when schedule was last updated';
