import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiUploadCloud, FiX } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { uploadImage } from "../../../utils/imageUpload";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CATEGORIES = [
  "Writing", "Marketing", "Coding", "Art & Design",
  "Business", "Education", "Productivity", "Other",
];

const AI_TOOLS = [
  "ChatGPT", "Claude", "Gemini", "Midjourney",
  "DALL-E", "Stable Diffusion", "Other",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Pro"];

const AddPrompt = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { visibility: "public", difficulty: "Beginner" },
  });

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
      let imageUrl = "";
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
        setUploading(false);
      }

      const tagsArray = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const newPrompt = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        aiTool: data.aiTool,
        tags: tagsArray,
        difficulty: data.difficulty,
        visibility: data.visibility,
        image: imageUrl,
        creatorEmail: user.email,
        creatorName: user.displayName,
      };

      await axiosSecure.post(`/prompts`, newPrompt);

      toast.success("Prompt submitted! Waiting for admin approval.");
      navigate("/dashboard/my-prompts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit prompt");
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-base-content">
        Add New Prompt
      </h1>
      <p className="mt-1 text-sm text-base-content/60">
        Share a prompt with the Promptarium community. New prompts are
        reviewed before going live.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        {/* Title */}
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.15em] text-base-content/60">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="e.g. Cold Email Generator"
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
            placeholder="One or two lines describing what this prompt does"
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
            placeholder="Write the full prompt text here..."
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
              defaultValue=""
            >
              <option value="" disabled>Select category</option>
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
              defaultValue=""
            >
              <option value="" disabled>Select AI tool</option>
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
            placeholder="email, outreach, copywriting"
            className="w-full border border-base-300 bg-base-200 px-3 py-2.5 text-sm outline-none"
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
            ? "Submitting..."
            : "Submit Prompt"}
        </button>
      </form>
    </div>
  );
};

export default AddPrompt;