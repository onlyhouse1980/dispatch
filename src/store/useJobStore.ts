import { create } from 'zustand';
import { Job, JobStatus, DeliveryProof, INITIAL_MOCK_JOBS } from '../data/mockJobs';

interface JobState {
  jobs: Job[];
  acceptJob: (id: string) => void;
  updateJobStatus: (id: string, status: JobStatus, proof?: DeliveryProof) => void;
  resetMockData: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: INITIAL_MOCK_JOBS,
  
  acceptJob: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? {
              ...job,
              status: 'Accepted' as JobStatus,
              acceptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : job
      ),
    })),
    
  updateJobStatus: (id, status, proof) =>
    set((state) => ({
      jobs: state.jobs.map((job) => {
        if (job.id !== id) return job;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const updatedJob = { ...job, status };
        
        if (status === 'Picked Up') {
          updatedJob.pickedUpAt = timestamp;
        } else if (status === 'Delivered') {
          updatedJob.deliveredAt = timestamp;
          if (proof) {
            updatedJob.deliveryProof = proof;
          }
        }
        
        return updatedJob;
      }),
    })),
    
  resetMockData: () =>
    set(() => ({
      jobs: INITIAL_MOCK_JOBS,
    })),
}));
