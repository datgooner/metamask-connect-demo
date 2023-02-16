import React, { PropsWithChildren, ReactElement } from "react";
import Header from "./Header";

function MainLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
export default function renderMainLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
}
