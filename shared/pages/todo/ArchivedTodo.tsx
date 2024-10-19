"use client";
import { useEffect, useRef, useState } from "react";
import { SkeletonLoaderTodo } from "../../components/Loader";
import { NoFocus } from "../../icons";
import useAuth from "../../hooks/auth";
import TodoItem from "./components/TodoItem";
import { useDispatch, useStore } from "@/shared/hooks/useStore";

export default function ArchivedTodo() {
  useAuth();
  const dispatch = useDispatch();
  const store = useStore();
  const target = useRef(null);
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const {
    todo: {
      archivedTodo = [],
    } = {},
  } = store;

  useEffect(() => {
    getTodo(page);
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
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
        dispatch({
          type: 'SET_ARCHIVED_TODO_LIST', 
          payload: [...archivedTodo, ...todos]
        })
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
    const uTodos = archivedTodo.filter((t: any) => t._id !== todo._id);
    dispatch({
      type: 'SET_ARCHIVED_TODO_LIST', 
      payload: uTodos
    });
  };

  const updateCb = (todo: any) => {
    const uTodos = archivedTodo.map((t: any) => (t._id === todo._id ? todo : t));
    dispatch({
      type: 'SET_ARCHIVED_TODO_LIST', 
      payload: uTodos
    });
  };

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {isTodoLoading && !archivedTodo.length ? (
        <div className="mt-4 text-gray-800 text-center">
          <SkeletonLoaderTodo />
        </div>
      ) : (
        <>
          {archivedTodo.length > 0 ? (
            <div>
              {archivedTodo.map((todo: any, index: any) => (
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
