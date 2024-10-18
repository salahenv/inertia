'use client'
import Header from "@/shared/components/Header";
import HomePage from "@/shared/pages/home/HomePage";
import { Fragment } from "react";

export default function Home() {
    return (
        <Fragment>
            <Header showMenu = {false}/>
            <HomePage />
        </Fragment>
    );
}