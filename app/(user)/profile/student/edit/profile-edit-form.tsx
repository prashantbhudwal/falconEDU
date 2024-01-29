"use client";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { mutate } from "swr";
import useSWR from "swr";
import { fetchUserData, updateUser } from "./api";

function ProfileEditForm({ closeModal }: { closeModal: () => void }) {
  const { data: session, status: sessionStatus } = useSession();
  const email = session?.user?.email;

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(email ? `/api/db/user/${email}` : null, fetchUserData);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      headline: user?.teacherProfile?.bio,
    },
  });
  const onSubmit = async (data: any) => {
    try {
      await updateUser(`/api/db/user/${data.email}`, data);
      closeModal();
      mutate(`/api/db/user/${data.email}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      method="dialog"
      className="modal-box w-11/12 max-w-2xl bg-base-300 p-12 pb-16 ring ring-primary backdrop:opacity-50"
    >
      <button
        onClick={closeModal}
        className="btn btn-circle btn-ghost btn-neutral btn-sm absolute right-2 top-2 text-lg text-emerald-500"
      >
        ✕
      </button>
      <div className="flex max-w-xl flex-col items-center gap-3">
        <h1 className="mb-6 text-3xl font-bold text-slate-200">Edit Profile</h1>
        <input
          className="input input-bordered w-full max-w-md bg-slate-400 text-slate-900 placeholder:text-slate-700 focus:bg-slate-200 disabled:bg-slate-400 disabled:text-slate-700"
          type="text"
          placeholder="Full Name"
          {...register("name", { required: true, maxLength: 50 })}
          disabled
        />
        <input
          className="input input-bordered w-full max-w-md bg-slate-400 text-slate-900 placeholder:text-slate-700 focus:bg-slate-200 disabled:bg-slate-400 disabled:text-slate-700"
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
          disabled
        />
        <input
          className="input input-bordered w-full max-w-md bg-slate-400 text-slate-900 placeholder:text-slate-700 focus:bg-slate-200"
          type="text"
          placeholder="Headline"
          {...register("headline", { required: true, maxLength: 100 })}
        />

        <input
          className="btn btn-primary w-full max-w-md  text-slate-900 placeholder:text-slate-700"
          type="submit"
        />
      </div>
    </form>
  );
}

export default ProfileEditForm;
