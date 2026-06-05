export type JobPriority = 'Standard' | 'Express' | 'Same-day';
export type JobStatus = 'Available' | 'Accepted' | 'Picked Up' | 'Delivered';

export interface LocationInfo {
  city: string;
  address: string;
  lat: number;  // Used for vector map coordinates
  lng: number;  // Used for vector map coordinates
  timeWindow: string;
  contactName: string;
  contactPhone: string;
}

export interface DeliveryProof {
  signedBy?: string;
  deliveryNotes?: string;
}

export interface Job {
  id: string;
  pickup: LocationInfo;
  dropoff: LocationInfo;
  priority: JobPriority;
  distance: string;
  duration: string;
  status: JobStatus;
  earnings: number;
  cargoDescription: string;
  notes?: string;
  acceptedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  deliveryProof?: DeliveryProof;
}

export const INITIAL_MOCK_JOBS: Job[] = [
  {
    id: 'JOB-7482',
    priority: 'Express',
    status: 'Available',
    earnings: 45.80,
    distance: '14.2 km',
    duration: '22 mins',
    cargoDescription: 'Fragile: Medical Diagnostic Kits',
    notes: 'Go to Section B, Cargo Dock 4. Ask for Dr. Jenkins.',
    pickup: {
      city: 'San Francisco',
      address: '2240 O\'Farrell St',
      lat: 37.783,
      lng: -122.438,
      timeWindow: '12:00 PM - 12:45 PM',
      contactName: 'Sarah Connor',
      contactPhone: '+1 (555) 382-9901'
    },
    dropoff: {
      city: 'San Francisco',
      address: '505 Parnassus Ave',
      lat: 37.763,
      lng: -122.458,
      timeWindow: '01:00 PM - 01:30 PM',
      contactName: 'Dr. Raymond Jenkins',
      contactPhone: '+1 (555) 773-0941'
    }
  },
  {
    id: 'JOB-9013',
    priority: 'Same-day',
    status: 'Available',
    earnings: 32.50,
    distance: '8.4 km',
    duration: '18 mins',
    cargoDescription: 'High Value: Tech Prototypes (GPUs)',
    notes: 'Requires signature. Deliver to security desk if office is locked.',
    pickup: {
      city: 'San Francisco',
      address: '1355 Market St (Twitter Bldg)',
      lat: 37.777,
      lng: -122.417,
      timeWindow: '01:30 PM - 02:30 PM',
      contactName: 'James Chen',
      contactPhone: '+1 (555) 220-4100'
    },
    dropoff: {
      city: 'San Francisco',
      address: '242 Tolsand St',
      lat: 37.752,
      lng: -122.409,
      timeWindow: 'By 5:00 PM',
      contactName: 'Reception Desk',
      contactPhone: '+1 (555) 902-1823'
    }
  },
  {
    id: 'JOB-2309',
    priority: 'Standard',
    status: 'Available',
    earnings: 18.00,
    distance: '4.8 km',
    duration: '12 mins',
    cargoDescription: 'General: Legal Documents',
    notes: 'Deliver to Suite 400. Do not leave unattended.',
    pickup: {
      city: 'San Francisco',
      address: '555 California St',
      lat: 37.792,
      lng: -122.404,
      timeWindow: '02:00 PM - 03:00 PM',
      contactName: 'Mark Vance',
      contactPhone: '+1 (555) 819-3221'
    },
    dropoff: {
      city: 'San Francisco',
      address: '100 Montgomery St',
      lat: 37.790,
      lng: -122.402,
      timeWindow: 'By 6:00 PM',
      contactName: 'Emily Stone',
      contactPhone: '+1 (555) 124-7548'
    }
  },
  {
    id: 'JOB-5491',
    priority: 'Express',
    status: 'Available',
    earnings: 58.20,
    distance: '21.6 km',
    duration: '35 mins',
    cargoDescription: 'Critical: Auto Replacement Parts',
    notes: 'Parts are heavy. Handcart recommended. Return pallet to pickup.',
    pickup: {
      city: 'Oakland',
      address: '8400 Pardee Dr',
      lat: 37.732,
      lng: -122.202,
      timeWindow: '11:00 AM - 12:00 PM',
      contactName: 'Warehouse Lead Bill',
      contactPhone: '+1 (555) 746-1294'
    },
    dropoff: {
      city: 'San Francisco',
      address: '1601 Bryant St',
      lat: 37.767,
      lng: -122.412,
      timeWindow: 'By 1:30 PM',
      contactName: 'Mechanic Frank',
      contactPhone: '+1 (555) 394-8501'
    }
  },
  {
    id: 'JOB-8820',
    priority: 'Standard',
    status: 'Available',
    earnings: 26.00,
    distance: '10.5 km',
    duration: '20 mins',
    cargoDescription: 'General: Retail Clothing Stock',
    notes: 'Deliver to back alley loading door, ring bell.',
    pickup: {
      city: 'San Francisco',
      address: '865 Market St (Westfield)',
      lat: 37.784,
      lng: -122.407,
      timeWindow: '03:00 PM - 04:30 PM',
      contactName: 'Amanda Lopez',
      contactPhone: '+1 (555) 441-2948'
    },
    dropoff: {
      city: 'San Francisco',
      address: '3251 20th St',
      lat: 37.759,
      lng: -122.416,
      timeWindow: 'By 7:00 PM',
      contactName: 'Store Manager Lee',
      contactPhone: '+1 (555) 304-2094'
    }
  }
];
