'use client';
import { FocusStoreProvider } from './useFocus';
import FocusPage from './FocusPage';
import { Fragment } from 'react';
import useAuth from '@/shared/hooks/auth';
import { AppDataProvider } from '@/shared/hooks/AppDataProvider';


export default function BookingPage({}: any) {
  useAuth();
  return (
    <FocusStoreProvider>
      <AppDataProvider>
        <FocusPage />
      </AppDataProvider>
    </FocusStoreProvider>
  );
}