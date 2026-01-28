/**
 * YouTube video ID'sini URL'den çıkarır
 * Desteklenen formatlar:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtube.com/live/VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/shorts/VIDEO_ID
 * @param {string} url 
 * @returns {string|null} 
 */
export const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};
