"use client";
import { buttonIconSize, englishNiches } from "@/data/data";
import useUploadPost from "@/functionalities/useUploadPost";
import useUploadThumbnail from "@/functionalities/useUploadThumbnail";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion } from "framer-motion";
import {
  Bold,
  Highlighter,
  ImageIcon,
  Italic,
  Loader,
  Plus,
  Sparkle,
  Strikethrough,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { BsBlockquoteRight } from "react-icons/bs";
import {
  RiBubbleChartFill,
  RiH1,
  RiH2,
  RiH3,
  RiHashtag,
  RiSearchLine,
} from "react-icons/ri";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import CharacterCount from "@tiptap/extension-character-count";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import useCompletion from "@/utils/useCompletion";

const PostingThought = ({ SpecifiedNeich }: { SpecifiedNeich?: string }) => {
  const limit = 3000;
  const { user, isLoaded } = useUser();
  const { thumbnailUrl, isLoading, uploadThumbnail, clearThumbnail } =
    useUploadThumbnail();
  const [title, setTitle] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [neich, setNeich] = useState(
    SpecifiedNeich ? SpecifiedNeich : "General"
  );
  const [search, setSearch] = useState("");
  const { isLoading: gptLoading, getCompletion, result } = useCompletion();

  const filteredNiches = englishNiches.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setIsExpanded(value.trim().length > 0);
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !user) return;
    uploadThumbnail(files[0], user.id);
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Highlight,
      Placeholder.configure({
        placeholder: "Now tell me all about it here...",
      }),
      CharacterCount.configure({
        limit: limit,
      }),
    ],
    editorProps: {
      attributes: { class: "prose p-2 focus:outline-none" },
    },
  });

  const { uploadPost } = useUploadPost();

  const handleSubmitToSupa = async () => {
    if (!user?.id) return;

    await uploadPost({
      userid: user.id,
      title,
      content: editor?.getHTML() || "",
      thumbnail: thumbnailUrl || undefined,
      neich: neich,
    });

    setTitle("");
    editor?.commands.clearContent();
    clearThumbnail();
    setIsExpanded(false);
  };

  return (
    <div className="p-4 border border-foreground/10 max-w-2xl mx-auto rounded-lg">
      <div className="flex items-center justify-center text-lg font-bold opacity-50 gap-3">
        <div>Create a Bubble {SpecifiedNeich ? `in ${neich}` : ""}</div>
        <RiBubbleChartFill size={16} />
      </div>

      <div className="w-full h-px bg-foreground/5 my-3 mb-6" />

      <div className="flex items-start gap-3">
        {isLoaded ? (
          <img
            src={user?.imageUrl}
            className="size-14 rounded-full border"
            alt="profilepic"
          />
        ) : (
          <Skeleton className="size-14 rounded-full" />
        )}

        <div>
          {isLoaded ? (
            <div className="text-lg font-bold">{user?.fullName}</div>
          ) : (
            <Skeleton className="w-14 h-3 mb-4 rounded-full" />
          )}

          {SpecifiedNeich ? (
            <div>
              <div className="text-xs bg-accent w-fit px-3 py-1 rounded-md">
                {neich}
              </div>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <div className="text-xs bg-accent w-fit px-3 py-1 rounded-md">
                  {neich}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-64 scrollbar w-56">
                {/* Search Input */}
                <div className="">
                  <div className="relative">
                    <RiSearchLine
                      className="absolute left-2 top-2.5 text-gray-400"
                      size={14}
                    />
                    <Input
                      type="text"
                      placeholder="Search niche..."
                      className="pl-7 text-sm w-full"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dropdown Items */}
                {filteredNiches.length > 0 ? (
                  filteredNiches.map((item, i) => (
                    <DropdownMenuItem
                      onClick={() => {
                        setNeich(item);
                        setSearch(""); // Reset search after selection
                      }}
                      key={i}
                      className={cn(item === neich ? "bg-accent" : "")}
                    >
                      <div className="flex items-center gap-2">
                        <RiHashtag size={13} />
                        <div>{item}</div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Title Input */}
      <div className="mt-3">
        {isExpanded && (
          <div className="flex items-center gap-0.5">
            <label className="flex items-center gap-2 text-sm bg-green-100 w-fit dark:bg-green-950 px-2 py-1 rounded-md cursor-pointer hover:opacity-75">
              <input
                type="file"
                className="hidden"
                onChange={handleThumbnailChange}
                accept="image/*"
              />
              {isLoading ? (
                <Loader className=" animate-spin" size={13} />
              ) : (
                <ImageIcon size={13} />
              )}
              {thumbnailUrl ? "Change Thumbnail" : "Attach Thumbnail"}
            </label>

            {thumbnailUrl && (
              <div
                onClick={clearThumbnail}
                className="flex items-center gap-2 text-sm w-fit bg-destructive/25  px-2 py-1 rounded-md cursor-pointer hover:opacity-75"
              >
                <div>
                  <X size={13} />
                </div>
                <div>Clear Thumbnail</div>
              </div>
            )}
          </div>
        )}

        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Post Thumbnail"
            className="w-full h-40 object-cover rounded-md mt-2"
          />
        )}

        <input
          type="text"
          className="w-full font-bold p-2 mt-4 bg-transparent focus-visible:outline-none text-2xl"
          placeholder={
            SpecifiedNeich
              ? `Talk About ${neich}...`
              : "What are you thinking about..."
          }
          value={title}
          onChange={handleTitleChange}
        />
      </div>

      {/* Expandable Section */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isExpanded
            ? { height: "auto", opacity: 1 }
            : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3 }}
      >
        {isExpanded && (
          <div className="mt-1">
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <ToggleGroup type="multiple" className="bg-background border">
                  <ToggleGroupItem
                    value="h1"
                    data-state={editor.isActive("h1") ? "on" : "off"}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({
                          level: 1,
                        })
                        .run()
                    }
                  >
                    <RiH1 size={14} />
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="h2"
                    data-state={editor.isActive("h2") ? "on" : "off"}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({
                          level: 2,
                        })
                        .run()
                    }
                  >
                    <RiH2 size={14} />
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="h3"
                    data-state={editor.isActive("h3") ? "on" : "off"}
                    onClick={() =>
                      editor
                        .chain()
                        .focus()
                        .toggleHeading({
                          level: 3,
                        })
                        .run()
                    }
                  >
                    <RiH3 size={14} />
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="blockquote"
                    data-state={editor.isActive("blockquote") ? "on" : "off"}
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                  >
                    <BsBlockquoteRight size={14} />
                  </ToggleGroupItem>

                  {/* Bold */}
                  <ToggleGroupItem
                    value="bold"
                    data-state={editor.isActive("bold") ? "on" : "off"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    <Bold size={14} />
                  </ToggleGroupItem>

                  {/* Italic */}
                  <ToggleGroupItem
                    value="italic"
                    data-state={editor.isActive("italic") ? "on" : "off"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    <Italic size={14} />
                  </ToggleGroupItem>

                  {/* Strike */}
                  <ToggleGroupItem
                    value="strike"
                    data-state={editor.isActive("strike") ? "on" : "off"}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                  >
                    <Strikethrough size={14} />
                  </ToggleGroupItem>

                  {/* Highlight */}
                  <ToggleGroupItem
                    value="highlight"
                    data-state={editor.isActive("highlight") ? "on" : "off"}
                    onClick={() =>
                      editor.chain().focus().toggleHighlight().run()
                    }
                  >
                    <Highlighter size={14} />
                  </ToggleGroupItem>
                </ToggleGroup>
              </BubbleMenu>
            )}

            <div className="relative">
              <EditorContent editor={editor} spellCheck={false} />
              <div className="absolute top-0 right-0">
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => {
                      getCompletion(title);
                      editor?.commands.clearContent();
                      editor?.commands.setContent(result);
                    }}
                  >
                    <div className="size-5 cursor-pointer bg-primary rounded-full flex justify-center items-center">
                      {gptLoading ? (
                        <Loader
                          className="text-background animate-spin"
                          size={12}
                        />
                      ) : (
                        <Sparkle className="text-background" size={12} />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    Use AI to generate description
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-3">
              <Button
                onClick={handleSubmitToSupa}
                disabled={!title.trim() || isLoading}
              >
                {isLoading ? "Image Upload" : <Plus size={buttonIconSize} />}
                {isLoading ? "" : "Post"}
              </Button>
            </div>

            <div className=" mt-4">
              <div
                className={cn(
                  " text-sm opacity-75 font-bold",
                  editor?.storage.characterCount.characters() == limit
                    ? "text-destructive"
                    : ""
                )}
              >
                {editor?.storage.characterCount.characters()} / {limit}{" "}
                <span className=" text-xs opacity-50 font-normal">
                  Character
                </span>
              </div>
              <div
                className={cn(
                  " text-sm opacity-75 font-bold",
                  editor?.storage.characterCount.characters() == limit
                    ? "text-destructive"
                    : ""
                )}
              >
                {editor?.storage.characterCount.words()}
                <span className=" text-xs opacity-50 font-normal"> Word</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PostingThought;
