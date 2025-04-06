// Function to generate blur data URL for image placeholder
export const getBlurDataURL = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

// Function to check image dimensions and optimize if needed
export const optimizeImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const maxWidth = 1200;
    const maxHeight = 1200;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.8);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Function to validate image before upload
export const validateImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
};
