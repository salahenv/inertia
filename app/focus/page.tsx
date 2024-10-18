import { useEffect, useState, useContext } from "react";
import FocusPage from "@/shared/pages/focus";
import { Suspense } from 'react';

export default function Home() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FocusPage />
    </Suspense>
  );
}
