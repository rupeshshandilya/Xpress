"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import timeFormatAgo from "../libs/utils/TimeFormat";
import { SafeUser } from "../types";

interface ReviewType {
  id: string;
  userId: string;
  listingId: string;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
  };
}

const ReviewsClient = ({
  listingId,
  userId,
  currentUser
}: {
  listingId: string;
  userId: string;
  currentUser: SafeUser | null | undefined;
}) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handleUpdating = (comment: string, id: string) => {
    ref?.current?.focus();
    setInputValue(comment);
    setIsUpdating(id);
  };

  useEffect(() => {
    const getReviews = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/api/reviews/${listingId}`);
        if (data) setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (listingId) getReviews();
  }, [listingId]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      await axios.get(`/api/paymenthistory/${listingId}`);

      if (inputValue.length < 3)
        return toast.error("Review must be greater than 3 characters");
      if (inputValue.length > 150)
        return toast.error("Review must be less than 150 character");
      const sendReview = await axios.post(`/api/reviews/${listingId}`, {
        userId: currentUser?.id,
        comment: inputValue,
      });
      if (sendReview) {
        toast.success("Review added Successfully");
        window.location.href = "";
      } else {
        toast.error("Unable to give review");
      }
    } catch (error: any) {
      if (error.response.status === 400 || error.response.status === 404) {
        toast.error("First avail the service");
      }
      console.log(error);
    } finally {
      setInputValue("");
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.delete(`/api/reviews/${reviewId}`);
      if (data) {
        toast.success("review deleted successfully");
        window.location.href = "";
      } else {
        toast.error("Unable to delete");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdate = async (reviewId: string) => {
    setIsLoading(true);
    try {
      if (inputValue.length < 3)
        return toast.error("Comment must be greater than 3 words");
      const { data } = await axios.patch(`https://book.thexpresssalon.com/api/reviews/${reviewId}`, {
        comment: inputValue,
      });
      if (data) {
        toast.success("review updated successfully");
        setIsUpdating(null);
        setInputValue("");
        window.location.href = "";
      } else {
        toast.error("Unable to delete");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-semibold">No Reviews yet!!</h1>
        <p className="text-xl font-semibold my-5">Be the first one To review</p>
        <div className="flex flex-col md:flex-row gap-y-3">
          <input
            type="text"
            placeholder="Give a review"
            value={inputValue}
            className="w-full max-w-[300px] md:max-w-[400px] outline-none border-b-2  py-3 px-2 mr-4 "
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            className="px-4 py-3 self-end w-fit bg-black text-white font-semibold rounded-xl disabled:pointer-events-none disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Share Review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-10 w-full flex flex-col relative">
        <h1 className="max-sm:text-lg sm:text-xl lg:text-3xl border-b py-2 ">
          Reviews <span className="text-sm">({reviews.length})</span>
        </h1>
        <div className="max-h-[300px] overflow-y-scroll no-scrollbar">
          {reviews?.map((review, i) => (
            <div key={i}>
              <div className="flex justify-between items-center max-sm:text-xs max-sm:gap-2 w-full px-2 border-b border-[#27272C] py-2 my-10">
                <div className="flex flex-col gap-2 ">
                  <div className="max-w-[350px] truncate">
                    Posted By - &nbsp;
                    <span className="font-semibold">
                      {review.user?.name?.toLocaleUpperCase() || "Anonymous"}
                    </span>
                    <span className="text-xs ml-3">
                      ( Posted - {timeFormatAgo(review.createdAt)})
                    </span>
                  </div>
                  <h1>{review.comment}</h1>
                </div>
                <div className="flex flex-col gap-1 ">
                  {currentUser && (review.userId === currentUser?.id || currentUser?.role === 'ADMIN') ? (
                    <div className="flex gap-2">
                      {isUpdating === review.id ? (
                        <button
                          disabled={isLoading}
                          className="px-4 py-1.5 bg-black text-white font-semibold rounded-xl disabled:pointer-events-none disabled:opacity-50"
                          onClick={() => handleUpdate(review.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="px-4 py-1.5 bg-black text-white font-semibold rounded-xl disabled:pointer-events-none disabled:opacity-50"
                          disabled={isLoading}
                          onClick={() =>
                            handleUpdating(review.comment!, review.id)
                          }
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="px-4 py-1.5 bg-black text-white font-semibold rounded-xl disabled:pointer-events-none disabled:opacity-50"
                        disabled={isLoading}
                        onClick={() => handleDelete(review.id)}
                      >
                        delete
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-between mt-10 items-center">
          <input
            type="text"
            placeholder="Give a review"
            value={inputValue}
            className="outline-none border-b-2 py-3 px-2 border-black text-lg "
            onChange={(e) => setInputValue(e.target.value)}
            ref={ref}
          />
          {!isUpdating ? (
            <button
              className="px-4 py-3 bg-black text-white font-semibold rounded-xl disabled:pointer-events-none disabled:opacity-50"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              Share Review
            </button>
          ) : (
            ""
          )}
        </div>
        {/* {isToggled && <Review onSubmit={addReview} />} */}
      </div>
    </div>
  );
};

export default ReviewsClient;
