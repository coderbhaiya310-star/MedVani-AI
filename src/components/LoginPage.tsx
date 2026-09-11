import React from 'react';
import { LoginScreen } from './LoginScreen';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onOpenRegistration: () => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onOpenRegistration,
  onBackToHome,
}) => {
  return (
    <LoginScreen
      initialRole="patient"
      onLoginSuccess={onLoginSuccess}
      onOpenRegistration={onOpenRegistration}
      onBackToHome={onBackToHome}
    />
  );
};
