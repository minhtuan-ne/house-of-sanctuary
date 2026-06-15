"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { createWriting, updateWriting } from "@/app/actions/writing";
import s from "./editor.module.css";

function Btn({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: ReactNode }) {
  return (
    <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} className={`${s.toolbarBtn} ${active ? s.active : ""}`} title={title}>
      {children}
    </button>
  );
}

const IconBulletList = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <circle cx="1.5" cy="2" r="1.5" />
    <rect x="4.5" y="1" width="10" height="2" rx="0.5" />
    <circle cx="1.5" cy="6.5" r="1.5" />
    <rect x="4.5" y="5.5" width="10" height="2" rx="0.5" />
    <circle cx="1.5" cy="11" r="1.5" />
    <rect x="4.5" y="10" width="10" height="2" rx="0.5" />
  </svg>
);

const IconOrderedList = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <text x="0" y="3.5" fontSize="4" fontFamily="sans-serif">1.</text>
    <rect x="4.5" y="1" width="10" height="2" rx="0.5" />
    <text x="0" y="8" fontSize="4" fontFamily="sans-serif">2.</text>
    <rect x="4.5" y="5.5" width="10" height="2" rx="0.5" />
    <text x="0" y="12.5" fontSize="4" fontFamily="sans-serif">3.</text>
    <rect x="4.5" y="10" width="10" height="2" rx="0.5" />
  </svg>
);

const IconAlignLeft = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0"  width="15" height="2" rx="0.5" />
    <rect x="0" y="3.5" width="10" height="2" rx="0.5" />
    <rect x="0" y="7"  width="15" height="2" rx="0.5" />
    <rect x="0" y="10.5" width="8"  height="2" rx="0.5" />
  </svg>
);

const IconAlignCenter = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <rect x="0"   y="0"    width="15" height="2" rx="0.5" />
    <rect x="2.5" y="3.5"  width="10" height="2" rx="0.5" />
    <rect x="0"   y="7"    width="15" height="2" rx="0.5" />
    <rect x="3.5" y="10.5" width="8"  height="2" rx="0.5" />
  </svg>
);

const IconAlignRight = () => (
  <svg width="15" height="13" viewBox="0 0 15 13" fill="currentColor" aria-hidden="true">
    <rect x="0" y="0"    width="15" height="2" rx="0.5" />
    <rect x="5" y="3.5"  width="10" height="2" rx="0.5" />
    <rect x="0" y="7"    width="15" height="2" rx="0.5" />
    <rect x="7" y="10.5" width="8"  height="2" rx="0.5" />
  </svg>
);

const IconLink = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconImage = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

type Props =
  | { authorName: string; mode?: "create" }
  | {
      authorName: string;
      mode: "edit";
      postId: string;
      postSlug: string;
      initialTitle: string;
      initialContent: string;
      initialCoverImage?: string | null;
    };

export function WritingEditor(props: Props) {
  const { authorName } = props;
  const isEdit = props.mode === "edit";

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [coverImage, setCoverImage] = useState<string | null>(
    isEdit ? (props.initialCoverImage ?? null) : null
  );
  const [uploading, setUploading] = useState(false);
  const [insertingImage, setInsertingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      ImageExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write something…" }),
    ],
    content: isEdit ? props.initialContent : "",
    editorProps: { attributes: { class: "tiptap" } },
  });

  // Subscribe to editor state so toolbar re-renders on selection/content change
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor;
      if (!e) return null;
      return {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        strike: e.isActive("strike"),
        bulletList: e.isActive("bulletList"),
        orderedList: e.isActive("orderedList"),
        blockquote: e.isActive("blockquote"),
        link: e.isActive("link"),
        alignLeft: e.isActive({ textAlign: "left" }),
        alignCenter: e.isActive({ textAlign: "center" }),
        alignRight: e.isActive({ textAlign: "right" }),
        heading1: e.isActive("heading", { level: 1 }),
        heading2: e.isActive("heading", { level: 2 }),
        heading3: e.isActive("heading", { level: 3 }),
        paragraph: e.isActive("paragraph"),
      };
    },
  });

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url ?? null;
  }

  async function handleCoverUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setCoverImage(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleContentImageUpload(file: File) {
    setInsertingImage(true);
    try {
      const url = await uploadFile(file);
      if (url) editor?.chain().focus().setImage({ src: url }).run();
    } finally {
      setInsertingImage(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("title", titleRef.current?.value ?? "");
    fd.set("content", editor?.getHTML() ?? "");
    if (coverImage) fd.set("coverImage", coverImage);
    if (isEdit) {
      startTransition(() => updateWriting(props.postId, fd));
    } else {
      startTransition(() => createWriting(fd));
    }
  }

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const headingLabel =
    editorState?.heading1 ? "H1"
    : editorState?.heading2 ? "H2"
    : editorState?.heading3 ? "H3"
    : "¶";

  return (
    <form onSubmit={handleSubmit}>
      {/* Cover image */}
      <div className={s.coverWrap}>
        {coverImage ? (
          <div className={s.coverPreview}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="Cover" className={s.coverImg} />
            <button type="button" className={s.coverRemove} onClick={() => setCoverImage(null)}>
              Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={s.coverUploadBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "+ Add cover image"}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className={s.fileInputHidden}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCoverUpload(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Title */}
      <textarea
        ref={titleRef}
        name="title"
        className={s.titleInput}
        placeholder="Title"
        rows={1}
        required
        defaultValue={isEdit ? props.initialTitle : undefined}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = el.scrollHeight + "px";
        }}
      />

      <p className={s.meta}>{authorName} · {today}</p>

      {/* Toolbar */}
      {editor && editorState && (
        <div className={s.toolbar}>
          {/* Text style */}
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editorState.bold} title="Bold"><b>B</b></Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editorState.italic} title="Italic"><i>I</i></Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editorState.underline} title="Underline"><u>U</u></Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editorState.strike} title="Strikethrough"><s>S</s></Btn>

          <span className={s.toolbarSep} />

          {/* Block type */}
          <Btn
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={editorState.paragraph && !editorState.heading1 && !editorState.heading2 && !editorState.heading3}
            title="Paragraph"
          >¶</Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editorState.heading1} title="Heading 1">H1</Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editorState.heading2} title="Heading 2">H2</Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editorState.heading3} title="Heading 3">H3</Btn>

          <span className={s.toolbarSep} />

          {/* Lists & quote */}
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editorState.bulletList} title="Bullet list"><IconBulletList /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editorState.orderedList} title="Numbered list"><IconOrderedList /></Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editorState.blockquote} title="Blockquote">"</Btn>

          <span className={s.toolbarSep} />

          {/* Alignment */}
          <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editorState.alignLeft} title="Align left"><IconAlignLeft /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editorState.alignCenter} title="Align center"><IconAlignCenter /></Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editorState.alignRight} title="Align right"><IconAlignRight /></Btn>

          <span className={s.toolbarSep} />

          {/* Link, image & divider */}
          <Btn
            onClick={() => {
              if (editorState.link) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt("URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            active={editorState.link}
            title={editorState.link ? "Remove link" : "Add link"}
          ><IconLink /></Btn>
          <Btn
            onClick={() => contentImageInputRef.current?.click()}
            title="Insert image"
          ><IconImage /></Btn>
          <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">—</Btn>
        </div>
      )}

      <input
        ref={contentImageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className={s.fileInputHidden}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleContentImageUpload(file);
          e.target.value = "";
        }}
      />

      <div className={s.editorWrap}>
        <EditorContent editor={editor} />
      </div>

      <div className={s.footer}>
        <a href={isEdit ? `/writing/${props.postSlug}` : "/writing"} className={s.cancelBtn}>Cancel</a>
        <button type="submit" disabled={pending || uploading || insertingImage} className={s.publishBtn}>
          {pending ? (isEdit ? "Saving…" : "Publishing…") : (isEdit ? "Save →" : "Publish →")}
        </button>
      </div>
    </form>
  );
}
