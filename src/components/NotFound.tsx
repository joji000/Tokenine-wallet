import { Box, Button, Stack, Typography } from '@mui/material'
import Link from 'next/link'

const NotFound = () => (
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Stack spacing={2}>
      <Typography variant="h3" color="error" fontWeight="bold">
        404 - Page Not Found
      </Typography>
      <Typography>The page you are looking for does not exist.</Typography>
      <Button LinkComponent={Link} variant="contained" href="/">
        Go to Home Page
      </Button>
    </Stack>
  </Box>
)

export default NotFound
