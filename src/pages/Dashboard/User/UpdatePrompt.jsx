// src/pages/Dashboard/User/UpdatePrompt.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { uploadImage } from "../../../utils/imageUpload";

const CATEGORIES = [
  "Writing", "Coding", "Marketing", "Design",
  "Education", "Business", "Creative", "Research",
];

const AI_TOOLS = [
  "ChatGPT", "Gemini", "Claude", "Midjourney",
  "Stable Diffusion", "Copilot",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

const UpdatePrompt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { data: prompt, isLoading } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/prompts/${id}`
      );
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (prompt) {
      reset({
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        category: prompt.category,
        aiTool: prompt.aiTool,
        difficulty: prompt.difficulty,
        visibility: prompt.visibility,
        tags: prompt.tags?.join(", ") || "",
        usageInstructions: prompt.usageInstructions || "",
      });
      if (prompt.image) setImagePreview(prompt.image);
    }
  }, [prompt, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = prompt.image || "";
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      } else if (!imagePreview) {
        imageUrl = "";
      }

      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const updatedPrompt = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        aiTool: data.aiTool,
        tags: tagsArray,
        difficulty: data.difficulty,
        visibility: data.visibility,
        image: imageUrl,
        usageInstructions: data.usageInstructions || "",
        status: "pending",
      };

      await axiosSecure.put(`/prompts/${id}`, updatedPrompt);

      toast.success("Prompt updated! Re-submitted for review.");
      navigate("/dashboard/my-prompts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update prompt");
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Update Prompt
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Editing a prompt resets its status to pending for re-approval.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-accent">Title is required</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Short Description
          </label>
          <textarea
            {...register("description", { required: true })}
            rows={2}
            className="w-full resize-none border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-accent">Description is required</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Prompt Content
          </label>
          <textarea
            {...register("content", { required: true })}
            rows={6}
            className="w-full resize-none border border-base-300 bg-base-200 px-3 py-2.5 font-mono text-sm outline-none"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-accent">Prompt content is required</p>
          )}
        </div>

        {/* Category + AI Tool */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              AI Tool
            </label>
            <select
              {...register("aiTool", { required: true })}
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
            >
              {AI_TOOLS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty + Visibility */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              Difficulty
            </label>
            <select
              {...register("difficulty")}
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
              Visibility
            </label>
            <select
              {...register("visibility")}
              className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
            >
              <option value="public">Public (Free)</option>
              <option value="private">Private (Premium only)</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Tags (comma separated)
          </label>
          <input
            {...register("tags")}
            className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
          />
        </div>

        {/* Usage Instructions */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Usage Instructions (optional)
          </label>
          <textarea
            {...register("usageInstructions")}
            rows={3}
            placeholder="e.g. Replace [TOPIC] with your subject. Works best with GPT-4..."
            className="w-full resize-none border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
          />
        </div>

        {/* Image upload */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Sample Output Image (optional)
          </label>

          {imagePreview ? (
            <div className="relative w-fit">
              <img
                src={imagePreview}
                alt="preview"
                className="h-32 w-32 border border-base-300 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -right-2 -top-2 rounded-full bg-accent p-1 text-white"
              >
                <FiX size={12} />
              </button>
            </div>
          ) : (
            <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-base-300 bg-base-200 text-base-content/40 hover:border-secondary hover:text-secondary">
              <FiUploadCloud size={22} />
              <span className="text-[10px]">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="btn btn-primary"
        >
          {uploading
            ? "Uploading image..."
            : isSubmitting
            ? "Updating..."
            : "Update Prompt"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePrompt;