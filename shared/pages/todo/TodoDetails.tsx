"use client";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/auth";
import Spinner from "@/shared/components/Spinner";
import { formatDate } from "@/shared/dateUtils";
import { useParams } from "next/navigation";
import {
  SkeletonLoaderTodoDetails,
} from "../../components/Loader";

export default function TodoDetails() {
  useAuth();
  const params = useParams();
  const [todo, setTodo] = useState<any>({});
  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);

  const {
    todoId
  } = params;

  const {
    _id,
    name,
    comments = [],
  } = todo;

  useEffect(() => {
    getTodoDetails();
  }, [todoId]);

  const getTodoDetails = async () => {
    setIsTodoLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/details/${todoId}`,
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
        setTodo(resData.data.todo);
      } else {
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsTodoLoading(false);
    }
  };

  const createComment = async (id: string) => {
    setIsSavingComment(true);
    const payload = {
      text: commentText,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/${id}/comments`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );
      const resData = await res.json();
      if (resData.success) {
        setTodo({
          ...todo,
          comments: resData.data.comments
        });
        setCommentText("");
      }
    } catch (error) {
      alert(JSON.stringify(error));
    } finally {
      setIsSavingComment(false);
    }
  };

  return (
    <div className="bg-neutral-100 p-4 min-h-screen">
      {
        isTodoLoading ? <SkeletonLoaderTodoDetails /> :
        <div>
          <div className="mt-8">
            <div className="text-lg text-gray-800">{name}</div>
          </div>
          <div className="mt-4">
              <textarea
                placeholder="enter comment"
                rows={2}
                value={commentText}
                className="w-full mb-2 p-4"
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button
                disabled={isSavingComment || !commentText}
                className="disabled:opacity-75 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full mb-4"
                onClick={() => {
                  createComment(_id);
                }}
              >
                {isSavingComment ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  "Save"
                )}
              </button>

              { comments.length ?
                comments.map((comment: any, index: number) => {
                  return (
                    <div key={index} className="mb-1">
                      <div className="text-gray-800">{comment.text}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  );
                }) : <div className="text-center text-gray-400">No Comments Found</div>
              }
          </div>
        </div>
      }
    </div>
  );
}
