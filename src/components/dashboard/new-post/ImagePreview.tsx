import { Box, Typography, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';

export default function ImagePreview({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        mb: 3,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.100',
        '&::before': {
          content: '""',
          display: 'block',
          paddingTop: '56.25%', // 16:9 aspect ratio
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading && <CircularProgress />}
        {error ? (
          <Typography color="error">Failed to load image</Typography>
        ) : (
          <Image
            src={url}
            alt="Preview"
            fill
            style={{ objectFit: 'cover' }}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setError(true);
              setIsLoading(false);
            }}
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
      </Box>
    </Box>
  );
}
