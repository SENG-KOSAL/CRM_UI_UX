export const WORKFLOW_STEPS = [
  { id: 'login', label: 'Login', icon: 'log-in' },
  { id: 'bu_selection', label: 'BU Selection', icon: 'briefcase' },
  { id: 'aws_selection', label: 'AWS Selection', icon: 'calendar' },
  { id: 'open_stock', label: 'Open Stock', icon: 'package' },
  { id: 'start_session', label: 'Start Session', icon: 'play-circle' },
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'route_plan', label: 'Route Plan', icon: 'map-pin' },
  { id: 'outlet_select', label: 'Select Outlet', icon: 'shop' },
  { id: 'check_in', label: 'Check-in', icon: 'log-in' },
  { id: 'load_programs', label: 'Programs', icon: 'gift' },
  { id: 'create_sale', label: 'Create Sale', icon: 'shopping-cart' },
  { id: 'check_out', label: 'Check-out', icon: 'log-out' },
  { id: 'settlement', label: 'Settlement', icon: 'credit-card' },
  { id: 'close_session', label: 'Close Session', icon: 'power' },
] as const;

export const SESSION_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export const OUTLET_VISIT_STATUS = {
  PENDING: 'pending',
  CHECKED_IN: 'checked_in',
  SALE_COMPLETED: 'sale_completed',
  CHECKED_OUT: 'checked_out',
} as const;

export const SALE_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const MOCK_DELAY = 800;
export const ANIMATION_DURATION = 300;
