"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { updateClassNameByClassId } from "../mutations";
import { db } from "@/app/dragon/teacher/routers";
import { classNameSchema } from "@/app/dragon/schema";

const EditableClassName = ({ classId }: { classId: string }) => {
  const [className, setClassName] = useState("");
  const [showEditableClassName, setShowEditableClassName] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const nameOfClass = await db.class.getClassNameByClassId(classId);
      setClassName(nameOfClass);
    })();
  }, []);

  const onClassNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassName(e.target.value);
    const isValidName = classNameSchema.safeParse({ name: e.target.value });
    if (!isValidName.success) {
      setError("Warning: Message length is out of the 3-30 character limit."); // set the error message
      return;
    }
    setError("");
  };

  const updateClassNameHandler = async () => {
    try {
      const isValidName = classNameSchema.safeParse({ name: className });
      const classname = await db.class.getClassNameByClassId(classId);
      if (!isValidName.success) {
        setClassName(classname);
        setError(
          "Failed to update , Class names should be between 3 and 30 characters in length."
        ); // set the error message
        setShowEditableClassName(false);
        return;
      }
      const response = await updateClassNameByClassId(classId, className);
      if (!response) {
        setError("Failed to update , Try again later.");
        setClassName(classname);
        setShowEditableClassName(false);
      }
      setShowEditableClassName(false);
    } catch (err) {
      console.error(err);
      setError("");
      setShowEditableClassName(false);
    }
  };

  return (
    <div>
      {showEditableClassName ? (
        <div className="w-fit pb-2">
          <input
            type="text"
            value={className}
            onChange={onClassNameChange}
            autoFocus
            onBlur={updateClassNameHandler}
            className="outline-none pb-2 text-2xl pl-0 font-bold w-fit tracking-wide bg-transparent"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex gap-8 items-baseline w-fit pb-2">
            <h1 className="text-2xl font-bold tracking-wide">{className}</h1>
            <BiEditAlt
              onClick={() => setShowEditableClassName(true)}
              className="text-xl transition-all cursor-pointer box-content p-2 translate-y-2 hover:bg-accent hover:text-accent-content rounded-full"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </>
      )}
    </div>
  );
};

export default EditableClassName;
