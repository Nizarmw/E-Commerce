import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme, variant, elevation }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create(['box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  ...(variant === 'outlined' && {
    border: `2px solid ${theme.palette.primary.main}10`,
  }),
  ...(variant === 'elevated' && {
    border: 'none',
  }),
}));

const Card = ({
  children,
  variant = 'default',
  elevation = 1,
  ...props
}) => {
  return (
    <StyledPaper variant={variant} elevation={elevation} {...props}>
      {children}
    </StyledPaper>
  );
};

const CardHeader = ({ children, ...props }) => (
  <Box
    sx={{
      px: 3,
      py: 2,
      borderBottom: 1,
      borderColor: 'divider',
      fontFamily: 'Poppins'
    }}
    {...props}
  >
    {children}
  </Box>
);

const CardContent = ({ children, ...props }) => (
  <Box sx={{ px: 3, py: 2 }} {...props}>
    {children}
  </Box>
);

const CardFooter = ({ children, ...props }) => (
  <Box
    sx={{
      px: 3,
      py: 2,
      borderTop: 1,
      borderColor: 'divider'
    }}
    {...props}
  >
    {children}
  </Box>
);

const CardImage = ({ src, alt, ...props }) => (
  <Box
    sx={{
      position: 'relative',
      width: '100%',
      height: '200px',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderTopLeftRadius: (theme) => theme.shape.borderRadius * 2,
        borderTopRightRadius: (theme) => theme.shape.borderRadius * 2,
      }
    }}
    {...props}
  >
    <img src={src} alt={alt} />
  </Box>
);

const CardTitle = ({ children, ...props }) => (
  <Typography
    variant="h6"
    color="primary"
    fontFamily="Poppins"
    fontWeight="600"
    {...props}
  >
    {children}
  </Typography>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;
Card.Title = CardTitle;

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'outlined', 'elevated']),
  elevation: PropTypes.number,
};

export default Card;