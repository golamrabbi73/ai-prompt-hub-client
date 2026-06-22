import axios from "axios";

/**
 * Uploads an image file to imgbb and returns the hosted URL.
 * @param {File} imageFile
 * @returns {Promise<string>} hosted image URL
 */
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;
  const url = `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`;

  const res = await axios.post(url, formData);
  return res.data.data.display_url;
};