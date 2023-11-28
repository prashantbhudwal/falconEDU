"use client";
import { useRef } from "react";
import EditIcon from "./edit-icon";
import ProfileEditForm from "./profile-edit-form";

function EditProfileModal() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
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
        <EditIcon />
      </button>
      <dialog ref={modalRef} className="modal">
        <ProfileEditForm closeModal={closeModal} />
      </dialog>
    </>
  );
}

export default EditProfileModal;
