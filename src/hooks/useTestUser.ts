import { User } from '@/types';

export function useTestUser(user: User | null) {
  const isTestUser = user && (user.id === '4' || user.email === 'test@app.com');
  
  return {
    isTestUser: !!isTestUser,
    shouldShowEmptyState: !!isTestUser,
  };
}