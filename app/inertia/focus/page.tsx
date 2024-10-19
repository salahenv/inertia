'use client'
import Header from "@/shared/components/Header";
import FocusPage from "@/shared/pages/focus/FocusPage";
import { Fragment, Suspense } from "react";

export default function Focus() {
  return (
    <Fragment>
      <Header showMenu = {false}/>
      <Suspense fallback="loading">
        <FocusPage />
      </Suspense>
    </Fragment>
  );
}