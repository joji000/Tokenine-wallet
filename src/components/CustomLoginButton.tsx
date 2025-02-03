'use client'
import { Button, Box, Avatar, Typography } from '@mui/material'

interface CustomLoginButton {
  logo: string
  text: string
  onClick?: () => void
}

const CustomLoginButton: React.FC<CustomLoginButton> = ({
  logo,
  text,
  onClick,
}) => (
    <Button
      onClick={onClick}
      sx={{
        width: '100%',
        borderRadius: 10,
        bgcolor: '#F2F2F7',
        textTransform: 'none',
        '&:hover': { bgcolor: '#F8F8F8' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Avatar src={logo} />
      </Box>
      <Typography
        variant="body1"
        fontWeight={500}
        color="#000000"
        sx={{
          flexGrow: 1,
          textAlign: 'center',
          mr: '40px',
        }}
      >
        {text}
      </Typography>
    </Button>
  )

export default CustomLoginButton
