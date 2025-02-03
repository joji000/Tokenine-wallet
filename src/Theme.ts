'use client'

import { createTheme } from '@mui/material/styles'
import { Noto_Sans_Thai } from 'next/font/google'

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
})

const theme = createTheme({
  typography: {
    fontFamily: notoSansThai.style.fontFamily,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#6A79FA',
    },
    secondary: {
      main: '#D701A2',
    },
    grey: {
      300: '#F4F4F4',
      400: '#ADB7BE',
      500: '#E0E0E0',
      600: '#FFFFFF',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F9FAFC',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
})

theme.components = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        padding: 16,
        background: '#FFF',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 12,
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      contained: {
        background: 'linear-gradient(to right, #D40075, #4340FF)',
        color: '#FFF',
        fontWeight: 600,
        borderRadius: 20,
        '&:hover': {
          filter: 'contrast(1.2)',
        },
      },
      outlined: {
        color: theme.palette.primary.main,
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: 20,
      },
    },
  },

  MuiTypography: {
    variants: [
      {
        props: {
          color: 'gradient',
        },
        style: {
          background: 'linear-gradient(180deg, #000000 50%, #999999 110.42%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
      },
      {
        props: { variant: 'h3' },
        style: {
          fontSize: 36,
          fontWeight: 700,
        },
      },
      {
        props: { variant: 'h6' },
        style: {
          fontSize: 16,
          fontWeight: 600,
        },
      },
    ],
  },

  MuiListItemButton: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.grey[300],
        },
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '& .MuiInputBase-root': {
          borderRadius: 8,
        },
      },
    },
  },
}

export default theme
