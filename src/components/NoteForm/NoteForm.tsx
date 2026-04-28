"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";
import type { CreateNoteData } from "@/lib/api";

interface Props {
  onClose: () => void;
}

const schema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500),
  tag: Yup.mixed<NoteTag>().required(),
});

export default function NoteForm({ onClose }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  return (
    <Formik<CreateNoteData>
  initialValues={{ title: "", content: "", tag: "Todo" }}
  validationSchema={schema}
  onSubmit={(values) => mutation.mutate(values)}
>
      <Form className={css.form}>
        <Field name="title" placeholder="Title" />
        <ErrorMessage name="title" />

        <Field as="textarea" name="content" />

        <Field as="select" name="tag">
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>

        <button type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="submit">Create</button>
      </Form>
    </Formik>
  );
}