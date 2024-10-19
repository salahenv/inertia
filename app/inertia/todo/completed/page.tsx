'use client'
import { Fragment } from "react";
import CompletedTodo from "@/shared/pages/todo/CompletedTodo";
import Header from "@/shared/components/Header";

export default function CompletedTodos() {
  return (
    <Fragment>
      <Header showMenu = {true}/>
      <CompletedTodo />
    </Fragment>
  );
}