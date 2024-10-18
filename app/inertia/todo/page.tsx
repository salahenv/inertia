'use client'
import { Fragment } from "react";
import { useDispatch } from "@/shared/hooks/useStore";
import TodoPage from "@/shared/pages/todo/TodoPage";
import Header from "@/shared/components/Header";

export default function TodayTodos() {
  return (
    <Fragment>
      <Header showMenu = {true}/>
      <TodoPage />
    </Fragment>
  );
}