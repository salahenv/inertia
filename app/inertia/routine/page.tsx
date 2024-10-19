'use client'
import Header from "@/shared/components/Header";
import RoutineTodo from "@/shared/pages/todo/RoutineTodo";
import { Fragment } from "react";

export default function Routine() {
    return (
        <Fragment>
            <Header showMenu = {false}/>
            <RoutineTodo />
        </Fragment>
    );
}