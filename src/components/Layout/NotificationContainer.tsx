'use client';

import { useAuth } from '@/context/AuthContext';
import WelcomeNotification from '../Notification/WelcomeNotification';

export default function NotificationContainer() {
  const { user, showWelcome } = useAuth();

  if (!user) return null;

  return (
    <WelcomeNotification 
      userName={user.firstName} 
      userRole={user.role} 
      show={showWelcome} 
    />
  );
}