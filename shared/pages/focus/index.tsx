'use client';
import { FocusStoreProvider } from './useFocus';
import FocusPage from './FocusPage';
import { Fragment } from 'react';
import useAuth from '@/shared/hooks/auth';


export default function BookingPage({}: any) {
  useAuth();
  return (
    <FocusStoreProvider>
      <FocusPage />
    </FocusStoreProvider>
  );
}