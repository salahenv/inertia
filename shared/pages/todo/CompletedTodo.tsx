"use client";
import { useEffect, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import {
  CompletedIcon,
  NextIcon,
  NoFocus,
  PrevIcon,
} from "../../../shared/icons";
import {formatDateString} from '../../../shared/dateUtils';
import useAuth from '../../../shared/hooks/auth';
import TodoItem from "./components/TodoItem";
import Link from "next/link";
import DetailsModal from "./components/DetailsModal";

export default function CompletedTodo() {
  useAuth();
  const [isCompletedTodoLoading, setIsCompletedTodoLoading] = useState(false);
  const [todosCompleted, setTodosCompleted] = useState<
    {
      name: string;
      completed: boolean;
      _id: string;
      createdAt: Date;
      updatedAt: Date;
      archived: boolean;
    }[]
  >([]);
  const [dayOffset, setDayOffset] = useState(1);
  const [selectedDay, setSelectedDay] = useState("Yesterday");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    getTodoCompleted();
  }, [dayOffset]);

  const onPrevClick = () => {
    if(!isCompletedTodoLoading) {
      setDayOffset(dayOffset + 1);
    } 
  };

  const onNextClick = () => {
    if (dayOffset > 1 && !isCompletedTodoLoading) {
      setDayOffset(dayOffset - 1);
    }
  };

  function PrevNextNavigator() {
    return (
      <div className="flex items-center">
        <div onClick={() => onPrevClick()}>
          <PrevIcon 
            color={
              isCompletedTodoLoading ? "rgba(37, 99, 235, .5)" : "rgba(37, 99, 235, 1)"
            }
          />
        </div>
        <div className="text-gray-800 font-bold text-xl ml-4 mr-4">
          {selectedDay}
        </div>
        <div onClick={() => onNextClick()}>
          <NextIcon
            color={
              (dayOffset === 1 || isCompletedTodoLoading) ? "rgba(37, 99, 235, .5)" : "rgba(37, 99, 235, 1)"
            }
          />
        </div>
      </div>
    );
  }

  const getTodoCompleted = async () => {
    setIsCompletedTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/completed?dayOffset=${dayOffset}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        setTodosCompleted(resData.data.todos);
        const formatedDate = formatDateString(resData.data.date);
        setSelectedDay(formatedDate);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsCompletedTodoLoading(false);
    }
  };

  const onDetailsClick = (todo: any) => {
    setShowDetailsModal(true);
    setTodo(todo);
  }

  const onCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setTodo(null);
  }

  return (
  
      <div className="bg-neutral-100 p-4 min-h-screen">
        { 
          showDetailsModal ? 
          <DetailsModal
            closeCb = {onCloseDetailsModal}
            todo = {todo}
          /> : null
        }
        <div className="flex flex-row justify-between items-center mb-4">
          <div className="font-medium text-xl flex">
            <CompletedIcon />
            <div className="ml-2 text-gray-800">{"Completed Todo's"}</div>
          </div>
          <PrevNextNavigator />
        </div>
        <div>
          {isCompletedTodoLoading ? (
            <SkeletonLoaderTodo />
          ) : todosCompleted && todosCompleted.length ? (
            todosCompleted.map((todo, index) => {
              return (
                <div
                  // onClick = {() => onDetailsClick(todo)}
                  key={index} 
                  className="mb-2 border border-gray-300 p-4 cursor-pointer rounded shadow bg-white">
                    <Link href = {`/todo/${todo._id}`}>
                      <TodoItem 
                        todo = {todo}
                        disabledInput = {true}
                        showUpdatedDate = {true}
                      />
                    </Link>
                </div>
              );
            })
          ) : (
            <div>
              <div className="flex justify-center mt-8">
                <NoFocus />
              </div>
              <div className="text-xl text-center mt-2 text-red-500">
                No completed todo!
              </div>
              <div className="text-lg text-center mt-1 text-gray-500">
                Create todo it will start reflecting
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
