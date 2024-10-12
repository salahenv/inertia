"use client";
import { useEffect, useReducer, useRef, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import { NoFocus } from "../../icons";
import useAuth from "../../hooks/auth";
import TodoItem from "./components/TodoItem";
import Link from "next/link";
import { debounce } from "@/app/utils";

export default function ArchivedTodo() {
  useAuth();
  const target = useRef(null);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [todos, setTodos] = useState<
    {
      name: string;
      completed: boolean;
      _id: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    console.log(page);
    getTodo(page);
  }, [page]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop + 100 >=
  //       document.documentElement.scrollHeight
  //     ) {
  //       if (hasMore && !isTodoLoading) {
  //         setPage((prevPage) => prevPage + 1);
  //       }
  //     }
  //   };

  //   const debouncedHandleScroll = debounce(handleScroll, 200);

  //   window.addEventListener("scroll", debouncedHandleScroll);
  //   return () => window.removeEventListener("scroll", debouncedHandleScroll);
  // }, [hasMore, isTodoLoading]);

  useEffect(() => {

    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        console.log("intersecting");
        if(page <= totalPage && !isTodoLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      } 
    });
    if(target?.current) {
      observer.observe(target?.current);
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const current = target?.current;
      if (current) {
        observer.unobserve(current);
      }
    };
  })

  const getTodo = async (page: number) => {
    try {
      setIsTodoLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/archived?page=${page}`,
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
        const {
          data: {
            todos = [],
            totalPages = 0,
          } = {},
        } = resData;
        setTotalPage(totalPages);
        setTodos((prevTodos) => [...prevTodos, ...todos]);
      } else {
        throw new Error("Failed to fetch todos.");
      }
    } catch (error) {
      console.error("Error fetching archived todos:", error);
    } finally {
      setIsTodoLoading(false);
    }
  };

  const removeCb = (todo: any) => {
    const uTodos = todos.filter((t) => t._id !== todo._id);
    setTodos(uTodos);
  };

  const updateCb = (todo: any) => {
    const uTodos = todos.map((t) => (t._id === todo._id ? todo : t));
    setTodos(uTodos);
  };

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {isTodoLoading && !todos.length ? (
        <div className="mt-4 text-gray-800 text-center">
          <SkeletonLoaderTodo />
        </div>
      ) : (
        <>
          {todos.length > 0 ? (
            <div>
              {todos.map((todo, index) => (
                <div
                  key={index}
                  className="mb-2 border border-gray-300 p-4 rounded shadow bg-white"
                >
                  <TodoItem
                    todo={todo}
                    disabledInput={true}
                    showUnArchive={true}
                    showDalete={true}
                    showCreatedDate={true}
                    updateCb={updateCb}
                    removeCb={removeCb}
                  />
                </div>
              ))}
              <div ref = {target}></div>
              {isTodoLoading && (
                <div className="mt-4 text-gray-800 text-center">
                  <SkeletonLoaderTodo />
                </div>
              )}
              {page > totalPage && (
                <div className="mt-4 text-gray-800 text-center text-medium">
                  That’s all. You don’t have more archived todos.
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-center mt-8">
                <NoFocus />
              </div>
              <div className="text-xl text-center mt-2 text-red-500">
                No archived todos!
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
