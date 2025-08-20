export const convertYouTubeLink = (url) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

export const convertVimeoLink = (url) => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : url;
};

export const convertDriveLink = (url) => {
  const match = url.match(/\/file\/d\/(.*?)\//);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : url;
};

export const convertDriveImageLink = (url) => {
  const match = url.match(/\/file\/d\/(.*?)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
};
