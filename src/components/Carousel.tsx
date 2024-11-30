import React, { memo } from 'react'
import { Box } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import Carousel from 'react-material-ui-carousel'

const CarouselComponent: React.FC<{ images?: string[] }> = ({ images }) => {
  return (
    <Box sx={styles.container}>
      <Carousel
        navButtonsAlwaysVisible
        PrevIcon={<ArrowBackIos sx={{ fontSize: '20px' }}  />}
        NextIcon={<ArrowForwardIos sx={{ fontSize: '20px' }}  />}
        navButtonsWrapperProps={{
          style: {
            transform: 'translateY(43.5%)'
          },
        }}
        indicatorContainerProps={{
          style: { margin: '0.6rem 0', textAlign: 'center' },
        }}
        indicatorIconButtonProps={{
          style: { margin: '0 0.2rem', color: 'gray' },
        }}
        activeIndicatorIconButtonProps={{
          style: { color: 'black' },
        }}
        autoPlay={false}
        swipe={true}
      >
        {images?.map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Slide ${index + 1}`}
            sx={styles.image}
          />
        ))}
      </Carousel>
    </Box>
  )
}

const styles = {
  container: {
    position: 'relative',
    maxWidth: '100%',
    height: 'auto',
    padding: '1rem',
  },
  navButtons: {
    transform: 'translateY(43.5%)',
  },
  indicatorContainer: {
    margin: '0.6rem 0',
    textAlign: 'center',
  },
  indicatorIcon: {
    margin: '0 0.2rem',
    color: 'gray',
  },
  activeIndicator: {
    color: 'black',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '10px',
  }
}

export default memo(CarouselComponent)
