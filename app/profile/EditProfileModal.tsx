"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { mutate } from "swr";
import axios from "axios";
import useSWR from "swr";
import { UserProfileData } from "../api/db/user/[email]/route";
async function fetchUserData(url: any) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user data");
  }
}
function EditProfileModal() {
  const { data: session, status: sessionStatus } = useSession();
  console.log(session);
  const email = session?.user?.email;

  const modalRef = useRef<HTMLDialogElement | null>(null);
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<UserProfileData>(
    email ? `/api/db/user/${email}` : null,
    fetchUserData
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      headline: user?.profile?.bio,
    },
  });
  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`/api/db/user/${data.email}`, {
        id: session?.user?.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        headline: data.headline,
      });
      console.log("Response", response.data);
      closeModal();
      mutate(`/api/db/user/${data.email}`);
    } catch (error) {
      console.log("Error", error);
      console.error(error);
    }
  };
  console.log(errors);
  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  return (
    <>
      <button className="edit-button" onClick={openModal}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="feather feather-edit-2 text-slate-400"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>{" "}
        </svg>
      </button>

      <dialog ref={modalRef} className="modal">
        <form
          onSubmit={handleSubmit(onSubmit)}
          method="dialog"
          className="modal-box w-11/12 max-w-2xl bg-base-300 ring ring-primary p-12 pb-16 backdrop:opacity-50"
        >
          <button
            onClick={closeModal}
            className="btn btn-neutral btn-sm btn-circle btn-ghost absolute right-2 top-2 text-emerald-500 text-lg"
          >
            ✕
          </button>
          <div className="flex flex-col gap-3 max-w-xl items-center">
            <h1 className="text-3xl font-bold text-slate-200 mb-6">
              Edit Profile
            </h1>
            <input
              className="input input-bordered w-full max-w-md bg-slate-400 placeholder:text-slate-700 text-slate-900 focus:bg-slate-200"
              type="text"
              placeholder="Full Name"
              {...register("name", { required: true, maxLength: 50 })}
            />
            <input
              className="input input-bordered w-full max-w-md bg-slate-400 placeholder:text-slate-700 text-slate-900 focus:bg-slate-200"
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <input
              className="input input-bordered w-full max-w-md bg-slate-400 placeholder:text-slate-700 text-slate-900 focus:bg-slate-200"
              type="tel"
              placeholder="Phone Number"
              {...register("phone", { required: true })}
            />
            <input
              className="input input-bordered w-full max-w-md bg-slate-400 placeholder:text-slate-700 text-slate-900 focus:bg-slate-200"
              type="text"
              placeholder="Headline"
              {...register("headline", { required: true, maxLength: 100 })}
            />

            <input
              className="btn btn-primary w-full max-w-md  placeholder:text-slate-700 text-slate-900"
              type="submit"
            />
          </div>
        </form>
      </dialog>
    </>
  );
}

export default EditProfileModal;
