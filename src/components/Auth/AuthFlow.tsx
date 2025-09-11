'use client';

import { useState } from 'react';
import AccountTypeSelector, { AccountType } from './AccountTypeSelector';
import LoginForm from './LoginForm';
import SignupForm, { SignupData } from './SignupForm';

interface AuthFlowProps {
  onLogin: (email: string, password: string) => void;
  onSignup?: (data: SignupData) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function AuthFlow({ onLogin, onSignup, isLoading, error }: AuthFlowProps) {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  const [mode, setMode] = useState<'select' | 'login' | 'signup'>('select');

  const handleSelectType = (type: AccountType) => {
    setSelectedAccountType(type);
    setMode('login');
  };

  const handleCreateAccount = (type: AccountType) => {
    setSelectedAccountType(type);
    setMode('signup');
  };

  const handleBackToTypeSelection = () => {
    setSelectedAccountType(null);
    setMode('select');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleSwitchToSignup = () => {
    setMode('signup');
  };

  const handleSignup = (data: SignupData) => {
    if (onSignup) {
      onSignup(data);
    }
  };

  if (mode === 'select') {
    return (
      <AccountTypeSelector 
        onSelectType={handleSelectType} 
        onCreateAccount={handleCreateAccount}
      />
    );
  }

  if (mode === 'signup' && selectedAccountType) {
    return (
      <SignupForm
        accountType={selectedAccountType}
        onSignup={handleSignup}
        onBack={handleBackToTypeSelection}
        onSwitchToLogin={handleSwitchToLogin}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (mode === 'login' && selectedAccountType) {
    return (
      <LoginForm
        accountType={selectedAccountType}
        onLogin={onLogin}
        onBack={handleBackToTypeSelection}
        onSwitchToSignup={handleSwitchToSignup}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return null;
}