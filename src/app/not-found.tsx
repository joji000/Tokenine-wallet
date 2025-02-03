import NotFound from '@/components/NotFound'
import { Box } from '@mui/material'

const NotFoundPage = () => 
    <Box sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        }}>
        <NotFound />
    </Box>

export default NotFoundPage
