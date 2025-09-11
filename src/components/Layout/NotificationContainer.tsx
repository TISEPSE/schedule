'use client';

import { useAuth } from '@/context/AuthContext';
import WelcomeNotification from '../Notification/WelcomeNotification';

export default function NotificationContainer() {
  const { user, showWelcome, hideWelcome, welcomeStartTime } = useAuth();

  if (!user || !showWelcome) return null;

  return (
    <WelcomeNotification 
      userName={user.firstName} 
      userRole={user.role} 
      show={showWelcome}
      onHide={hideWelcome}
      startTime={welcomeStartTime}
    />
  );
}