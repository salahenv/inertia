"use client";
import Spinner from "@/shared/components/Spinner";
import { formatDate } from "@/shared/dateUtils";
import { useEffect, useState } from "react";

export default function DetailsModal(props: any) {
    const { 
         todo,
         closeCb,
    } = props;

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);

    const {
        _id,
        name,
    } = todo;

    useEffect(() => {
        getComments();
    }, [_id])

    const getComments = async () => {
        setIsCommentsLoading(true);
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/todo/${_id}/comments`,
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
            setComments(resData.data.comments);
          } else {
          }
        } catch (error) {
          alert(JSON.stringify(error));
        } finally {
            setIsCommentsLoading(false);
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
            setComments(resData.data.comments || []);
            setCommentText('');
          }
        } catch (error) {
          alert(JSON.stringify(error));
        } finally {
            setIsSavingComment(false);
        }
    };
  
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-100 shadow-lg w-full h-full p-6 md:max-w-lg md:h-auto md:rounded-lg relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-gray-800 font-semibold">Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => {
              closeCb();
            }}
          >
            ✖
          </button>
        </div>
        <div className="mt-8">
          <div className="text-lg text-gray-800">{name}</div>
        </div>
       
        <div className="mt-4">
          <textarea 
            placeholder="enter comment"
            rows={2} 
            value = {commentText}
            className="w-full mb-2 p-4"
            onChange={(e) => setCommentText(e.target.value)}
          >
          </textarea>
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
          {isCommentsLoading && <div>Loading...</div>}
          <div className="h-64 overflow-y-auto">
            {!isCommentsLoading &&
              comments.map((comment: any, index: number) => {
                return (
                  <div key={index} className="mb-1">
                    <div className="text-gray-800">{comment.text}</div>
                    <div className="text-xs text-gray-500">{formatDate(comment.createdAt)}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
    
    );
  }