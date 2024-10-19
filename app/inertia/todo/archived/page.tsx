'use client'
import { Fragment } from "react";
import ArchivedTodo from "@/shared/pages/todo/ArchivedTodo";
import Header from "@/shared/components/Header";

export default function ArchivedTodos() {
  return (
    <Fragment>
      <Header showMenu = {true}/>
      <ArchivedTodo />
    </Fragment>
  );
}