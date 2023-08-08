"use client";
import { useRef } from "react";

function UpgradeModal() {
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
      <button className="btn btn-accent mb-4" onClick={openModal}>
        Upgrade Now
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="card w-96 bg-white shadow-xl">
          <div className="card-body flex flex-col items-center">
            <h2 className="card-title">
              You can upgrade after your trial expires or drop a WhatsApp
              message at +91 9833045490
            </h2>
            <div className="card-actions justify-end">
              <button className="btn btn-wide btn-accent" onClick={closeModal}>
                Okay
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default UpgradeModal;
