// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Link } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
// sections
import LoginForm from './LoginForm';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
    const mdUp = useResponsive('up', 'md');
    // 

    return (
        <>
            <StyledRoot>
                {/* <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, sm: 24, md: 40 },
                        left: { xs: 16, sm: 24, md: 40 },
                    }}
                /> */}
                <div className=' container flex rounded-xl'>
                    <img src="/assets/images/EASE_SFA/ease.svg" className='h-16' alt="Ease SFA Logo" />

                    {mdUp && (

                        <StyledSection>
                            <div >

                                <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                                    Hi, Welcome Back
                                </Typography>
                                <img src="/assets/loginPage.png" alt="login" />
                            </div>
                        </StyledSection>

                    )}

                    <Container maxWidth="sm">
                        <StyledContent>
                            <Typography variant="h4" gutterBottom>
                                Sign in to Ease SFA
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 5 }}>
                                Don’t have an account? {''}
                                <Link
                                    component={RouterLink}
                                    to="/"
                                    variant="subtitle3"
                                    sx={{
                                        textDecoration: 'none',
                                        color: '#007bff',
                                        '&:hover': {
                                            color: '#0056b3',
                                        }
                                    }}
                                >
                                    Get started
                                </Link>
                            </Typography>

                            {/* <Stack direction="row" spacing={2}>
                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                            </Button>

                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                            </Button>

                            <Button fullWidth size="large" color="inherit" variant="outlined">
                                <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                            </Button>
                        </Stack> */}

                            {/* <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                OR
                            </Typography>
                        </Divider> */}

                            <LoginForm />
                        </StyledContent>
                    </Container>
                </div>
            </StyledRoot>
        </>
    );
}
